const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const geminiConfig = require('../config/gemini');
const { generateContent } = require('../utils/geminiClient');
const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');

// AI food analysis endpoint
router.post('/analyze', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { 
            food_name, 
            temperature, 
            humidity, 
            gas_level, 
            storage_time,
            food_type_id 
        } = req.body;

        // Validate required fields
        if (!food_name || !temperature || !humidity || !gas_level) {
            return res.status(400).json({ error: 'Food name and sensor data are required' });
        }

        // Get food type information if provided
        let foodTypeInfo = null;
        if (food_type_id) {
            const typeQuery = "SELECT * FROM food_types WHERE type_id = ?";
            const types = await db.query(typeQuery, [food_type_id]);
            if (types.length > 0) {
                foodTypeInfo = types[0];
            }
        }

        // Analyze food safety based on sensor data and food type
        const analysis = await analyzeFoodSafety(food_name, temperature, humidity, gas_level, storage_time, foodTypeInfo);

        // Store analysis result
        const analysisQuery = "INSERT INTO ai_analysis (user_id, food_name, temperature, humidity, gas_level, storage_time, food_type_id, analysis_result, safety_score, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        await db.query(analysisQuery, [
            userId,
            food_name,
            temperature,
            humidity,
            gas_level,
            storage_time || null,
            food_type_id || null,
            JSON.stringify(analysis.result),
            analysis.safety_score,
            JSON.stringify(analysis.recommendations)
        ]);

        // Log the analysis
        await Auth.logActivity(userId, `AI analysis performed for ${food_name}`, db);

        res.status(200).json({
            success: true,
            analysis: analysis,
            message: 'Food safety analysis completed'
        });

    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// AI Chat Endpoint (Gemini) - Updated to use Gemini API
router.post('/chat', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { message, context } = req.body;

        if (!message || trim(message) === '') {
            return res.status(400).json({ error: 'Missing message' });
        }

        // If Gemini API key is missing, fall back to deterministic gas-emission analysis
        if (!geminiConfig.apiKey) {
            const { foodType, temp, humidity, gas } = req.body;
            if (!foodType || temp === null || temp === undefined || 
                humidity === null || humidity === undefined || 
                gas === null || gas === undefined) {
                return res.status(400).json({
                    error: 'Missing required fields: foodType, temp, humidity, gas'
                });
            }

            const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
            const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(gas);

            const analysis = {
                riskLevel: gasAnalysis.riskLevel === 'high' ? 'High' : gasAnalysis.riskLevel === 'medium' ? 'Medium' : 'Low',
                riskScore: gasAnalysis.probability,
                summary: gasAnalysis.recommendation,
                keyFactors: ['Gas emission analysis', 'Sensor readings'],
                recommendations: {
                    main: gasAnalysis.recommendation,
                    details: [
                        'Monitor gas levels closely',
                        'Check for visible signs of spoilage',
                        'Verify sensor readings are accurate'
                    ]
                },
                estimatedShelfLifeHours: gasAnalysis.riskLevel === 'high' ? 0 : gasAnalysis.riskLevel === 'medium' ? 12 : 48,
                notes: 'Gemini disabled – using gas-emission analysis.',
                spoilage_status: gasAnalysis.riskLevel === 'high' ? 'unsafe' : gasAnalysis.riskLevel === 'medium' ? 'caution' : 'safe'
            };

            try {
                await Auth.logActivity(req.user.user_id, `AI analysis (fallback) for ${foodType}`, db);
            } catch {}
            return res.json({ analysis });
        }

        const userMessage = trim(message);
        const contextData = context && typeof context === 'object' ? context : {};

        // Build context string (same as PHP version)
        const contextParts = [];
        if (contextData.foodType && contextData.foodType !== '') {
            contextParts.push(`Food Type: ${contextData.foodType}`);
        }
        if (contextData.temp && contextData.temp !== '') {
            contextParts.push(`Temperature (°C): ${contextData.temp}`);
        }
        if (contextData.humidity && contextData.humidity !== '') {
            contextParts.push(`Humidity (%): ${contextData.humidity}`);
        }
        if (contextData.gas && contextData.gas !== '') {
            contextParts.push(`Gas Level: ${contextData.gas}`);
        }
        const contextString = contextParts.length > 0 ? 
            (`Current sensor data -> ${contextParts.join(' | ')}`) : '';

        // System instruction to steer the model (same as PHP version)
        const systemInstruction = 'You are an AI assistant for a spoilage monitoring system. '
            + 'Your allowed scope: food safety, spoilage risks, storage, handling, shelf-life, hygiene, sensor data interpretation (temperature, humidity, gas/VOC). '
            + 'If a request is out of scope (math, general knowledge, unrelated advice), respond with: "Sorry, I can only help with food spoilage and sensor analysis. Try asking about temperature, humidity, gas levels, storage, or shelf-life." Do not provide an out-of-scope answer. '
            + 'Use the provided sensor data context when relevant. Be concise (<=6 sentences), practical, and actionable. '
            + 'Answer in the same language as the user message. If the user uses inappropriate language, reply: "Sorry, I cannot answer that."';
            + 'If are a Filipino and you should answer in Filipino. if the user is not Filipino, you should answer in english.';
            + 'if the user say hi, hello, or anything related to greeting, you should answer politely and in english.';
            + 'if the user say goodbye, thank you, or anything related to goodbye, you should answer politely and in english.';
            + 'if ther user say kamusta, or anything related to filipino greeting, you should answer politely and in filipino.';
            + 'if the user say paalam of anything related to filipino goodbye, you should answer politely and in filipino.';

        // Build prompt parts
        const promptParts = [];
        if (contextString !== '') {
            promptParts.push(contextString);
        }
        promptParts.push(`User: ${userMessage}`);
        const fullPrompt = promptParts.join('\n\n');

        const payload = {
            'contents': [{
                'role': 'user',
                'parts': [{
                    'text': systemInstruction + '\n\n' + fullPrompt
                }]
            }],
            'generationConfig': {
                'temperature': 0.7,
                'topK': 40,
                'topP': 0.95,
                'maxOutputTokens': 512
            }
        };

        // Make request to Gemini API
        const url = `${geminiConfig.baseUrl}/${geminiConfig.model}:generateContent?key=${encodeURIComponent(geminiConfig.apiKey)}`;
        let response;
        try {
            response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
            });
        } catch (networkErr) {
            // Network error – fall back
            const fallback = await generateAIResponse(userMessage, contextString ? ` ${contextString}` : '');
            try { await Auth.logActivity(userId, 'AI chat (fallback: network)', db); } catch {}
            return res.json({ reply: fallback, raw: { _mode: 'fallback', reason: 'network error' } });
        }

        if (!response.ok) {
            // API returned error – fall back instead of propagating error to client
            const errorData = await response.json().catch(() => ({}));
            const fallback = await generateAIResponse(userMessage, contextString ? ` ${contextString}` : '');
            try { await Auth.logActivity(userId, 'AI chat (fallback: api error)', db); } catch {}
            return res.json({ reply: fallback, raw: { _mode: 'fallback', reason: 'Gemini API error', details: errorData } });
        }

        const json = await response.json();

        // Parse reply text from candidates (same as PHP version)
        let replyText = '';
        if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) {
            const parts = json.candidates[0].content.parts;
            for (const part of parts) {
                if (part.text) {
                    replyText += part.text;
                }
            }
        }

        if (trim(replyText) === '') {
            replyText = 'Sorry, I could not generate a response.';
        }

        // Chat conversation logging removed - ai_chat table not available

        // Log the chat activity
        try {
            await Auth.logActivity(userId, 'AI chat conversation', db);
        } catch (logError) {
            console.warn('Failed to log chat activity:', logError.message);
        }

        res.json({
            reply: replyText,
            raw: json
        });

    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ error: 'Internal server error during AI chat' });
    }
});

