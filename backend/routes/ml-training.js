const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const { generateContent } = require('../utils/geminiClient');
const geminiConfig = require('../config/gemini');

// AI Text-to-JSON converter for environmental factors
router.post('/format-env-factors', Auth.authenticateToken, async (req, res) => {
    try {
        const { text, currentData } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }

        // Check if it's already valid JSON
        try {
            const parsed = JSON.parse(text.trim());
            return res.json({
                success: true,
                json: JSON.stringify(parsed, null, 2),
                wasAlreadyJson: true
            });
        } catch (e) {
            // Not valid JSON, continue to AI formatting
        }

        // Check if Gemini API is configured
        if (!geminiConfig.apiKey) {
            return res.status(503).json({
                success: false,
                message: 'AI service is not configured'
            });
        }

        // Build context from current data
        let contextInfo = '';
        if (currentData) {
            contextInfo = '\n\nCurrent sensor/form data to include:';
            if (currentData.temperature) contextInfo += `\n- Temperature: ${currentData.temperature}°C`;
            if (currentData.humidity) contextInfo += `\n- Humidity: ${currentData.humidity}%`;
            if (currentData.gas_level) contextInfo += `\n- Gas Level: ${currentData.gas_level} ppm`;
            if (currentData.food_name) contextInfo += `\n- Food Name: ${currentData.food_name}`;
            if (currentData.actual_status) contextInfo += `\n- Status: ${currentData.actual_status}`;
            contextInfo += '\n\nINCLUDE these values in your JSON output within a "storage_conditions" object with a current timestamp.';
        }

        // Calculate gas emission analysis if sensor data is available
        let gasAnalysisInfo = '';
        let statusOverride = '';
        if (currentData && currentData.gas_level !== undefined) {
            const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
            const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(Number(currentData.gas_level));
            
            gasAnalysisInfo = `\n\nGas Emission Analysis (auto-calculated from sensor):
- Risk Level: ${gasAnalysis.riskLevel}
- Status: ${gasAnalysis.status}
- Probability: ${gasAnalysis.probability}%
- Recommendation: ${gasAnalysis.recommendation}`;
            
            // If actual status differs from gas analysis status, adjust recommendation
            if (currentData.actual_status && currentData.actual_status !== gasAnalysis.status) {
                statusOverride = `\n\n⚠️ IMPORTANT: The provided status "${currentData.actual_status}" differs from the gas sensor status "${gasAnalysis.status}". 
Adjust the recommendation to match the "${currentData.actual_status}" status while incorporating the gas analysis data.`;
            }
            
            gasAnalysisInfo += '\n\nIMPORTANT: Include this complete gas_emission_analysis object in your JSON output.';
            if (statusOverride) {
                gasAnalysisInfo += statusOverride;
            }
        }
        
        // Use AI to convert text to JSON
        const prompt = `Convert the following user input into a valid JSON object for food environmental factors. 
Extract meaningful information and structure it properly based on the user's description.

Your JSON output MUST include:
1. User observations as "observations" or "notes" field
2. "storage_location": "box container" (always set this)
3. If sensor data is provided, include it in "storage_conditions" object with current timestamp${contextInfo}${gasAnalysisInfo}

User input: "${text}"

Return ONLY a valid JSON object with these fields, nothing else. No markdown, no explanations.`;


        const aiResponse = await generateContent([{ text: prompt }], {
            temperature: 0.3,
            maxOutputTokens: 500
        });

        // Debug: Log the full response structure
        console.log('🔍 Full AI Response:', JSON.stringify(aiResponse, null, 2));

        // Extract text from Gemini response structure
        let responseText = '';
        
        // Try multiple possible response structures
        if (aiResponse) {
            // Structure 1: candidates[0].content.parts[0].text
            if (aiResponse.candidates && aiResponse.candidates[0] && 
                aiResponse.candidates[0].content && aiResponse.candidates[0].content.parts && 
                aiResponse.candidates[0].content.parts[0] && aiResponse.candidates[0].content.parts[0].text) {
                responseText = aiResponse.candidates[0].content.parts[0].text.trim();
            }
            // Structure 2: text property directly
            else if (aiResponse.text) {
                responseText = aiResponse.text.trim();
            }
            // Structure 3: candidates[0].text
            else if (aiResponse.candidates && aiResponse.candidates[0] && aiResponse.candidates[0].text) {
                responseText = aiResponse.candidates[0].text.trim();
            }
        }

        console.log('📝 Extracted text:', responseText);

        if (!responseText) {
            console.error('❌ Could not extract text from AI response');
            throw new Error('AI did not return a valid response');
        }

        // Extract JSON from AI response
        let jsonText = responseText;
        
        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Try to parse to validate
        let parsedJson = JSON.parse(jsonText);
        
        // Ensure storage_location is set
        if (!parsedJson.storage_location) {
            parsedJson.storage_location = "box container";
        }
        
        // Add gas emission analysis if sensor data was provided
        if (currentData && currentData.gas_level !== undefined) {
            const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
            const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(Number(currentData.gas_level));
            
            // Only add gas emission analysis if AI didn't provide it
            if (!parsedJson.gas_emission_analysis) {
                parsedJson.gas_emission_analysis = {
                    risk_level: gasAnalysis.riskLevel,
                    status: gasAnalysis.status,
                    probability: gasAnalysis.probability,
                    recommendation: gasAnalysis.recommendation
                };
            }
            
            // Add storage conditions with current sensor data
            if (currentData.temperature !== undefined || currentData.humidity !== undefined) {
                parsedJson.storage_conditions = {
                    temperature: currentData.temperature ? Number(currentData.temperature) : undefined,
                    humidity: currentData.humidity ? Number(currentData.humidity) : undefined,
                    gas_level: Number(currentData.gas_level),
                    timestamp: new Date().toISOString()
                };
            }
            
            // Add AI analysis metadata
            parsedJson.ai_analysis = true;
            parsedJson.confidence = gasAnalysis.probability;
            parsedJson.provided_status = currentData.actual_status || gasAnalysis.status;
            parsedJson.gas_emission_override = true;
            parsedJson.timestamp = new Date().toISOString();
            
            // If provided_status differs from gas analysis, override gas_emission_analysis
            if (currentData.actual_status && parsedJson.gas_emission_analysis && currentData.actual_status !== gasAnalysis.status) {
                const providedStatus = currentData.actual_status.toLowerCase();
                const riskMapping = {
                    'safe': 'low',
                    'caution': 'medium',
                    'unsafe': 'high'
                };
                const recommendationMapping = {
                    'safe': 'Safe to consume. Store properly to maintain freshness.',
                    'caution': 'Exercise caution. Inspect thoroughly before consuming. May have minor spoilage signs.',
                    'unsafe': 'Do not consume. Dispose safely. Food shows clear signs of spoilage.'
                };
                
                parsedJson.gas_emission_analysis.risk_level = riskMapping[providedStatus] || gasAnalysis.riskLevel;
                parsedJson.gas_emission_analysis.status = providedStatus;
                parsedJson.gas_emission_analysis.recommendation = recommendationMapping[providedStatus] || gasAnalysis.recommendation;
            }
        }
        
        return res.json({
            success: true,
            json: JSON.stringify(parsedJson, null, 2),
            wasAlreadyJson: false
        });

    } catch (error) {
        console.error('Error formatting environmental factors:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to format text. Please ensure input is meaningful.',
            error: error.message
        });
    }
});