// Helper function to trim strings
function trim(str) {
    return typeof str === 'string' ? str.trim() : '';
}

// Get AI analysis history for authenticated user
router.get('/analysis-history', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { limit = 20, offset = 0 } = req.query;

        const historyQuery = "SELECT * FROM ai_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        const analysisHistory = await db.query(historyQuery, [userId, parseInt(limit), parseInt(offset)]);

        // Get total count
        const countQuery = "SELECT COUNT(*) as total FROM ai_analysis WHERE user_id = ?";
        const countResult = await db.query(countQuery, [userId]);

        res.status(200).json({
            success: true,
            analysis_history: analysisHistory,
            total: countResult[0].total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

    } catch (error) {
        console.error('Get AI analysis history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get AI chat history for authenticated user
router.get('/chat-history', Auth.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { limit = 50, offset = 0 } = req.query;

        // Return empty history since ai_chat table is not available
        res.status(200).json({
            success: true,
            chat_history: [],
            total: 0,
            limit: parseInt(limit),
            offset: parseInt(offset),
            message: 'Chat history not available - ai_chat table not configured'
        });

    } catch (error) {
        console.error('Get AI chat history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to analyze food safety
async function analyzeFoodSafety(foodName, temperature, humidity, gasLevel, storageTime, foodType) {
    let safetyScore = 100;
    let result = 'SAFE';
    let recommendations = [];

    // Gas level analysis using centralized gas emission analysis - PRIMARY INDICATOR
    const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(gasLevel);
    
    // Environmental analysis using baseline conditions - SECONDARY TO GAS EMISSION
    const envAnalysis = gasEmissionAnalysis.analyzeEnvironmentalConditions(temperature, humidity);
    
    // Temperature analysis based on baseline (24°C from 22-26°C range) - ONLY IF GAS IS LOW RISK
    if (gasAnalysis.riskLevel === 'low') {
        if (envAnalysis.tempRisk === 'high') {
            // For extremely high temperatures (>35°C), this should be UNSAFE
            safetyScore -= 40; // Reduced penalty for high temperature risk
            result = 'UNSAFE';
            recommendations.push('Temperature is dangerously high for food storage. Food spoilage risk is very high. Refrigerate immediately or discard.');
        } else if (envAnalysis.tempRisk === 'medium') {
            safetyScore -= 15; // Reduced penalty for medium temperature risk
            if (result === 'SAFE') result = 'CAUTION';
            recommendations.push('Temperature is above optimal range. Monitor closely and consider cooler storage.');
        } else if (temperature < 0) {
            safetyScore -= 10;
            result = 'CAUTION';
            recommendations.push('Temperature is very low. Some foods may freeze and lose quality.');
        }

        // Humidity analysis based on baseline (73.8%) - ONLY IF GAS IS LOW RISK
        if (envAnalysis.humidityRisk === 'high') {
            safetyScore -= 25;
            if (result === 'SAFE') result = 'CAUTION';
            recommendations.push('Humidity is significantly above normal for your location. This can promote bacterial growth.');
        } else if (envAnalysis.humidityRisk === 'medium') {
            safetyScore -= 10;
            if (result === 'SAFE') result = 'CAUTION';
            recommendations.push('Humidity is slightly above normal for your location. Monitor food condition closely.');
        }
    }
    
    // Apply gas emission analysis results
    if (gasAnalysis.riskLevel === 'high') {
        // High Risk (400+ ppm) - OVERRIDE ALL OTHER FACTORS
        safetyScore = 20; // Force low safety score
        result = 'UNSAFE';
        recommendations.push(gasAnalysis.recommendation);
    } else if (gasAnalysis.riskLevel === 'medium') {
        // Medium Risk (200-399 ppm) - OVERRIDE ENVIRONMENTAL FACTORS
        safetyScore = 60; // Set to medium risk score
        result = 'CAUTION';
        recommendations.push(gasAnalysis.recommendation);
    } else if (gasAnalysis.riskLevel === 'low') {
        // Low Risk (0-199) - Start with high safety score, environmental factors can reduce it
        safetyScore = 90; // Start with high safety score for low gas levels
        result = 'SAFE';
        
        if (gasLevel > 150) {
            safetyScore -= 10; // Minor adjustment for rising gas levels
            if (result === 'SAFE') result = 'CAUTION';
        }
        
        // Environmental factors (already applied above if gas is low risk)
        recommendations.push(gasAnalysis.recommendation);
    } else {
        // Invalid gas level
        recommendations.push(gasAnalysis.recommendation);
    }

    // Storage time analysis
    if (storageTime) {
        const hours = parseInt(storageTime);
        if (hours > 48) {
            safetyScore -= 20;
            if (result === 'SAFE') result = 'CAUTION';
            recommendations.push('Food has been stored for over 48 hours. Check for signs of spoilage.');
        } else if (hours > 3) {
            safetyScore -= 10;
            if (result === 'SAFE') result = 'CAUTION';
            recommendations.push('Food has been stored for over 3 hours. Monitor closely.');
        }
    }

    // Use standardized environmental thresholds for all food types

    // Ensure safety score doesn't go below 0
    safetyScore = Math.max(0, safetyScore);

    // Final result determination - Gas emission takes priority
    if (gasAnalysis.riskLevel === 'high') {
        result = 'UNSAFE'; // Gas emission overrides all other factors
    } else if (gasAnalysis.riskLevel === 'medium') {
        result = 'CAUTION'; // Gas emission overrides environmental factors
    } else if (gasAnalysis.riskLevel === 'low') {
        // For low gas levels, environmental factors can only downgrade to CAUTION, not UNSAFE
        if (safetyScore < 75) {
            result = 'CAUTION';
        } else {
            result = 'SAFE'; // Low gas levels = safe, regardless of environmental factors
        }
    }
    
    // Fallback to safety score if gas analysis fails
    if (!gasAnalysis.riskLevel) {
        if (safetyScore < 50) {
            result = 'UNSAFE';
        } else if (safetyScore < 75) {
            result = 'CAUTION';
        }
    }

    return {
        result: result,
        safety_score: safetyScore,
        recommendations: recommendations,
        analysis_details: {
            environmental: envAnalysis,
            temperature_impact: envAnalysis.tempRisk,
            humidity_impact: envAnalysis.humidityRisk,
            gas_impact: gasAnalysis.riskLevel,
            storage_impact: storageTime && parseInt(storageTime) > 24 ? 'High' : 'Low',
            baseline_conditions: {
                temperature: envAnalysis.baselineTemp,
                humidity: envAnalysis.baselineHumidity
            }
        }
    };
}

// Helper function to generate AI response
async function generateAIResponse(userMessage, sensorContext) {
    // Simple rule-based AI response system
    // In a real application, this would integrate with OpenAI, Claude, or similar AI service
    
    const message = userMessage.toLowerCase();
    let response = '';

  // Friendly handling for greetings, thanks, and farewells (EN + Filipino)
  const isGreeting = /(\bhi\b|\bhello\b|\bhey\b|\bgood\s*(morning|afternoon|evening)\b|how are you|how's it going)/i.test(userMessage);
  const isThankYou = /(thank you|thanks|salamat)/i.test(userMessage);
  const isGoodbye = /(goodbye|bye|see you|paalam)/i.test(userMessage);
  const isFilipinoGreeting = /(kamusta|kumusta)/i.test(userMessage);

  if (isFilipinoGreeting) {
      return 'Kamusta! Makakatulong ako tungkol sa food spoilage at sensor analysis. Maaari kang magtanong tungkol sa temperatura, humidity, gas level, storage, o shelf-life.';
  }
  if (isGreeting) {
      return 'Hi! I can help with food spoilage and sensor analysis. Ask about temperature, humidity, gas levels, storage, or shelf-life.';
  }
  if (isThankYou) {
      return 'You’re welcome! If you have sensor readings, I can help interpret them.';
  }
  if (isGoodbye) {
      return 'Take care! Keep food stored at safe temperatures and monitor gas levels.';
  }

    if (message.includes('temperature') || message.includes('temp')) {
        response = 'Temperature is a critical factor in food safety. Most foods should be stored below 4°C (40°F) to prevent bacterial growth.';
        if (sensorContext) {
            response += sensorContext;
        }
    } else if (message.includes('humidity') || message.includes('moisture')) {
        response = 'High humidity can promote bacterial growth and mold formation. Aim to keep storage areas dry and well-ventilated.';
    } else if (message.includes('gas') || message.includes('smell')) {
        response = 'Gas sensors detect volatile compounds that indicate food spoilage. High gas levels often mean food should be discarded.';
    } else if (message.includes('spoilage') || message.includes('rotten')) {
        response = 'Food spoilage can be detected through changes in smell, appearance, texture, and sensor readings. When in doubt, throw it out.';
    } else if (message.includes('storage') || message.includes('keep')) {
        response = 'Proper food storage involves maintaining correct temperature, humidity, and using appropriate containers. Different foods have different requirements.';
    } else if (message.includes('safe') || message.includes('dangerous')) {
        response = 'Food safety depends on temperature, humidity, storage time, and food type. Our sensors help monitor these conditions in real-time.';
    } else {
        response = 'I can help you with food safety questions related to temperature, humidity, gas levels, storage, and spoilage detection. What would you like to know?';
    }

    return response;
}

// AI Spoilage Analysis Endpoint (Gemini)
// POST JSON: { foodType: string, temp: number, humidity: number, gas: number }
router.post('/ai-analyze', Auth.authenticateToken, async (req, res) => {
    try {
        // If Gemini API key is missing, return a simple rule-based response instead of 500
        if (!geminiConfig.apiKey) {
            const ctx = context && typeof context === 'object' ? context : {};
            const sensorCtx = (ctx.foodType || ctx.temp || ctx.humidity || ctx.gas)
                ? ` Current sensor data -> ${[ctx.foodType?`Food Type: ${ctx.foodType}`:'', ctx.temp!==''&&ctx.temp!==undefined?`Temperature (°C): ${ctx.temp}`:'', ctx.humidity!==''&&ctx.humidity!==undefined?`Humidity (%): ${ctx.humidity}`:'', ctx.gas!==''&&ctx.gas!==undefined?`Gas Level: ${ctx.gas}`:''].filter(Boolean).join(' | ')}`
                : '';
            const reply = await generateAIResponse(String(message || ''), sensorCtx);
            try { await Auth.logActivity(userId, 'AI chat (fallback)', db); } catch {}
            return res.json({ reply, raw: { _mode: 'fallback', reason: 'GEMINI_API_KEY missing' } });
        }

        const { foodType, temp, humidity, gas } = req.body;

        // Validate required fields
        if (!foodType || temp === null || temp === undefined || 
            humidity === null || humidity === undefined || 
            gas === null || gas === undefined) {
            return res.status(400).json({
                error: 'Missing required fields: foodType, temp, humidity, gas'
            });
        }

        // Validate data types
        if (typeof foodType !== 'string' || foodType.trim() === '') {
            return res.status(400).json({
                error: 'foodType must be a non-empty string'
            });
        }

        if (typeof temp !== 'number' || typeof humidity !== 'number' || typeof gas !== 'number') {
            return res.status(400).json({
                error: 'temp, humidity, and gas must be numbers'
            });
        }

        // Use proper analysis with updated thresholds instead of hardcoded heuristics

        const systemInstruction = 'You are an AI food spoilage risk analyst for a sensor-driven monitoring system. '
            + 'Given food type and current sensor readings (temperature in °C, humidity in %, and gas level from a VOC sensor), '
            + 'assess spoilage risk and return ONLY a valid JSON object. '
            + 'CRITICAL: Gas emission thresholds are the PRIMARY indicator of spoilage: '
            + 'Low Risk (0-120 ppm): Fresh/Safe - Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed. '
            + 'Medium Risk (121-250 ppm): Early Spoilage Signs - Consume soon (within 1-2 days). Refrigerate immediately if not yet stored. Check for changes in smell, texture, or color. '
            + 'High Risk (251+ ppm): Spoilage Detected - Do not consume. Dispose of the food to avoid foodborne illness. Sanitize storage area to prevent cross-contamination. '
            + 'LOCATION-SPECIFIC ENVIRONMENTAL CONDITIONS: Container Temperature 22-26°C (empty container baseline), Humidity 40-60% (normal). '
            + 'These are the baseline environmental conditions for this specific location when the container is empty. '
            + 'Gas emission levels take PRIORITY over temperature and humidity readings for spoilage assessment. '
            + 'Use food-safety knowledge and typical thresholds for different food categories. '
            + 'If uncertain, make a best-effort estimate based on comparable foods. Keep reasoning concise. '
            + 'IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no additional text.';

        // Request structured JSON output
        const schema = {
            riskLevel: 'Low|Medium|High',
            riskScore: '0-100 integer where 100 = highest risk',
            summary: '1-2 sentence overview of risk',
            keyFactors: ['list of the most important contributing factors'],
            recommendations: ['list of short actionable steps'],
            estimatedShelfLifeHours: 'approx remaining safe hours, integer',
            notes: 'any caveats or assumptions'
        };

        const userPrompt = [
            `Food Type: ${foodType.trim()}`,
            `Temperature (°C): ${temp}`,
            `Humidity (%): ${humidity}`,
            `Gas Level: ${gas}`,
            '',
            `LOCATION-SPECIFIC ENVIRONMENTAL CONDITIONS:`,
            `- Container Temperature: 22-26°C (empty container baseline)`,
            `- Humidity: 40-60% (normal range)`,
            `- These are the baseline environmental conditions when container is empty`,
            `- Gas emission is the real-time food spoilage indicator (not environmental)`,
            '',
            'Return ONLY valid JSON matching this structure (no markdown, no extra text):',
            JSON.stringify(schema, null, 2)
        ];

        const json = await generateContent([
            { text: systemInstruction + '\n\n' + userPrompt.join('\n') }
        ], {
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 256
        });

        // Extract text from response
        let text = '';
        if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) {
            for (const part of json.candidates[0].content.parts) {
                if (part.text) {
                    text += part.text;
                }
            }
        }

        // Normalize possible markdown code fences and try to decode as JSON
        let analysis = null;
        let cleaned = (text || '').trim();
        
        // Strip ```json ... ``` or ``` ... ``` fences if present
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Remove any leading/trailing text that's not JSON
        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        }
        
        // Try direct parse first
        try {
            analysis = JSON.parse(cleaned);
        } catch (parseError) {
            console.log('🔍 JSON Parse Error:', parseError.message);
            console.log('🔍 Cleaned text:', cleaned.slice(0, 200));
            
            // Fallback: extract first JSON-looking block
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    analysis = JSON.parse(jsonMatch[0]);
                    console.log('✅ Successfully parsed JSON from fallback extraction');
                } catch (fallbackError) {
                    console.error('Failed to parse JSON from Gemini response (fallback):', fallbackError);
                }
            }
        }

        // Final fallback: supply a safe default object to avoid hard failure
        if (!analysis || typeof analysis !== 'object') {
            console.warn('Model did not return valid JSON. Using gas emission analysis instead. Raw:', cleaned.slice(0, 500));
            
            // Use gas emission analysis for more accurate fallback
            const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
            const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(gas);
            
            analysis = {
                riskLevel: gasAnalysis.riskLevel === 'high' ? 'High' : gasAnalysis.riskLevel === 'medium' ? 'Medium' : 'Low',
                riskScore: gasAnalysis.probability,
                summary: gasAnalysis.recommendation,
                keyFactors: ['Gas emission analysis', 'Sensor readings'],
                recommendations: {
                    main: gasAnalysis.recommendation,
                    details: [
                        'Monitor gas levels closely',
                        'Check for visible signs of spoilage',
                        'Verify sensor readings are accurate'
                    ]
                },
                estimatedShelfLifeHours: gasAnalysis.riskLevel === 'high' ? 0 : gasAnalysis.riskLevel === 'medium' ? 12 : 48,
                notes: 'Analysis based on gas emission thresholds due to AI parsing error.',
                spoilage_status: gasAnalysis.riskLevel === 'high' ? 'unsafe' : gasAnalysis.riskLevel === 'medium' ? 'caution' : 'safe'
            };
        }

        // Validate AI result against our safety analysis for consistency
        try {
            const safetyCheck = await analyzeFoodSafety(foodType, temp, humidity, gas, null, null);
            console.log('🔍 AI Analysis Validation:');
            console.log('  Gemini AI Result:', analysis.riskLevel, '(score:', analysis.riskScore, ')');
            console.log('  Safety Check Result:', safetyCheck.result, '(score:', safetyCheck.safety_score, ')');
            
            // If there's a significant mismatch, use the safety check result
            const aiRiskScore = analysis.riskScore || 50;
            const safetyRiskScore = 100 - (safetyCheck.safety_score || 50); // Convert safety score to risk score
            
            console.log('🔍 Score Details:');
            console.log('  Original Safety Score:', safetyCheck.safety_score);
            console.log('  Converted Risk Score:', safetyRiskScore);
            
            console.log('🔍 Validation Calculation:');
            console.log('  AI Risk Score:', aiRiskScore);
            console.log('  Safety Risk Score:', safetyRiskScore);
            console.log('  Difference:', Math.abs(aiRiskScore - safetyRiskScore));
            
            // Lower threshold to 20 for better validation, and also check for result mismatch
            const scoreDifference = Math.abs(aiRiskScore - safetyRiskScore);
            const resultMismatch = (analysis.riskLevel === 'High' && safetyCheck.result !== 'UNSAFE') ||
                                 (analysis.riskLevel === 'Low' && safetyCheck.result === 'UNSAFE');
            
            if (scoreDifference > 20 || resultMismatch) {
                console.log('⚠️ Significant mismatch detected, using safety analysis result');
                
                // Map safety result to risk level
                let correctedRiskLevel = 'Medium';
                if (safetyCheck.result === 'UNSAFE') {
                    correctedRiskLevel = 'High';
                } else if (safetyCheck.result === 'CAUTION') {
                    correctedRiskLevel = 'Medium';
                } else {
                    correctedRiskLevel = 'Low';
                }
                
                console.log('🔧 AI Validation Correction:');
                console.log('  Original AI Risk Level:', analysis.riskLevel);
                console.log('  Safety Check Result:', safetyCheck.result);
                console.log('  Corrected Risk Level:', correctedRiskLevel);
                console.log('  Original AI Risk Score:', analysis.riskScore);
                console.log('  Corrected Risk Score:', safetyRiskScore);
                
                analysis.riskLevel = correctedRiskLevel;
                analysis.riskScore = safetyRiskScore;
                analysis.notes = (analysis.notes || '') + ' (Validated against safety analysis)';
            }
        } catch (validationError) {
            console.warn('Failed to validate AI result:', validationError.message);
        }

        // Convert recommendations to structured format if needed
        if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
            analysis.recommendations = {
                main: analysis.recommendations[0] || 'Follow recommended actions',
                details: analysis.recommendations.slice(1) || []
            };
        }

        // Log the analysis request for activity tracking
        try {
            await Auth.logActivity(req.user.user_id, `AI analysis performed for ${foodType}`, db);
        } catch (logError) {
            console.warn('Failed to log AI analysis activity:', logError.message);
        }

        res.json({ analysis });

    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({
            error: 'Internal server error during AI analysis'
        });
    }
});

// Store AI analysis into existing ai_analysis table (no new tables)
// Removed store-analysis route since ai_analysis table is not available

// Category inference without AI (common + hard-coded mappings)
function inferCategoryFromName(foodName) {
    const name = (foodName || '').toLowerCase().trim();

    const directMap = new Map([
        ['chicken', 'Meat'], ['manok', 'Meat'],
        ['pork', 'Meat'], ['baboy', 'Meat'],
        ['beef', 'Meat'], ['baka', 'Meat'],
        ['fish', 'Seafood'], ['isda', 'Seafood'], ['salmon', 'Seafood'], ['tuna', 'Seafood'],
        ['shrimp', 'Seafood'], ['hipon', 'Seafood'],
        ['crab', 'Seafood'], ['alimango', 'Seafood'],
        ['mango', 'Fruits'], ['mangga', 'Fruits'],
        ['banana', 'Fruits'], ['saging', 'Fruits'],
        ['apple', 'Fruits'], ['orange', 'Fruits'],
        ['rice', 'Grains'], ['bigas', 'Grains'],
        ['bread', 'Grains'], ['tinapay', 'Grains'], ['pasta', 'Grains'],
        ['lettuce', 'Vegetables'], ['litsugas', 'Vegetables'],
        ['eggplant', 'Vegetables'], ['talong', 'Vegetables'],
        ['tomato', 'Vegetables'], ['kamatis', 'Vegetables'],
        ['onion', 'Vegetables'], ['sibuyas', 'Vegetables'],
        ['milk', 'Dairy'], ['gatas', 'Dairy'],
        ['cheese', 'Dairy'], ['keso', 'Dairy'],
        ['yogurt', 'Dairy']
    ]);

    if (directMap.has(name)) return directMap.get(name);

    const rules = [
        { re: /(chicken|manok|pork|baboy|beef|baka|ham|sausage|hotdog)/, cat: 'Meat' },
        { re: /(fish|isda|shrimp|hipon|crab|alimango|tuna|salmon|sardine)/, cat: 'Seafood' },
        { re: /(milk|gatas|cheese|keso|yogurt|butter|cream)/, cat: 'Dairy' },
        { re: /(rice|bigas|bread|tinapay|pasta|noodle|cereal|grain)/, cat: 'Grains' },
        { re: /(mango|mangga|banana|saging|apple|orange|fruit|grape|pineapple)/, cat: 'Fruits' },
        { re: /(lettuce|litsugas|eggplant|talong|tomato|kamatis|onion|sibuyas|carrot|vegetable|pepper|cabbage)/, cat: 'Vegetables' }
    ];
    for (const rule of rules) {
        if (rule.re.test(name)) return rule.cat;
    }
    return 'Other';
}

// Validate if input is a real food name (AI-powered)
router.post('/validate-food-name', Auth.authenticateToken, async (req, res) => {
    try {
        const { food_name } = req.body;

        if (!food_name || food_name.trim() === '') {
            return res.status(400).json({ 
                success: false,
                error: 'Food name is required',
                is_food: false
            });
        }

        const foodName = food_name.trim();

        // Check if Gemini API key is configured - AI validation is REQUIRED
        if (!geminiConfig.apiKey) {
            console.error('❌ Gemini API key not configured - AI validation unavailable');
            return res.status(503).json({ 
                success: false,
                is_food: false,
                food_name: foodName,
                error: 'AI validation service is not configured. Please contact administrator.',
                _mode: 'ai_unavailable',
                message: 'AI validation is required but not available'
            });
        }

        // Use AI to validate if it's a real food name (PRIMARY METHOD)
        // Simplified prompt to reduce token usage
        console.log(`🤖 [AI Validation] Validating food name: "${foodName}"`);
        const prompt = `Is "${foodName}" a real food name? Return ONLY JSON: {"is_food":true/false,"reason":"brief","confidence":0-100}

Valid: Banana, Chicken, Salmon, Mango, Rice, Milk, Tomato
Invalid: Table, 123, Car, Book, Computer, Test, Random`;

        try {
            // Increase maxOutputTokens to allow for thinking tokens + actual response
            // Gemini 2.5 Flash uses thinking tokens, so we need more headroom
            const response = await generateContent([{ text: prompt }], {
                temperature: 0.1,
                maxOutputTokens: 500 // Increased to allow for thinking tokens + JSON response
            });

            console.log('🤖 [AI Validation] Raw response structure:', JSON.stringify(response, null, 2));

            // Check for finish reason - if MAX_TOKENS, the response might be incomplete
            const finishReason = response?.candidates?.[0]?.finishReason;
            if (finishReason === 'MAX_TOKENS') {
                console.warn('⚠️ [AI Validation] Response hit MAX_TOKENS limit - response may be incomplete');
            }

            // Extract text from Gemini response structure (handle multiple possible formats)
            let responseText = '';
            
            // Structure 1: candidates[0].content.parts[0].text (most common Gemini format)
            if (response && response.candidates && response.candidates[0]) {
                const candidate = response.candidates[0];
                
                // Check if content.parts exists
                if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
                    // Try to find any part with text
                    for (const part of candidate.content.parts) {
                        if (part && part.text) {
                            responseText = part.text.trim();
                            break;
                        }
                    }
                    
                    // If parts array exists but is empty or has no text, log it
                    if (!responseText && candidate.content.parts.length > 0) {
                        console.warn('⚠️ [AI Validation] Parts array exists but contains no text:', candidate.content.parts);
                    } else if (!responseText && candidate.content.parts.length === 0) {
                        console.warn('⚠️ [AI Validation] Parts array is empty');
                    }
                } else if (candidate.content && !candidate.content.parts) {
                    console.warn('⚠️ [AI Validation] Content exists but parts array is missing');
                }
                
                // If still no text and finishReason is MAX_TOKENS, the response was truncated
                if (!responseText && finishReason === 'MAX_TOKENS') {
                    console.error('❌ [AI Validation] Response hit MAX_TOKENS - no text was generated');
                    console.error('❌ [AI Validation] Token usage:', {
                        promptTokens: response?.usageMetadata?.promptTokenCount,
                        totalTokens: response?.usageMetadata?.totalTokenCount,
                        thoughtsTokens: response?.usageMetadata?.thoughtsTokenCount
                    });
                    throw new Error('AI response hit token limit before generating output. The model used all tokens for thinking. Please increase maxOutputTokens or simplify the prompt.');
                }
            }
            // Structure 3: text property directly
            else if (response && response.text) {
                responseText = typeof response.text === 'function' ? response.text() : response.text;
                if (typeof responseText === 'string') {
                    responseText = responseText.trim();
                }
            }
            // Structure 4: candidates[0].text
            else if (response && response.candidates && response.candidates[0] && response.candidates[0].text) {
                responseText = response.candidates[0].text.trim();
            }
            // Structure 5: response.response.text() (async function)
            else if (response && response.response) {
                try {
                    const textResult = typeof response.response.text === 'function' ? 
                        await response.response.text() : response.response.text;
                    responseText = (textResult || '').trim();
                } catch (e) {
                    console.warn('Failed to extract text from response.response:', e);
                }
            }
            // Structure 6: direct string
            else if (typeof response === 'string') {
                responseText = response.trim();
            }

            console.log('🤖 [AI Validation] Extracted text:', responseText);
            console.log('🤖 [AI Validation] Finish reason:', finishReason);

            if (!responseText || responseText.length === 0) {
                // If MAX_TOKENS was hit, provide a more helpful error
                if (finishReason === 'MAX_TOKENS') {
                    throw new Error('AI response hit token limit. The response was too long. Please try with a shorter food name or contact support.');
                }
                throw new Error('AI did not return any text in the response. Finish reason: ' + (finishReason || 'unknown'));
            }

            // Clean the response text
            responseText = responseText.trim();
            // Remove markdown code blocks if present
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            // Remove any leading/trailing whitespace or newlines
            responseText = responseText.replace(/^\s+|\s+$/g, '');

            console.log('🤖 [AI Validation] Cleaned text:', responseText);

            let validationResult;
            try {
                // Try direct JSON parse first
                validationResult = JSON.parse(responseText);
            } catch (parseError) {
                console.warn('⚠️ Direct JSON parse failed, trying to extract JSON:', parseError.message);
                // If JSON parsing fails, try to extract JSON from the response
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch && jsonMatch[0]) {
                    try {
                        validationResult = JSON.parse(jsonMatch[0]);
                        console.log('✅ Successfully extracted JSON from response');
                    } catch (extractError) {
                        console.error('❌ Failed to parse extracted JSON:', extractError.message);
                        console.error('❌ Extracted JSON string:', jsonMatch[0]);
                        throw new Error(`Could not parse AI response as JSON. Response: ${responseText.substring(0, 200)}`);
                    }
                } else {
                    console.error('❌ No JSON object found in response');
                    console.error('❌ Response text:', responseText);
                    throw new Error(`Could not find JSON object in AI response. Response: ${responseText.substring(0, 200)}`);
                }
            }

            const isFood = validationResult.is_food === true || validationResult.is_food === 'true';
            const confidence = validationResult.confidence || (isFood ? 85 : 15);
            const reason = validationResult.reason || 'AI validation completed';

            console.log(`🔍 Food name validation: "${foodName}" -> is_food: ${isFood}, confidence: ${confidence}%`);

            res.json({
                success: true,
                is_food: isFood,
                food_name: foodName,
                confidence: confidence,
                reason: reason,
                _mode: 'ai_validation'
            });

        } catch (aiError) {
            console.error('❌ AI validation error:', aiError);
            // AI validation failed - reject the input (AI is mandatory)
            res.status(503).json({
                success: false,
                is_food: false,
                food_name: foodName,
                error: 'AI validation service encountered an error',
                details: aiError.message,
                reason: 'AI validation failed - service unavailable',
                _mode: 'ai_error',
                message: 'Unable to validate food name with AI. Please try again later.'
            });
        }

    } catch (error) {
        console.error('Error validating food name:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to validate food name', 
            details: error.message,
            is_food: false
        });
    }
});