// Add ML training data (alias to match frontend: /api/ml-training/add)
router.post('/add', Auth.authenticateToken, async (req, res) => {
    try {
        const body = req.body || {};
        // Accept both camelCase (frontend) and snake_case (backend/DB) keys
        const food_name = body.food_name ?? body.foodName;
        const food_category = body.food_category ?? body.category ?? null;
        const temperature = body.temperature;
        const humidity = body.humidity;
        const gas_level = (body.gas_level != null ? body.gas_level : (body.ph != null ? body.ph : null));
        const actual_status = body.actual_status ?? body.actualStatus;
        const data_source = body.data_source ?? body.source;
        let quality_score = body.quality_score ?? body.dataQuality;
        const environmental_factors = body.environmental_factors ?? body.environmentalFactors;

        // Basic validation
        if (!food_name || temperature == null || humidity == null || gas_level == null || !actual_status) {
            return res.status(400).json({ success: false, message: 'food_name, temperature, humidity, gas_level, actual_status are required' });
        }

        const allowedStatuses = new Set(['safe','caution','unsafe']);
        if (!allowedStatuses.has(String(actual_status).toLowerCase())) {
            return res.status(400).json({ success: false, message: "actual_status must be one of: 'safe','caution','unsafe'" });
        }

        const allowedSources = new Set(['manual','sensor','user_feedback','expert']);
        const sourceToUse = allowedSources.has(String(data_source || '').toLowerCase()) ? String(data_source).toLowerCase() : 'sensor';

        // Apply gas emission analysis to determine correct spoilage status for training data
        const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
        const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(Number(gas_level));
        
        // Use gas emission analysis to determine the correct spoilage status
        let correctSpoilageStatus;
        if (gasAnalysis.riskLevel === 'low') {
            correctSpoilageStatus = 'safe'; // Gas emission says safe = safe for training data
        } else if (gasAnalysis.riskLevel === 'medium') {
            correctSpoilageStatus = 'caution'; // Gas emission says medium = caution
        } else if (gasAnalysis.riskLevel === 'high') {
            correctSpoilageStatus = 'unsafe'; // Gas emission says high = unsafe
        } else {
            correctSpoilageStatus = String(actual_status).toLowerCase(); // Fallback to provided status
        }
        
        console.log('🔍 ML Training Data Status Override:');
        console.log('  Gas Risk Level:', gasAnalysis.riskLevel);
        console.log('  Provided Status:', actual_status);
        console.log('  Corrected Status:', correctSpoilageStatus);
        
        // Validate that the status matches the database ENUM constraint
        const validStatuses = ['safe', 'caution', 'unsafe'];
        if (!validStatuses.includes(correctSpoilageStatus)) {
            console.error('❌ Invalid status for database ENUM:', correctSpoilageStatus);
            console.error('  Valid values are:', validStatuses);
            correctSpoilageStatus = 'safe'; // Fallback to safe
        }

        // Normalize inputs
        const statusToUse = correctSpoilageStatus;
        // If frontend sends percent (0-100), convert to 0-1
        if (quality_score != null && !Number.isNaN(Number(quality_score))) {
            const qn = Number(quality_score);
            quality_score = qn > 1 ? qn / 100 : qn;
        }
        const qualityToUse = (quality_score == null || Number.isNaN(Number(quality_score))) ? 1.0 : Math.max(0, Math.min(1, Number(quality_score)));

        // Parse and validate environmental_factors (accept plain text or JSON)
        let parsedEnvFactors = {};
        if (environmental_factors) {
            if (typeof environmental_factors === 'string') {
                const trimmed = environmental_factors.trim();
                if (trimmed) {
                    try {
                        parsedEnvFactors = JSON.parse(trimmed);
                    } catch (jsonError) {
                        // Not valid JSON - store as plain text in notes field
                        console.log('Plain text detected in environmental_factors, storing as notes:', trimmed.substring(0, 50));
                        parsedEnvFactors = {
                            notes: trimmed,
                            storage_location: "box container"
                        };
                    }
                }
            } else if (typeof environmental_factors === 'object') {
                parsedEnvFactors = environmental_factors;
            }
        }
        
        // Skip AI conversion - user wants plain text stored as-is
        /*
        if (environmental_factors) {
            if (typeof environmental_factors === 'string') {
                const trimmed = environmental_factors.trim();
                if (trimmed) {
                    try {
                        parsedEnvFactors = JSON.parse(trimmed);
                    } catch (jsonError) {
                        console.warn('Invalid JSON in environmental_factors, attempting AI conversion:', jsonError.message);
                        
                        // Try to use AI to convert text to JSON with full sensor data
                        if (geminiConfig.apiKey) {
                            try {
                                // Build context from current data
                                let contextInfo = '\n\nCurrent sensor/form data to include:';
                                contextInfo += `\n- Temperature: ${temperature}°C`;
                                contextInfo += `\n- Humidity: ${humidity}%`;
                                contextInfo += `\n- Gas Level: ${gas_level} ppm`;
                                if (food_name) contextInfo += `\n- Food Name: ${food_name}`;
                                contextInfo += `\n- Status: ${actual_status}`;
                                contextInfo += '\n\nINCLUDE these values in your JSON output within a "storage_conditions" object with a current timestamp.';
                                
                                let gasAnalysisInfo = `\n\nGas Emission Analysis (auto-calculated from sensor):
- Risk Level: ${gasAnalysis.riskLevel}
- Status: ${gasAnalysis.status}
- Probability: ${gasAnalysis.probability}%
- Recommendation: ${gasAnalysis.recommendation}`;
                                
                                // If actual status differs from gas analysis status, adjust recommendation
                                if (actual_status && actual_status !== gasAnalysis.status) {
                                    gasAnalysisInfo += `\n\n⚠️ IMPORTANT: The provided status "${actual_status}" differs from the gas sensor status "${gasAnalysis.status}". 
Adjust the recommendation to match the "${actual_status}" status while incorporating the gas analysis data.`;
                                }
                                
                                gasAnalysisInfo += '\n\nIMPORTANT: Include this complete gas_emission_analysis object in your JSON output.';
                                
                                const aiPrompt = `Convert the following user input into a valid JSON object for food environmental factors. 
Extract meaningful information and structure it properly based on the user's description.

Your JSON output MUST include:
1. User observations as "observations" or "notes" field
2. "storage_location": "box container" (always set this)
3. If sensor data is provided, include it in "storage_conditions" object with current timestamp${contextInfo}${gasAnalysisInfo}

User input: "${trimmed}"

Return ONLY a valid JSON object with these fields, nothing else. No markdown, no explanations.`;
                                
                                const aiResponse = await generateContent([{ text: aiPrompt }], {
                                    temperature: 0.3,
                                    maxOutputTokens: 500
                                });
                                
                                console.log('🔍 Full AI Response:', JSON.stringify(aiResponse, null, 2));
                                
                                // Extract text from Gemini response structure (try multiple formats)
                                let responseText = '';
                                if (aiResponse) {
                                    // Try structure 1: candidates[0].content.parts[0].text
                                    if (aiResponse.candidates && aiResponse.candidates[0] && 
                                        aiResponse.candidates[0].content && aiResponse.candidates[0].content.parts && 
                                        aiResponse.candidates[0].content.parts[0] && aiResponse.candidates[0].content.parts[0].text) {
                                        responseText = aiResponse.candidates[0].content.parts[0].text.trim();
                                    }
                                    // Try structure 2: text property directly
                                    else if (aiResponse.text) {
                                        responseText = aiResponse.text.trim();
                                    }
                                    // Try structure 3: candidates[0].text
                                    else if (aiResponse.candidates && aiResponse.candidates[0] && aiResponse.candidates[0].text) {
                                        responseText = aiResponse.candidates[0].text.trim();
                                    }
                                }
                                
                                console.log('📝 Extracted text:', responseText);
                                
                                if (responseText) {
                                    let jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                                    parsedEnvFactors = JSON.parse(jsonText);
                                    
                                    // Ensure all required fields are added
                                    if (!parsedEnvFactors.storage_location) {
                                        parsedEnvFactors.storage_location = "box container";
                                    }
                                    
                                    // Only add gas emission analysis if AI didn't provide it
                                    if (!parsedEnvFactors.gas_emission_analysis) {
                                        parsedEnvFactors.gas_emission_analysis = {
                                            risk_level: gasAnalysis.riskLevel,
                                            status: gasAnalysis.status,
                                            probability: gasAnalysis.probability,
                                            recommendation: gasAnalysis.recommendation
                                        };
                                    }
                                    
                                    // Add storage conditions with current sensor data
                                    parsedEnvFactors.storage_conditions = {
                                        temperature: Number(temperature),
                                        humidity: Number(humidity),
                                        gas_level: Number(gas_level),
                                        timestamp: new Date().toISOString()
                                    };
                                    
                                    // Add AI analysis metadata
                                    parsedEnvFactors.ai_analysis = true;
                                    parsedEnvFactors.confidence = gasAnalysis.probability;
                                    parsedEnvFactors.provided_status = actual_status;
                                    parsedEnvFactors.gas_emission_override = true;
                                    parsedEnvFactors.timestamp = new Date().toISOString();
                                    
                                    // If provided_status differs from gas analysis, override gas_emission_analysis
                                    if (actual_status && parsedEnvFactors.gas_emission_analysis && actual_status !== gasAnalysis.status) {
                                        const providedStatus = actual_status.toLowerCase();
                                        const riskMapping = {
                                            'safe': 'low',
                                            'caution': 'medium',
                                            'unsafe': 'high'
                                        };
                                        const recommendationMapping = {
                                            'safe': 'Safe to consume. Store properly to maintain freshness.',
                                            'caution': 'Exercise caution. Inspect thoroughly before consuming. May have minor spoilage signs.',
                                            'unsafe': 'Do not consume. Dispose safely. Food shows clear signs of spoilage.'
                                        };
                                        
                                        parsedEnvFactors.gas_emission_analysis.risk_level = riskMapping[providedStatus] || gasAnalysis.riskLevel;
                                        parsedEnvFactors.gas_emission_analysis.status = providedStatus;
                                        parsedEnvFactors.gas_emission_analysis.recommendation = recommendationMapping[providedStatus] || gasAnalysis.recommendation;
                                    }
                                    
                                    console.log('✅ AI successfully converted text to JSON with full analysis:', parsedEnvFactors);
                                } else {
                                    console.warn('⚠️ AI returned response but could not extract text');
                                }
                            } catch (aiError) {
                                console.warn('AI conversion failed, using basic structure:', aiError.message);
                                parsedEnvFactors = {
                                    notes: trimmed,
                                    storage_location: "box container"
                                };
                            }
                        } else {
                            // No AI available, create basic structure
                            parsedEnvFactors = {
                                notes: trimmed,
                                storage_location: "box container"
                            };
                        }
                    }
                }
            } else if (typeof environmental_factors === 'object') {
                parsedEnvFactors = environmental_factors;
            }
        }
        */
        
        // Ensure storage_location is always set to "box container" if not specified
        if (!parsedEnvFactors.storage_location) {
            parsedEnvFactors.storage_location = "box container";
        }
        
        // Enrich with gas emission analysis and sensor data if not already present from AI conversion
        if (Object.keys(parsedEnvFactors).length > 0) {
            // Only add if not already added by AI conversion
            if (!parsedEnvFactors.gas_emission_analysis) {
                parsedEnvFactors.gas_emission_analysis = {
                    risk_level: gasAnalysis.riskLevel,
                    status: gasAnalysis.status,
                    probability: gasAnalysis.probability,
                    recommendation: gasAnalysis.recommendation
                };
            }
            
            // Only add if not already added by AI conversion
            if (!parsedEnvFactors.storage_conditions) {
                parsedEnvFactors.storage_conditions = {
                    temperature: Number(temperature),
                    humidity: Number(humidity),
                    gas_level: Number(gas_level),
                    timestamp: new Date().toISOString()
                };
            }
            
            // Only add if not already added by AI conversion
            if (!parsedEnvFactors.ai_analysis) {
                parsedEnvFactors.ai_analysis = true;
                parsedEnvFactors.confidence = gasAnalysis.probability;
                parsedEnvFactors.provided_status = actual_status;
                parsedEnvFactors.gas_emission_override = true;
                parsedEnvFactors.timestamp = new Date().toISOString();
            } else {
                // Always update provided_status from form data, even if ai_analysis already exists
                parsedEnvFactors.provided_status = actual_status;
            }
            
            // If provided_status differs from gas analysis, override gas_emission_analysis
            if (actual_status && parsedEnvFactors.gas_emission_analysis && actual_status !== gasAnalysis.status) {
                const providedStatus = actual_status.toLowerCase();
                const riskMapping = {
                    'safe': 'low',
                    'caution': 'medium',
                    'unsafe': 'high'
                };
                const recommendationMapping = {
                    'safe': 'Safe to consume. Store properly to maintain freshness.',
                    'caution': 'Exercise caution. Inspect thoroughly before consuming. May have minor spoilage signs.',
                    'unsafe': 'Do not consume. Dispose safely. Food shows clear signs of spoilage.'
                };
                
                parsedEnvFactors.gas_emission_analysis.risk_level = riskMapping[providedStatus] || gasAnalysis.riskLevel;
                parsedEnvFactors.gas_emission_analysis.status = providedStatus;
                parsedEnvFactors.gas_emission_analysis.recommendation = recommendationMapping[providedStatus] || gasAnalysis.recommendation;
            }
        }

        // Build the final environmental_factors object
        const finalEnvFactors = JSON.stringify(parsedEnvFactors);

        console.log('🔍 ML Training Data Insertion Debug:');
        console.log('  statusToUse:', statusToUse);
        console.log('  statusToUse type:', typeof statusToUse);
        console.log('  correctSpoilageStatus:', correctSpoilageStatus);
        console.log('  Gas Risk Level:', gasAnalysis.riskLevel);
        
        const sql = `
            INSERT INTO ml_training_data
            (food_name, food_category, temperature, humidity, gas_level, actual_spoilage_status, data_source, quality_score, environmental_factors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            String(food_name).trim(),
            food_category ? String(food_category).trim() : null,
            Number(temperature),
            Number(humidity),
            Number(gas_level),
            statusToUse,
            sourceToUse,
            qualityToUse,
            finalEnvFactors
        ];

        const result = await db.query(sql, params);

        // Activity log in the same style as activity_logs samples
        try {
            const actorId = req.user && req.user.user_id ? req.user.user_id : null;
            const actionText = `Added Training Data (${String(food_name).trim()})`;
            await Auth.logActivity(actorId, actionText, db);
        } catch (logErr) {
            console.warn('ML add training activity log failed (continuing):', logErr.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Training data added',
            id: result.insertId,
            actual_spoilage_status: correctSpoilageStatus,
            gas_risk_level: gasAnalysis.riskLevel
        });
    } catch (error) {
        console.error('Error adding ML training data:', error);
        return res.status(500).json({ success: false, message: 'Failed to add training data' });
    }
});

// GET /api/ml/check - Check if ML data already exists for a food
router.get('/check', Auth.authenticateToken, async (req, res) => {
    try {
        const { food_name, food_category } = req.query;
        const user_id = req.user.user_id;

        if (!food_name) {
            return res.status(400).json({ 
                success: false, 
                error: 'food_name parameter is required' 
            });
        }

        // Check if training data exists for this food
        let exists = false;
        try {
        const [rows] = await db.query(`
            SELECT COUNT(*) as count 
            FROM ml_training_data 
                WHERE food_name = ? AND (food_category = ? OR (? IS NULL AND food_category IS NULL))
            `, [food_name, food_category || null, food_category || null]);
            exists = rows && rows[0] && rows[0].count > 0;
        } catch (dbErr) {
            console.warn('ML check DB error (returning exists=false):', dbErr.message);
            exists = false;
        }

        res.json({
            success: true,
            exists: exists,
            food_name: food_name,
            food_category: food_category,
            message: exists ? 'ML data already exists' : 'No ML data found'
        });

    } catch (error) {
        console.error('Error checking ML data:', error);
        // Graceful fallback to avoid 500 in UI
        res.json({ success: true, exists: false, message: 'Fallback: check unavailable' });
    }
});

// Upload ML training data
router.post('/training-data', Auth.authenticateToken, async (req, res) => {
    try {
        const { food_id, food_status, temperature, humidity, gas_level, notes } = req.body;
        const user_id = req.user.user_id;

        // Validate required fields
        if (!food_id || !food_status || temperature === null || humidity === null || gas_level === null) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: food_id, food_status, temperature, humidity, gas_level'
            });
        }

        // Validate food_status
        const validStatuses = ['fresh', 'spoiled', 'expired'];
        if (!validStatuses.includes(food_status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid food_status. Must be one of: fresh, spoiled, expired'
            });
        }

        // Insert training data into ml_training_data table
        // Get food name and category for logging and alerts
        const [foodRows] = await db.query('SELECT name, category FROM food_items WHERE food_id = ? AND user_id = ?', [food_id, user_id]);
        let foodName = 'Unknown Food';
        let foodCategory = 'Unknown';
        if (foodRows.length > 0) {
            foodName = foodRows[0].name;
            foodCategory = foodRows[0].category;
        }

        const result = await db.query(
            `INSERT INTO ml_training_data 
            (food_name, food_category, temperature, humidity, gas_level, actual_spoilage_status, data_source, environmental_factors) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [foodName, foodCategory, temperature, humidity, gas_level, food_status, 'user_feedback', JSON.stringify({ notes })]
        );

        // Log activity
        await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [user_id, `Uploaded ML training data for ${foodName} (${food_status})`]);

        // Create alert for ML training completion - ONLY for unsafe statuses
        console.log('🚨 ML Training Alert Check:');
        console.log('  Food Status:', food_status);
        console.log('  Should Create Alert:', food_status !== 'fresh');
        
        if (food_status !== 'fresh') {
            let alertLevel = 'Medium';
            let alertMessage = '';
            let recommendedAction = '';

            switch (food_status) {
                case 'spoiled':
                case 'caution':
                case 'unsafe':
                    alertLevel = 'Medium';
                    alertMessage = `⚠️ ML Training Complete: ${foodName} marked as ${food_status} - AI learned from this data`;
                    recommendedAction = 'Dispose of spoiled food and clean storage area';
                    break;
                case 'expired':
                    alertLevel = 'High';
                    alertMessage = `❌ ML Training Complete: ${foodName} marked as expired - AI learned from this data`;
                    recommendedAction = 'Immediately dispose of expired food and check other items';
                    break;
                default:
                    alertLevel = 'Medium';
                    alertMessage = `⚠️ ML Training Complete: ${foodName} marked as ${food_status} - AI learned from this data`;
                    recommendedAction = 'Check food condition and take appropriate action';
                    break;
            }

            // Create alert only for non-safe statuses
            await db.query(
                `INSERT INTO alerts 
                (user_id, food_id, message, alert_level, alert_type, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    user_id, 
                    food_id, 
                    alertMessage, 
                    alertLevel, 
                    'ml_prediction', 
                    food_status === 'spoiled' ? 75 : food_status === 'expired' ? 95 : 60, 
                    recommendedAction, 
                    true, 
                    85, 
                    JSON.stringify({
                        training_completed: true,
                        food_status: food_status,
                        sensor_readings: { temperature, humidity, gas_level },
                        timestamp: new Date().toISOString()
                    })
                ]
            );
            console.log('✅ Alert created for ML training:', alertMessage);
        } else {
            console.log('✅ Skipping alert creation - food status is fresh');
        }

        console.log('ML training data uploaded:', {
            id: result.insertId,
            user_id,
            food_id,
            food_status,
            temperature,
            humidity,
            gas_level
        });

        res.json({
            success: true,
            message: 'ML training data uploaded successfully',
            data: {
                training_id: result.insertId,
                food_name: foodName,
                food_category: foodCategory,
                food_status: food_status,
                temperature,
                humidity,
                gas_level,
                notes,
                created_at: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error uploading ML training data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload ML training data'
        });
    }
});

// Get ML training history for user
router.get('/training-history', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { limit = 50, offset = 0 } = req.query;

        // Get training data history for the user
        const [rows] = await db.query(`
            SELECT 
                mtd.id,
                mtd.food_id,
                fi.name as food_name,
                fi.category as food_category,
                mtd.food_status,
                mtd.temperature,
                mtd.humidity,
                mtd.gas_level,
                mtd.notes,
                mtd.created_at as timestamp
            FROM ml_training_data mtd
            LEFT JOIN food_items fi ON mtd.food_id = fi.food_id
            WHERE mtd.user_id = ?
            ORDER BY mtd.created_at DESC
            LIMIT ? OFFSET ?
        `, [user_id, parseInt(limit), parseInt(offset)]);

        res.json({
            success: true,
            data: rows,
            count: rows.length
        });

    } catch (error) {
        console.error('Error fetching ML training history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch ML training history'
        });
    }
});

// Get ML training statistics
router.get('/training-stats', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        // Get training data statistics
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_uploads,
                COUNT(CASE WHEN food_status = 'fresh' THEN 1 END) as fresh_count,
                COUNT(CASE WHEN food_status = 'spoiled' THEN 1 END) as spoiled_count,
                COUNT(CASE WHEN food_status = 'expired' THEN 1 END) as expired_count,
                AVG(temperature) as avg_temperature,
                AVG(humidity) as avg_humidity,
                AVG(gas_level) as avg_gas_level
            FROM ml_training_data 
            WHERE user_id = ?
        `, [user_id]);

        // Get recent uploads (last 7 days)
        const [recent] = await db.query(`
            SELECT COUNT(*) as recent_uploads
            FROM ml_training_data 
            WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `, [user_id]);

        res.json({
            success: true,
            data: {
                ...stats[0],
                recent_uploads: recent[0].recent_uploads
            }
        });

    } catch (error) {
        console.error('Error fetching ML training stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch ML training statistics'
        });
    }
});

// Update ML training data entry
router.put('/update/:id', Auth.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        
        // Accept both camelCase (frontend) and snake_case (backend/DB) keys
        const food_name = body.food_name ?? body.foodName;
        const food_category = body.food_category ?? body.category ?? null;
        const temperature = body.temperature;
        const humidity = body.humidity;
        const gas_level = (body.gas_level != null ? body.gas_level : (body.ph != null ? body.ph : null));
        const actual_status = body.actual_status ?? body.actualStatus;
        const data_source = body.data_source ?? body.source;
        let quality_score = body.quality_score ?? body.dataQuality;
        const environmental_factors = body.environmental_factors ?? body.environmentalFactors;

        // Basic validation
        if (temperature == null || humidity == null || gas_level == null || !actual_status) {
            return res.status(400).json({ 
                success: false, 
                message: 'temperature, humidity, gas_level, actual_status are required' 
            });
        }

        const allowedStatuses = new Set(['safe','caution','unsafe']);
        if (!allowedStatuses.has(String(actual_status).toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                message: "actual_status must be one of: 'safe','caution','unsafe'" 
            });
        }

        const allowedSources = new Set(['manual','sensor','user_feedback','expert']);
        const sourceToUse = allowedSources.has(String(data_source || '').toLowerCase()) ? String(data_source).toLowerCase() : 'sensor';

        // Normalize inputs
        const statusToUse = String(actual_status).toLowerCase();
        // If frontend sends percent (0-100), convert to 0-1
        if (quality_score != null && !Number.isNaN(Number(quality_score))) {
            const qn = Number(quality_score);
            quality_score = qn > 1 ? qn / 100 : qn;
        }
        const qualityToUse = (quality_score == null || Number.isNaN(Number(quality_score))) ? 1.0 : Math.max(0, Math.min(1, Number(quality_score)));

        // Validate and sanitize environmental_factors (accept plain text or JSON)
        let parsedEnvFactors = {};
        if (environmental_factors) {
            if (typeof environmental_factors === 'string') {
                const trimmed = environmental_factors.trim();
                if (trimmed) {
                    try {
                        // Try to parse to validate it's valid JSON
                        parsedEnvFactors = JSON.parse(trimmed);
                    } catch (jsonError) {
                        // Not valid JSON - store as plain text in notes field
                        console.log('Plain text detected in environmental_factors, storing as notes:', trimmed.substring(0, 50));
                        parsedEnvFactors = {
                            notes: trimmed,
                            storage_location: "box container"
                        };
                    }
                }
            } else if (typeof environmental_factors === 'object') {
                // If it's already an object, use it
                parsedEnvFactors = environmental_factors;
            }
        }
        
        // Skip AI conversion - user wants plain text stored as-is
        /*
        if (environmental_factors) {
            if (typeof environmental_factors === 'string') {
                const trimmed = environmental_factors.trim();
                if (trimmed) {
                    try {
                        // Try to parse to validate it's valid JSON
                        parsedEnvFactors = JSON.parse(trimmed);
                    } catch (jsonError) {
                        console.warn('Invalid JSON in environmental_factors, attempting AI conversion:', jsonError.message);
                        
                        // Try to use AI to convert text to JSON with full sensor data
                        if (geminiConfig.apiKey) {
                            try {
                                // Build context from current data
                                let contextInfo = '\n\nCurrent sensor/form data to include:';
                                contextInfo += `\n- Temperature: ${temperature}°C`;
                                contextInfo += `\n- Humidity: ${humidity}%`;
                                contextInfo += `\n- Gas Level: ${gas_level} ppm`;
                                if (food_name) contextInfo += `\n- Food Name: ${food_name}`;
                                contextInfo += `\n- Status: ${actual_status}`;
                                contextInfo += '\n\nINCLUDE these values in your JSON output within a "storage_conditions" object with a current timestamp.';
                                
                                // Calculate gas emission analysis
                                const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
                                const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(Number(gas_level));
                                
                                let gasAnalysisInfo = `\n\nGas Emission Analysis (auto-calculated from sensor):
- Risk Level: ${gasAnalysis.riskLevel}
- Status: ${gasAnalysis.status}
- Probability: ${gasAnalysis.probability}%
- Recommendation: ${gasAnalysis.recommendation}`;
                                
                                // If actual status differs from gas analysis status, adjust recommendation
                                if (actual_status && actual_status !== gasAnalysis.status) {
                                    gasAnalysisInfo += `\n\n⚠️ IMPORTANT: The provided status "${actual_status}" differs from the gas sensor status "${gasAnalysis.status}". 
Adjust the recommendation to match the "${actual_status}" status while incorporating the gas analysis data.`;
                                }
                                
                                gasAnalysisInfo += '\n\nIMPORTANT: Include this complete gas_emission_analysis object in your JSON output.';
                                
                                const aiPrompt = `Convert the following user input into a valid JSON object for food environmental factors. 
Extract meaningful information and structure it properly based on the user's description.

Your JSON output MUST include:
1. User observations as "observations" or "notes" field
2. "storage_location": "box container" (always set this)
3. If sensor data is provided, include it in "storage_conditions" object with current timestamp${contextInfo}${gasAnalysisInfo}

User input: "${trimmed}"

Return ONLY a valid JSON object with these fields, nothing else. No markdown, no explanations.`;
                                
                                const aiResponse = await generateContent([{ text: aiPrompt }], {
                                    temperature: 0.3,
                                    maxOutputTokens: 500
                                });
                                
                                console.log('🔍 Full AI Response:', JSON.stringify(aiResponse, null, 2));
                                
                                // Extract text from Gemini response structure (try multiple formats)
                                let responseText = '';
                                if (aiResponse) {
                                    // Try structure 1: candidates[0].content.parts[0].text
                                    if (aiResponse.candidates && aiResponse.candidates[0] && 
                                        aiResponse.candidates[0].content && aiResponse.candidates[0].content.parts && 
                                        aiResponse.candidates[0].content.parts[0] && aiResponse.candidates[0].content.parts[0].text) {
                                        responseText = aiResponse.candidates[0].content.parts[0].text.trim();
                                    }
                                    // Try structure 2: text property directly
                                    else if (aiResponse.text) {
                                        responseText = aiResponse.text.trim();
                                    }
                                    // Try structure 3: candidates[0].text
                                    else if (aiResponse.candidates && aiResponse.candidates[0] && aiResponse.candidates[0].text) {
                                        responseText = aiResponse.candidates[0].text.trim();
                                    }
                                }
                                
                                console.log('📝 Extracted text:', responseText);
                                
                                if (responseText) {
                                    let jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                                    parsedEnvFactors = JSON.parse(jsonText);
                                    
                                    // Ensure all required fields are added
                                    if (!parsedEnvFactors.storage_location) {
                                        parsedEnvFactors.storage_location = "box container";
                                    }
                                    
                                    // Only add gas emission analysis if AI didn't provide it
                                    if (!parsedEnvFactors.gas_emission_analysis) {
                                        parsedEnvFactors.gas_emission_analysis = {
                                            risk_level: gasAnalysis.riskLevel,
                                            status: gasAnalysis.status,
                                            probability: gasAnalysis.probability,
                                            recommendation: gasAnalysis.recommendation
                                        };
                                    }
                                    
                                    // Add storage conditions with current sensor data
                                    parsedEnvFactors.storage_conditions = {
                                        temperature: Number(temperature),
                                        humidity: Number(humidity),
                                        gas_level: Number(gas_level),
                                        timestamp: new Date().toISOString()
                                    };
                                    
                                    // Add AI analysis metadata
                                    parsedEnvFactors.ai_analysis = true;
                                    parsedEnvFactors.confidence = gasAnalysis.probability;
                                    parsedEnvFactors.provided_status = actual_status;
                                    parsedEnvFactors.gas_emission_override = true;
                                    parsedEnvFactors.timestamp = new Date().toISOString();
                                    
                                    // If provided_status differs from gas analysis, override gas_emission_analysis
                                    if (actual_status && parsedEnvFactors.gas_emission_analysis && actual_status !== gasAnalysis.status) {
                                        const providedStatus = actual_status.toLowerCase();
                                        const riskMapping = {
                                            'safe': 'low',
                                            'caution': 'medium',
                                            'unsafe': 'high'
                                        };
                                        const recommendationMapping = {
                                            'safe': 'Safe to consume. Store properly to maintain freshness.',
                                            'caution': 'Exercise caution. Inspect thoroughly before consuming. May have minor spoilage signs.',
                                            'unsafe': 'Do not consume. Dispose safely. Food shows clear signs of spoilage.'
                                        };
                                        
                                        parsedEnvFactors.gas_emission_analysis.risk_level = riskMapping[providedStatus] || gasAnalysis.riskLevel;
                                        parsedEnvFactors.gas_emission_analysis.status = providedStatus;
                                        parsedEnvFactors.gas_emission_analysis.recommendation = recommendationMapping[providedStatus] || gasAnalysis.recommendation;
                                    }
                                    
                                    console.log('✅ AI successfully converted text to JSON with full analysis:', parsedEnvFactors);
                                } else {
                                    console.warn('⚠️ AI returned response but could not extract text');
                                }
                            } catch (aiError) {
                                console.warn('AI conversion failed, using basic structure:', aiError.message);
                                parsedEnvFactors = {
                                    notes: trimmed,
                                    storage_location: "box container"
                                };
                            }
                        } else {
                            // No AI available, create basic structure
                            parsedEnvFactors = {
                                notes: trimmed,
                                storage_location: "box container"
                            };
                        }
                    }
                }
            } else if (typeof environmental_factors === 'object') {
                // If it's already an object, use it
                parsedEnvFactors = environmental_factors;
            }
        }
        */

        // Ensure storage_location is always set to "box container" if not specified
        if (!parsedEnvFactors.storage_location) {
            parsedEnvFactors.storage_location = "box container";
        }
        
        // Enrich with gas emission analysis and sensor data if not already present
        if (Object.keys(parsedEnvFactors).length > 0) {
            // Calculate gas emission analysis
            const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
            const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(Number(gas_level));
            
            // Add or update gas emission analysis
            if (!parsedEnvFactors.gas_emission_analysis) {
                parsedEnvFactors.gas_emission_analysis = {
                    risk_level: gasAnalysis.riskLevel,
                    status: gasAnalysis.status,
                    probability: gasAnalysis.probability,
                    recommendation: gasAnalysis.recommendation
                };
            }
            
            // Add or update storage conditions with current sensor data
            if (!parsedEnvFactors.storage_conditions) {
                parsedEnvFactors.storage_conditions = {
                    temperature: Number(temperature),
                    humidity: Number(humidity),
                    gas_level: Number(gas_level),
                    timestamp: new Date().toISOString()
                };
            }
            
            // Add AI analysis metadata if not present
            if (!parsedEnvFactors.ai_analysis) {
                parsedEnvFactors.ai_analysis = true;
                parsedEnvFactors.confidence = gasAnalysis.probability;
                parsedEnvFactors.provided_status = actual_status;
                parsedEnvFactors.gas_emission_override = true;
                parsedEnvFactors.timestamp = new Date().toISOString();
            } else {
                // Always update provided_status from form data, even if ai_analysis already exists
                parsedEnvFactors.provided_status = actual_status;
            }
            
            // If provided_status differs from gas analysis, override gas_emission_analysis
            if (actual_status && parsedEnvFactors.gas_emission_analysis && actual_status !== gasAnalysis.status) {
                const providedStatus = actual_status.toLowerCase();
                const riskMapping = {
                    'safe': 'low',
                    'caution': 'medium',
                    'unsafe': 'high'
                };
                const recommendationMapping = {
                    'safe': 'Safe to consume. Store properly to maintain freshness.',
                    'caution': 'Exercise caution. Inspect thoroughly before consuming. May have minor spoilage signs.',
                    'unsafe': 'Do not consume. Dispose safely. Food shows clear signs of spoilage.'
                };
                
                parsedEnvFactors.gas_emission_analysis.risk_level = riskMapping[providedStatus] || gasAnalysis.riskLevel;
                parsedEnvFactors.gas_emission_analysis.status = providedStatus;
                parsedEnvFactors.gas_emission_analysis.recommendation = recommendationMapping[providedStatus] || gasAnalysis.recommendation;
            }
        }

        // Stringify for database storage
        const environmentalFactorsToSave = Object.keys(parsedEnvFactors).length > 0 
            ? JSON.stringify(parsedEnvFactors) 
            : null;

        // Check if training data exists
        const [existingRows] = await db.query(`
            SELECT training_id, food_name, food_category 
            FROM ml_training_data 
            WHERE training_id = ?
        `, [id]);

        if (existingRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Training data not found'
            });
        }

        const existingData = existingRows[0];

        // Update the training data
        const sql = `
            UPDATE ml_training_data SET
                food_name = ?,
                food_category = ?,
                temperature = ?,
                humidity = ?,
                gas_level = ?,
                actual_spoilage_status = ?,
                data_source = ?,
                quality_score = ?,
                environmental_factors = ?,
                updated_at = NOW()
            WHERE training_id = ?
        `;
        const params = [
            food_name ? String(food_name).trim() : existingData.food_name,
            food_category ? String(food_category).trim() : existingData.food_category,
            Number(temperature),
            Number(humidity),
            Number(gas_level),
            statusToUse,
            sourceToUse,
            qualityToUse,
            environmentalFactorsToSave,
            id
        ];

        const result = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Training data not found or no changes made'
            });
        }

        // Activity log
        try {
            const actorId = req.user && req.user.user_id ? req.user.user_id : null;
            const actionText = `Updated Training Data (ID: ${id})`;
            await Auth.logActivity(actorId, actionText, db);
        } catch (logErr) {
            console.warn('ML update training activity log failed (continuing):', logErr.message);
        }

        return res.json({
            success: true,
            message: 'Training data updated successfully',
            id: id
        });

    } catch (error) {
        console.error('Error updating ML training data:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to update training data' 
        });
    }
});

// Delete ML training data entry
router.delete('/training-data/:id', Auth.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.user_id;

        // Verify ownership and delete
        const result = await db.query(`
            DELETE FROM ml_training_data 
            WHERE training_id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Training data entry not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Training data entry deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting ML training data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete training data entry'
        });
    }
});

module.exports = router;