// Category endpoint using hard-coded inference (no AI)
router.post('/generate-categories', Auth.authenticateToken, async (req, res) => {
    try {
        const { food_name } = req.body;

        if (!food_name || food_name.trim() === '') {
            return res.status(400).json({ error: 'Food name is required' });
        }

        const category = inferCategoryFromName(food_name);
        res.json({ success: true, category, food_name: food_name.trim(), _mode: 'hardcoded' });

    } catch (error) {
        console.error('Error inferring category:', error);
        res.status(500).json({ error: 'Failed to infer category', details: error.message });
    }
});

// AI Food Name Suggestions Endpoint (Gemini)
router.post('/suggest-food-names', Auth.authenticateToken, async (req, res) => {
    try {
        const { food_name } = req.body;

        if (!food_name || food_name.trim() === '') {
            return res.status(400).json({ error: 'Food name is required' });
        }

        // Check if Gemini API key is configured
        if (!geminiConfig.apiKey) {
            return res.status(500).json({
                error: 'Gemini API key is not configured. Set GEMINI_API_KEY environment variable.'
            });
        }

        const prompt = `Given the food item "${food_name.trim()}", suggest 5 specific cooking methods or preparation styles for this food, PRIORITIZING FILIPINO CUISINE.

Examples:
- For "chicken": adobo chicken, fried chicken, grilled chicken, chicken tinola, chicken curry
- For "beef": beef caldereta, beef tapa, beef sinigang, grilled beef, beef stew
- For "fish": fried fish (daing), fish sinigang, grilled fish, fish paksiw, fish soup
- For "pork": pork adobo, pork sinigang, lechon kawali, pork barbecue, pork menudo
- For "vegetables": pinakbet, ginisang gulay, vegetable lumpia, ensalada, vegetable sinigang

FILIPINO COOKING METHODS TO PRIORITIZE:
- Adobo (soy sauce + vinegar)
- Sinigang (sour soup)
- Tinola (ginger soup)
- Caldereta (tomato-based stew)
- Paksiw (vinegar-based)
- Tapa (marinated and fried)
- Daing (dried and fried)
- Lechon (roasted)
- Barbecue (grilled with Filipino marinade)
- Ginisang (sautéed)

Return ONLY a comma-separated list of specific food names with cooking methods, nothing else.`;

        const json = await generateContent([
            { text: prompt }
        ], {
            temperature: 0.2,
                topK: 1,
                topP: 0.8,
            maxOutputTokens: 64
        });

        // Extract suggestions from response
        let suggestionsText = '';
        if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) {
            suggestionsText = json.candidates[0].content.parts[0].text.trim();
        }

        // Parse comma-separated suggestions
        let suggestions = [];
        if (suggestionsText) {
            suggestions = suggestionsText.split(',').map(suggestion => suggestion.trim()).filter(suggestion => suggestion.length > 0);
        }

        // Add fallback suggestions if AI didn't return enough (Filipino cuisine prioritized)
        const fallbackSuggestions = [
            `${food_name.trim()} adobo`,
            `${food_name.trim()} (fried)`,
            `${food_name.trim()} sinigang`,
            `${food_name.trim()} (grilled)`,
            `${food_name.trim()} (soup)`
        ];
        if (suggestions.length < 3) {
            suggestions = [...suggestions, ...fallbackSuggestions.slice(0, 3 - suggestions.length)];
        }

        // Limit to 5 suggestions max
        suggestions = suggestions.slice(0, 5);
        
        res.json({
            success: true,
            suggestions: suggestions,
            food_name: food_name.trim()
        });

    } catch (error) {
        console.error('Error generating food name suggestions:', error);
        res.status(500).json({
            error: 'Failed to generate suggestions',
            details: error.message
        });
    }
});

module.exports = router;

