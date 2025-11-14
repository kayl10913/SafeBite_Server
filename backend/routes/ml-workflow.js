const express = require('express');
const router = express.Router();
const Auth = require('../config/auth');
const db = require('../config/database');
const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
const EmailService = require('../config/email');

// Local helper duplicated from alerts route to avoid import cycles
async function shouldSendSpoilageEmail(db, {
    user_id,
    food_id,
    alert_type,
    alert_level
}) {
    try {
        const minutes = parseInt(process.env.EMAIL_THROTTLE_MINUTES || '30', 10);
        const rows = await db.query(
            `SELECT alert_id FROM alerts
             WHERE user_id = ?
               AND (food_id <=> ?)
               AND alert_type = ?
               AND alert_level = ?
               AND timestamp >= (NOW() - INTERVAL ? MINUTE)
             ORDER BY timestamp DESC
             LIMIT 1`,
            [user_id, food_id || null, 'ml_prediction', alert_level, minutes]
        );
        return !(Array.isArray(rows) && rows.length > 0);
    } catch (_) { return true; }
}
const { generateContent } = require('../utils/geminiClient');
const geminiConfig = require('../config/gemini');

// SmartSense spoilage assessment using standardized thresholds
// EITHER high humidity (>90%) OR gas (>70 ppm) triggers unsafe
function assessSmartSenseStatus(foodName, category, temperature, humidity, gasLevel, manualOverride = null) {
	// Use standardized thresholds instead of hardcoded food-specific values

	// Apply gas emission thresholds for all foods
	const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(gasLevel);
	
	// Analyze environmental conditions
	const envAnalysis = gasEmissionAnalysis.analyzeEnvironmentalConditions(temperature, humidity, foodName);
	
	// MANUAL OVERRIDE: If user reports strong smell/rot, mark as unsafe immediately
	if (manualOverride === 'spoiled' || manualOverride === 'unsafe' || manualOverride === true) {
		return {
			status: 'unsafe',
			probability: 95,
			confidence: 100,
			recommendation: `USER REPORTED: Strong smell or rot detected. Food is unsafe to consume. Dispose immediately. This data will be used to improve the system.`,
			gasThreshold: gasAnalysis.threshold,
			manualOverride: true,
			criticalFactor: 'user_report'
		};
	}
	
	// CRITICAL RULE: EITHER high humidity (>90%) OR gas (>70 ppm) triggers unsafe
	// This is based on observations that either condition alone can indicate spoilage
	const isUnsafeByHumidity = humidity > 90;
	const isUnsafeByGas = gasLevel > 70;
	
	if (isUnsafeByHumidity || isUnsafeByGas) {
		let criticalFactor = [];
		let recommendation = 'CRITICAL: ';
		
		if (isUnsafeByHumidity && isUnsafeByGas) {
			criticalFactor.push('humidity', 'gas');
			recommendation += `Both extremely high humidity (${humidity.toFixed(1)}%) and elevated gas levels (${gasLevel.toFixed(1)} ppm) detected. `;
		} else if (isUnsafeByHumidity) {
			criticalFactor.push('humidity');
			recommendation += `Extremely high humidity (${humidity.toFixed(1)}%) detected. `;
		} else {
			criticalFactor.push('gas');
			recommendation += `Elevated gas levels (${gasLevel.toFixed(1)} ppm) detected. `;
		}
		
		recommendation += `Food is unsafe to consume. Inspect immediately - if strong smell or rot is observed, dispose immediately. `;
		recommendation += `This promotes rapid bacterial growth and spoilage.`;
		
		return {
			status: 'unsafe',
			probability: isUnsafeByHumidity && isUnsafeByGas ? 95 : 85,
			confidence: 90,
			recommendation: recommendation,
			gasThreshold: gasAnalysis.threshold,
			environmentalOverride: isUnsafeByHumidity,
			gasOverride: isUnsafeByGas,
			criticalFactor: criticalFactor.join('_and_')
		};
	}
	
	// If gas analysis indicates high or medium risk (but gas <= 70), combine with environmental factors
	if (gasAnalysis.riskLevel === 'high' || (gasAnalysis.riskLevel === 'medium' && gasAnalysis.status === 'caution')) {
		// Combine with environmental factors
		let finalProbability = gasAnalysis.probability;
		let finalStatus = gasAnalysis.status;
		
		// Increase probability if environmental conditions are also poor
		if (envAnalysis.overallRisk === 'high') {
			finalProbability = Math.min(95, finalProbability + 15);
			if (finalStatus === 'caution') finalStatus = 'unsafe';
		} else if (envAnalysis.overallRisk === 'medium') {
			finalProbability = Math.min(90, finalProbability + 10);
		}
		
		return {
			status: finalStatus,
			probability: finalProbability,
			confidence: gasAnalysis.confidence,
			recommendation: `${gasAnalysis.recommendation} ${envAnalysis.overallRisk !== 'normal' ? envAnalysis.recommendation : ''}`,
			gasThreshold: gasAnalysis.threshold
		};
	}
	
	// For low risk gas levels, analyze environmental conditions
	let status = gasAnalysis.status;
	let probability = gasAnalysis.probability;
	let confidence = 90;
	
	// Apply environmental adjustments - environmental factors can significantly impact safety
	if (envAnalysis.overallRisk === 'high') {
		// High environmental risk with low gas = elevated caution
		probability = Math.min(75, probability + 35);
		status = 'caution';
		confidence = 85;
	} else if (envAnalysis.overallRisk === 'medium') {
		probability = Math.min(60, probability + 25);
		if (status === 'safe') status = 'caution';
		confidence = 85;
	}
	
	// Combine recommendations
	const recommendation = gasAnalysis.recommendation + 
		(envAnalysis.overallRisk !== 'normal' ? ` ${envAnalysis.recommendation}` : '');
	
	return {
		status: status,
		probability: probability,
		confidence: confidence,
		recommendation: recommendation,
		gasThreshold: gasAnalysis.threshold
	};
}

// AI API analysis function for enhanced prediction support
// AI API is PRIMARY decision maker, gas emission thresholds are used as SUPPORT/validation
async function getAIAnalysisForPrediction(foodName, temperature, humidity, gasLevel) {
    try {
        // Gas emission threshold ranges for AI reference (support/validation)
        const gasThresholds = {
            safe: '0-49 ppm (Fresh/Safe)',
            caution: '50-69 ppm (Early Warning)',
            unsafe_low: '70-99 ppm (Spoilage Detected - based on observations)',
            unsafe_medium: '100-199 ppm (Spoilage Detected)',
            unsafe_high: '200-399 ppm (Advanced Spoilage)',
            unsafe_critical: '400+ ppm (Severe Spoilage)'
        };
        
        const systemInstruction = 'You are an AI food spoilage risk analyst for a sensor-driven monitoring system. '
            + 'You are the PRIMARY decision maker for food spoilage assessment. '
            + 'Given food name and current sensor readings (temperature in °C, humidity in %, and gas level from a VOC sensor in ppm), '
            + 'assess spoilage risk using your food safety knowledge and return ONLY a valid JSON object. '
            + 'GAS EMISSION THRESHOLDS (for reference/validation support): '
            + 'Gas 0-49 ppm = Generally SAFE. '
            + 'Gas 50-69 ppm = CAUTION (early warning signs). '
            + 'Gas 70-99 ppm = UNSAFE (spoilage detected based on sensor observations). '
            + 'Gas 100-199 ppm = UNSAFE (spoilage detected). '
            + 'Gas 200+ ppm = UNSAFE (advanced/severe spoilage). '
            + 'HUMIDITY THRESHOLD: Humidity >90% = UNSAFE (promotes rapid bacterial growth). '
            + 'Use these thresholds as REFERENCE/SUPPORT, but make your PRIMARY decision based on: '
            + '1. Food type characteristics and typical spoilage patterns '
            + '2. Combined sensor readings (temperature, humidity, gas) '
            + '3. Food safety knowledge and best practices '
            + '4. Environmental conditions and storage context '
            + 'Consider all factors together - you may override threshold ranges if food-specific knowledge suggests different assessment. '
            + 'Return ONLY valid JSON. No markdown, no explanations, no additional text.';

        const schema = {
            spoilage_status: 'safe|caution|unsafe',
            spoilage_probability: '0-100 integer',
            confidence_score: '0-100 integer',
            risk_level: 'low|medium|high',
            summary: 'brief 1-2 sentence overview',
            key_factors: ['list of contributing factors'],
            recommendations: ['list of actionable recommendations'],
            estimated_shelf_life_hours: 'integer',
            ai_insights: 'any additional AI insights or caveats'
        };

        const userPrompt = [
            `Food Name: ${foodName}`,
            `Temperature: ${temperature}°C`,
            `Humidity: ${humidity}%`,
            `Gas Level: ${gasLevel} ppm`,
            '',
            'GAS EMISSION THRESHOLDS (Reference/Support):',
            `- Current reading: ${gasLevel} ppm falls in ${gasLevel >= 400 ? '400+ ppm (Severe)' : gasLevel >= 200 ? '200-399 ppm (Advanced)' : gasLevel >= 100 ? '100-199 ppm' : gasLevel >= 70 ? '70-99 ppm' : gasLevel >= 50 ? '50-69 ppm' : '0-49 ppm'} range`,
            '- Use these as SUPPORT/validation, but make PRIMARY decision based on food type and combined factors',
            '',
            'YOUR PRIMARY ASSESSMENT:',
            'Analyze this food using your food safety knowledge. Consider:',
            '- Food type spoilage characteristics',
            '- Combined effect of all three sensors (temperature, humidity, gas)',
            '- Typical storage requirements for this food type',
            '- Environmental context and food safety best practices',
            '- You may override threshold ranges if food-specific knowledge suggests different assessment',
            '',
            'Return ONLY valid JSON matching this structure:',
            JSON.stringify(schema, null, 2)
        ].join('\n');

        const response = await generateContent([
            { text: systemInstruction + '\n\n' + userPrompt }
        ], {
            temperature: 0.3,
            topP: 0.8,
            maxOutputTokens: 512
        });

        // Extract text from response
        let text = '';
        if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.text) {
                    text += part.text;
                }
            }
        }

        // Parse JSON from response
        let analysis = null;
        let cleaned = (text || '').trim();
        
        // Strip markdown code fences if present
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Extract JSON object
        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        }
        
        try {
            analysis = JSON.parse(cleaned);
        } catch (parseError) {
            // Fallback: try to extract JSON from response
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    analysis = JSON.parse(jsonMatch[0]);
                } catch (fallbackError) {
                    console.warn('Failed to parse AI API response:', fallbackError.message);
                    return null;
                }
            } else {
                console.warn('No JSON found in AI API response');
                return null;
            }
        }

        // Validate and normalize AI analysis
        if (analysis && typeof analysis === 'object') {
            // Normalize status values
            const status = (analysis.spoilage_status || '').toLowerCase();
            if (status === 'safe' || status === 'caution' || status === 'unsafe') {
                analysis.spoilage_status = status;
            } else {
                // Map risk_level to spoilage_status if needed
                const riskLevel = (analysis.risk_level || '').toLowerCase();
                if (riskLevel === 'high') {
                    analysis.spoilage_status = 'unsafe';
                } else if (riskLevel === 'medium') {
                    analysis.spoilage_status = 'caution';
                } else {
                    analysis.spoilage_status = 'safe';
                }
            }

            return {
                spoilage_status: analysis.spoilage_status,
                spoilage_probability: analysis.spoilage_probability || 50,
                confidence_score: analysis.confidence_score || 85,
                risk_level: analysis.risk_level || 'medium',
                summary: analysis.summary || '',
                key_factors: analysis.key_factors || [],
                recommendations: analysis.recommendations || [],
                estimated_shelf_life_hours: analysis.estimated_shelf_life_hours || 24,
                ai_insights: analysis.ai_insights || '',
                source: 'ai_api'
            };
        }

        return null;
    } catch (error) {
        console.error('Error getting AI API analysis:', error);
        return null;
    }
}

// ML training-data based assessment: classify by nearest centroid from historical labels
async function assessFromTrainingData(dbRef, foodName, category, temperature, humidity, gasLevel) {
	try {
		const rows = await dbRef.query(
			`SELECT temperature, humidity, gas_level, actual_spoilage_status
			 FROM ml_training_data
			 WHERE (food_name = ? OR food_category = ?)
			 ORDER BY created_at DESC
			 LIMIT 300`,
			[foodName || '', category || '']
		);

		if (!rows || rows.length === 0) {
			return null; // no training data
		}

		const groups = { safe: [], caution: [], unsafe: [] };
		for (const r of rows) {
			const label = (r.actual_spoilage_status || '').toLowerCase();
			// Map training data statuses to prediction groups
			let mappedLabel = label;
			if (label === 'fresh') mappedLabel = 'safe';
			else if (label === 'spoiled') mappedLabel = 'unsafe';
			else if (label === 'expired') mappedLabel = 'unsafe';
			else if (label === 'caution') mappedLabel = 'caution';
			
			if (groups[mappedLabel]) {
				groups[mappedLabel].push({ t: parseFloat(r.temperature), h: parseFloat(r.humidity), g: parseFloat(r.gas_level) });
			}
		}

		const centroids = {};
		for (const label of Object.keys(groups)) {
			const arr = groups[label];
			if (arr.length > 0) {
				const sum = arr.reduce((acc, v) => ({ t: acc.t + v.t, h: acc.h + v.h, g: acc.g + v.g }), { t: 0, h: 0, g: 0 });
				centroids[label] = { t: sum.t / arr.length, h: sum.h / arr.length, g: sum.g / arr.length, n: arr.length };
			}
		}

		const labels = Object.keys(centroids);
		if (labels.length === 0) return null;

		function distance(a, b) {
			return Math.abs(a.t - b.t) + Math.abs(a.h - b.h) + Math.abs(a.g - b.g);
		}

		const current = { t: parseFloat(temperature), h: parseFloat(humidity), g: parseFloat(gasLevel) };
		let bestLabel = labels[0];
		let bestDist = distance(current, centroids[bestLabel]);
		for (let i = 1; i < labels.length; i++) {
			const lb = labels[i];
			const d = distance(current, centroids[lb]);
			if (d < bestDist) { bestDist = d; bestLabel = lb; }
		}

		// Normalize probability relative to spread of centroids
		let worstDist = bestDist;
		for (const lb of labels) {
			const d = distance(current, centroids[lb]);
			if (d > worstDist) worstDist = d;
		}
		const ratio = worstDist > 0 ? 1 - (bestDist / worstDist) : 0.7;
		const probability = Math.round(50 + ratio * 45); // 50-95
		const confidence = Math.min(95, 70 + Math.round((rows.length) * 0.1));

		return { status: bestLabel, probability, confidence, meta: { centroids } };
	} catch (e) {
		console.warn('Training-data assessment failed:', e.message);
		return null;
	}
}

// POST /api/ml-workflow/training-data - Store training data from Smart Training
router.post('/training-data', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_name,
            food_category,
            temperature,
            humidity,
            gas_level,
            spoilage_status,
            confidence_score,
            storage_conditions
        } = req.body;

        // Validate required fields
        if (!food_name || !food_category || !spoilage_status) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: food_name, food_category, spoilage_status'
            });
        }

        // PRIORITY: Use saved sensor data from database, fallback to request body
        let finalTemperature = null;
        let finalHumidity = null;
        let finalGasLevel = null;
        
        // First, try to get latest sensor readings from database (saved data)
        console.log('📊 Getting latest saved sensor readings from database for ML training...');
        
        try {
            // Get latest temperature reading
            const [tempReading] = await db.query(
                `SELECT r.value, r.timestamp FROM readings r 
                 JOIN sensor s ON r.sensor_id = s.sensor_id 
                 WHERE s.type = 'Temperature' AND s.user_id = ? 
                 ORDER BY r.timestamp DESC LIMIT 1`,
                [user_id]
            );
            if (tempReading.length > 0) {
                finalTemperature = parseFloat(tempReading[0].value);
                console.log(`✅ Using saved temperature: ${finalTemperature}°C (timestamp: ${tempReading[0].timestamp})`);
            }
            
            // Get latest humidity reading
            const [humidityReading] = await db.query(
                `SELECT r.value, r.timestamp FROM readings r 
                 JOIN sensor s ON r.sensor_id = s.sensor_id 
                 WHERE s.type = 'Humidity' AND s.user_id = ? 
                 ORDER BY r.timestamp DESC LIMIT 1`,
                [user_id]
            );
            if (humidityReading.length > 0) {
                finalHumidity = parseFloat(humidityReading[0].value);
                console.log(`✅ Using saved humidity: ${finalHumidity}% (timestamp: ${humidityReading[0].timestamp})`);
            }
            
            // Get latest gas reading
            const [gasReading] = await db.query(
                `SELECT r.value, r.timestamp FROM readings r 
                 JOIN sensor s ON r.sensor_id = s.sensor_id 
                 WHERE s.type = 'Gas' AND s.user_id = ? 
                 ORDER BY r.timestamp DESC LIMIT 1`,
                [user_id]
            );
            if (gasReading.length > 0) {
                finalGasLevel = parseFloat(gasReading[0].value);
                console.log(`✅ Using saved gas level: ${finalGasLevel} ppm (timestamp: ${gasReading[0].timestamp})`);
            }
            
            // If any sensor data is missing from database, use request body as fallback
            if (finalTemperature === null && temperature !== undefined) {
                finalTemperature = parseFloat(temperature);
                console.log(`⚠️ Temperature not found in database, using request body: ${finalTemperature}°C`);
            }
            if (finalHumidity === null && humidity !== undefined) {
                finalHumidity = parseFloat(humidity);
                console.log(`⚠️ Humidity not found in database, using request body: ${finalHumidity}%`);
            }
            if (finalGasLevel === null && gas_level !== undefined) {
                finalGasLevel = parseFloat(gas_level);
                console.log(`⚠️ Gas level not found in database, using request body: ${finalGasLevel} ppm`);
            }
            
            console.log('📊 Final sensor data for ML training:', {
                temperature: finalTemperature,
                humidity: finalHumidity,
                gas_level: finalGasLevel,
                source: finalTemperature !== null && finalHumidity !== null && finalGasLevel !== null ? 'database' : 'mixed'
            });
        } catch (sensorError) {
            console.error('❌ Failed to get latest sensor readings from database:', sensorError);
            // Fallback to request body if database query fails
            if (temperature !== undefined && humidity !== undefined && gas_level !== undefined) {
                console.log('⚠️ Using request body data as fallback due to database error');
                finalTemperature = parseFloat(temperature);
                finalHumidity = parseFloat(humidity);
                finalGasLevel = parseFloat(gas_level);
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve sensor data for ML training: ' + sensorError.message
                });
            }
        }
        
        // Check if all sensor readings are available
        if (finalTemperature === null || finalHumidity === null || finalGasLevel === null) {
            return res.status(400).json({
                success: false,
                error: 'No sensor data available. Please ensure your sensors are working and have sent data before performing ML training.'
            });
        }

        // Apply gas emission analysis to determine correct spoilage status for training data
        const gasEmissionAnalysis = require('../utils/gasEmissionAnalysis');
        const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(finalGasLevel);
        
        // Use gas emission analysis to determine the correct spoilage status
        let correctSpoilageStatus;
        if (gasAnalysis.riskLevel === 'low') {
            correctSpoilageStatus = 'safe'; // Gas emission says safe = safe (matches ENUM)
        } else if (gasAnalysis.riskLevel === 'medium') {
            correctSpoilageStatus = 'caution'; // Gas emission says medium = caution
        } else if (gasAnalysis.riskLevel === 'high') {
            correctSpoilageStatus = 'unsafe'; // Gas emission says high = unsafe (matches ENUM)
        } else {
            correctSpoilageStatus = spoilage_status; // Fallback to provided status
        }
        
        console.log('🔍 ML Workflow Training Data Status Override:');
        console.log('  Gas Risk Level:', gasAnalysis.riskLevel);
        console.log('  Provided Status:', spoilage_status);
        console.log('  Corrected Status:', correctSpoilageStatus);
        
        // Validate that the status matches the database ENUM constraint
        const validStatuses = ['safe', 'caution', 'unsafe'];
        if (!validStatuses.includes(correctSpoilageStatus)) {
            console.error('❌ Invalid status for database ENUM:', correctSpoilageStatus);
            console.error('  Valid values are:', validStatuses);
            correctSpoilageStatus = 'safe'; // Fallback to safe
        }

        // Insert training data with gas emission analysis priority
        console.log('🔍 ML Workflow Training Data Insertion Debug:');
        console.log('  correctSpoilageStatus:', correctSpoilageStatus);
        console.log('  correctSpoilageStatus type:', typeof correctSpoilageStatus);
        console.log('  Gas Risk Level:', gasAnalysis.riskLevel);
        
        const result = await db.query(
            `INSERT INTO ml_training_data 
            (food_name, food_category, temperature, humidity, gas_level, 
             actual_spoilage_status, data_source, quality_score, environmental_factors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                food_name,
                food_category,
                finalTemperature,
                finalHumidity,
                finalGasLevel,
                correctSpoilageStatus,
                'expert', // AI analysis source
                0.95, // High quality AI data
                JSON.stringify({
                    ai_analysis: true,
                    confidence: confidence_score || 85,
                    storage_conditions: storage_conditions || {},
                    gas_emission_analysis: {
                        risk_level: gasAnalysis.riskLevel,
                        status: gasAnalysis.status,
                        probability: gasAnalysis.probability,
                        recommendation: gasAnalysis.recommendation
                    },
                    provided_status: spoilage_status,
                    gas_emission_override: true,
                    timestamp: new Date().toISOString()
                })
            ]
        );

        console.log('Training data stored successfully with ID:', result.insertId);
        
        // Verify the inserted data
        try {
            const [verifyResult] = await db.query(
                'SELECT actual_spoilage_status FROM ml_training_data WHERE training_id = ?',
                [result.insertId]
            );
            console.log('🔍 ML Workflow Verification Query Result:');
            console.log('  Inserted actual_spoilage_status:', verifyResult[0]?.actual_spoilage_status);
            console.log('  Expected:', correctSpoilageStatus);
        } catch (verifyError) {
            console.error('Error verifying inserted data:', verifyError);
        }

        res.json({
            success: true,
            training_id: result.insertId,
            actual_spoilage_status: correctSpoilageStatus,
            gas_risk_level: gasAnalysis.riskLevel,
            message: 'Training data stored successfully'
        });

    } catch (error) {
        console.error('Error storing training data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to store training data'
        });
    }
});

// POST /api/ml-workflow/predict - Generate ML prediction
function requireRole(allowed) {
	return (req, res, next) => {
		const role = req.user && (req.user.role || req.user.user_role || req.user.type);
		if (!role || !allowed.includes(String(role).toLowerCase())) {
			return res.status(403).json({ success: false, error: 'Forbidden: ML role required' });
		}
		next();
	};
}
//---ML predict---
router.post('/predict', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_id,
            food_name,
            food_category,
            temperature,
            humidity,
            gas_level,
            expiration_date,
            spoilage_probability,
            spoilage_status,
            confidence_score,
            recommendations,
            ai_original_status,
            display_override_status
        } = req.body;
        
        // Get expiration_date from ml_predictions if food_id is provided, otherwise use from request body
        let expirationDateValue = expiration_date || null;
        if (food_id && !expirationDateValue) {
            try {
                const prediction = await db.query(
                    'SELECT expiration_date FROM ml_predictions WHERE food_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1',
                    [food_id, user_id]
                );
                if (prediction && prediction.length > 0 && prediction[0].expiration_date) {
                    expirationDateValue = prediction[0].expiration_date;
                }
            } catch (err) {
                console.warn('Could not fetch expiration_date from ml_predictions:', err.message);
            }
        }
        
        // Debug logging for AI vs Override comparison
        if (ai_original_status && display_override_status && ai_original_status !== display_override_status) {
            console.log('🔍 AI vs Override Status Comparison:');
            console.log('  AI Original Status:', ai_original_status);
            console.log('  Display Override Status:', display_override_status);
            console.log('  Using for ML Prediction:', spoilage_status);
        }

        // Validate required fields
        if (!food_name || spoilage_probability === undefined || !spoilage_status) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields for ML prediction: food_name, spoilage_probability, spoilage_status'
            });
        }

        // PRIORITY: Use saved sensor data from database, fallback to request body
        let finalTemperature = null;
        let finalHumidity = null;
        let finalGasLevel = null;
        
        // First, try to get latest sensor readings from database (saved data)
        console.log('📊 Getting latest saved sensor readings from database for prediction...');
        
        try {
            // Get latest temperature reading
            const [tempReading] = await db.query(
                `SELECT r.value, r.timestamp FROM readings r 
                 JOIN sensor s ON r.sensor_id = s.sensor_id 
                 WHERE s.type = 'Temperature' AND s.user_id = ? 
                 ORDER BY r.timestamp DESC LIMIT 1`,
                [user_id]
            );
            if (tempReading.length > 0) {
                finalTemperature = parseFloat(tempReading[0].value);
                console.log(`✅ Using saved temperature: ${finalTemperature}°C (timestamp: ${tempReading[0].timestamp})`);
            }
            
            // Get latest humidity reading
            const [humidityReading] = await db.query(
                `SELECT r.value, r.timestamp FROM readings r 
                 JOIN sensor s ON r.sensor_id = s.sensor_id 
                 WHERE s.type = 'Humidity' AND s.user_id = ? 
                 ORDER BY r.timestamp DESC LIMIT 1`,
                [user_id]
            );
            if (humidityReading.length > 0) {
                finalHumidity = parseFloat(humidityReading[0].value);
                console.log(`✅ Using saved humidity: ${finalHumidity}% (timestamp: ${humidityReading[0].timestamp})`);
            }
            
            // Get latest gas reading
            const [gasReading] = await db.query(
                `SELECT r.value, r.timestamp FROM readings r 
                 JOIN sensor s ON r.sensor_id = s.sensor_id 
                 WHERE s.type = 'Gas' AND s.user_id = ? 
                 ORDER BY r.timestamp DESC LIMIT 1`,
                [user_id]
            );
            if (gasReading.length > 0) {
                finalGasLevel = parseFloat(gasReading[0].value);
                console.log(`✅ Using saved gas level: ${finalGasLevel} ppm (timestamp: ${gasReading[0].timestamp})`);
            }
            
            // If any sensor data is missing from database, use request body as fallback
            if (finalTemperature === null && temperature !== undefined) {
                finalTemperature = parseFloat(temperature);
                console.log(`⚠️ Temperature not found in database, using request body: ${finalTemperature}°C`);
            }
            if (finalHumidity === null && humidity !== undefined) {
                finalHumidity = parseFloat(humidity);
                console.log(`⚠️ Humidity not found in database, using request body: ${finalHumidity}%`);
            }
            if (finalGasLevel === null && gas_level !== undefined) {
                finalGasLevel = parseFloat(gas_level);
                console.log(`⚠️ Gas level not found in database, using request body: ${finalGasLevel} ppm`);
            }
            
            console.log('📊 Final sensor data for prediction:', {
                temperature: finalTemperature,
                humidity: finalHumidity,
                gas_level: finalGasLevel,
                source: finalTemperature !== null && finalHumidity !== null && finalGasLevel !== null ? 'database' : 'mixed'
            });
        } catch (sensorError) {
            console.error('❌ Failed to get latest sensor readings from database:', sensorError);
            // Fallback to request body if database query fails
            if (temperature !== undefined && humidity !== undefined && gas_level !== undefined) {
                console.log('⚠️ Using request body data as fallback due to database error');
                finalTemperature = parseFloat(temperature);
                finalHumidity = parseFloat(humidity);
                finalGasLevel = parseFloat(gas_level);
            } else {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve sensor data for ML prediction: ' + sensorError.message
                });
            }
        }
        
        // Check if all sensor readings are available
        if (finalTemperature === null || finalHumidity === null || finalGasLevel === null) {
            return res.status(400).json({
                success: false,
                error: 'No sensor data available. Please ensure your sensors are working and have sent data before performing ML prediction.'
            });
        }

        // Resolve active model (if any)
        let activeModel = null;
        try {
            const [modelRow] = await db.query(
                `SELECT model_name, model_version, model_type, model_path, created_at, last_trained
                 FROM ml_models
                 WHERE is_active = 1
                 ORDER BY COALESCE(last_trained, created_at) DESC
                 LIMIT 1`
            );
            if (modelRow && modelRow.model_version) {
                activeModel = modelRow;
            } else {
                const [anyModel] = await db.query(
                    `SELECT model_name, model_version, model_type, model_path, created_at, last_trained
                     FROM ml_models
                     ORDER BY COALESCE(last_trained, created_at) DESC
                     LIMIT 1`
                );
                if (anyModel && anyModel.model_version) {
                    activeModel = anyModel;
                }
            }
        } catch (e) {
            console.warn('Could not fetch model (active or latest) for ml-workflow predict:', e.message);
        }

        // Primary: Use AI analysis result for consistency; Fallback: ML training data; Last resort: SmartSense assessment
        console.log('🔍 ML Workflow Status Determination:');
        console.log('  AI Analysis Status (spoilage_status):', spoilage_status);
        console.log('  AI Original Status:', ai_original_status);
        console.log('  Display Override Status:', display_override_status);
        console.log('  Sensor Data for Analysis:', { 
            temperature: finalTemperature, 
            humidity: finalHumidity, 
            gas_level: finalGasLevel 
        });
        console.log('  Temperature Check: 61.10°C > 26°C threshold?', parseFloat(finalTemperature) > 26);
        
        // Get AI API analysis for enhanced prediction support
        // AI is used as PRIMARY decision maker with gas emission as SUPPORT/validation
        let aiApiAnalysis = null;
        let aiAnalysisAttempted = false;
        let aiAnalysisError = null;
        
        if (geminiConfig.apiKey) {
            try {
                aiAnalysisAttempted = true;
                console.log('🤖 [SmartSense Scanner] Calling AI API for enhanced prediction support...');
                console.log('🤖 [SmartSense Scanner] Food:', food_name || food_category || 'Food');
                console.log('🤖 [SmartSense Scanner] Sensor Data:', {
                    temperature: parseFloat(finalTemperature),
                    humidity: parseFloat(finalHumidity),
                    gas_level: parseFloat(finalGasLevel)
                });
                
                aiApiAnalysis = await getAIAnalysisForPrediction(
                    food_name || food_category || 'Food',
                    parseFloat(finalTemperature),
                    parseFloat(finalHumidity),
                    parseFloat(finalGasLevel)
                );
                
                if (aiApiAnalysis) {
                    console.log('✅ [SmartSense Scanner] AI API Analysis Success:', {
                        status: aiApiAnalysis.spoilage_status,
                        probability: aiApiAnalysis.spoilage_probability,
                        confidence: aiApiAnalysis.confidence_score,
                        risk_level: aiApiAnalysis.risk_level,
                        summary: aiApiAnalysis.summary,
                        key_factors: aiApiAnalysis.key_factors,
                        recommendations: aiApiAnalysis.recommendations,
                        estimated_shelf_life_hours: aiApiAnalysis.estimated_shelf_life_hours,
                        ai_insights: aiApiAnalysis.ai_insights
                    });
                } else {
                    console.warn('⚠️ [SmartSense Scanner] AI API returned null - using fallback methods');
                }
            } catch (aiError) {
                aiAnalysisError = aiError;
                console.error('❌ [SmartSense Scanner] AI API analysis failed:', aiError.message);
                console.error('❌ [SmartSense Scanner] AI Error Stack:', aiError.stack);
                // Continue without AI analysis if it fails - will use fallback methods
            }
        } else {
            console.warn('⚠️ [SmartSense Scanner] AI API not configured (GEMINI_API_KEY not set) - using fallback methods');
        }
        
        // Prioritize gas emission analysis first, then AI analysis, then training data, then SmartSense assessment
        // Gas emission is the PRIMARY indicator of spoilage
        const gasAnalysis = gasEmissionAnalysis.analyzeGasEmissionThresholds(parseFloat(finalGasLevel));
        let gasBasedStatus = 'safe';
        if (gasAnalysis.riskLevel === 'high') {
            gasBasedStatus = 'unsafe';
        } else if (gasAnalysis.riskLevel === 'medium') {
            gasBasedStatus = 'caution';
        } else if (gasAnalysis.riskLevel === 'low') {
            gasBasedStatus = 'safe';
        }
        
        const trained = await assessFromTrainingData(db, food_name, food_category, parseFloat(finalTemperature), parseFloat(finalHumidity), parseFloat(finalGasLevel));
        
        // Get manual override from request body (user-reported smell/rot)
        const manualOverride = req.body.manual_override || req.body.manualOverride || req.body.user_reported_spoiled || null;
        const smart = assessSmartSenseStatus(food_name, food_category, parseFloat(finalTemperature), parseFloat(finalHumidity), parseFloat(finalGasLevel), manualOverride);
        
        console.log('📊 [SmartSense Scanner] Prediction Analysis Summary:');
        console.log('  Gas Emission Analysis (Support/Validation):', gasAnalysis.riskLevel, gasBasedStatus);
        console.log('  AI API Analysis (Primary):', aiApiAnalysis ? aiApiAnalysis.spoilage_status : (aiAnalysisAttempted ? 'Failed' : 'Not Attempted'));
        console.log('  AI Analysis Status (from body):', spoilage_status);
        console.log('  Training Data Assessment:', trained ? trained.status : 'None');
        console.log('  SmartSense Assessment:', smart ? smart.status : 'None');
        
        // Priority order: AI API (Primary) > Gas emission (Support/Validation) > Training data > SmartSense > Body spoilage_status
        // AI API analysis is the PRIMARY decision maker, gas emission thresholds are used for SUPPORT/validation
        let finalStatus;
        let statusSource = 'unknown';
        
        if (aiApiAnalysis && aiApiAnalysis.spoilage_status) {
            // AI API is PRIMARY - use its decision
            finalStatus = aiApiAnalysis.spoilage_status;
            statusSource = 'ai_api';
            
            // Gas emission thresholds provide SUPPORT/validation
            // If there's a significant mismatch, log it but trust AI
            if (gasAnalysis.riskLevel === 'high' && finalStatus === 'safe') {
                console.warn('⚠️ [SmartSense Scanner] Validation Warning: Gas emission indicates HIGH risk but AI suggests SAFE. Trusting AI but logging discrepancy.');
                console.warn('⚠️ [SmartSense Scanner] AI may have detected other factors (temperature, humidity, food type) that override gas reading.');
            } else if (gasAnalysis.riskLevel === 'low' && finalStatus === 'unsafe') {
                console.warn('⚠️ [SmartSense Scanner] Validation Warning: Gas emission indicates LOW risk but AI suggests UNSAFE. Trusting AI (may indicate other factors like temperature, humidity, or food type).');
            } else {
                console.log('✅ [SmartSense Scanner] AI and Gas Emission analysis are in agreement');
            }
        } else {
            // Fallback: Use gas emission if AI API not available
            statusSource = 'gas_emission';
            if (gasAnalysis.riskLevel === 'low') {
                finalStatus = 'safe';
            } else if (gasAnalysis.riskLevel === 'medium') {
                finalStatus = 'caution';
            } else if (gasAnalysis.riskLevel === 'high') {
                finalStatus = 'unsafe';
            } else {
                // Fallback to other methods
                if (trained && trained.status) {
                    finalStatus = trained.status;
                    statusSource = 'training_data';
                } else if (smart && smart.status) {
                    finalStatus = smart.status;
                    statusSource = 'smartsense';
                } else if (spoilage_status) {
                    finalStatus = spoilage_status;
                    statusSource = 'body_request';
                } else {
                    finalStatus = 'safe';
                    statusSource = 'default';
                }
            }
            
            if (aiAnalysisAttempted && !aiApiAnalysis) {
                console.warn('⚠️ [SmartSense Scanner] AI analysis was attempted but failed - using fallback method:', statusSource);
                if (aiAnalysisError) {
                    console.warn('⚠️ [SmartSense Scanner] AI Error:', aiAnalysisError.message);
                }
            } else if (!aiAnalysisAttempted) {
                console.warn('⚠️ [SmartSense Scanner] AI analysis not attempted (API key not configured) - using fallback method:', statusSource);
            }
        }
        
        console.log('📊 [SmartSense Scanner] Final Status Determination:');
        console.log('    Status Source:', statusSource);
        console.log('    AI API Status (Primary):', aiApiAnalysis ? aiApiAnalysis.spoilage_status : (aiAnalysisAttempted ? 'Failed' : 'Not Attempted'));
        console.log('    Gas Risk Level (Support):', gasAnalysis.riskLevel);
        console.log('    Final Status:', finalStatus);
        console.log('    Will Create Alert:', finalStatus !== 'safe');
        
        // Use AI API probability as PRIMARY, with gas emission as support/fallback
        const finalProbability = (aiApiAnalysis && aiApiAnalysis.spoilage_probability) ? aiApiAnalysis.spoilage_probability :
                                 gasAnalysis.probability || 
                                 spoilage_probability || 
                                 (trained ? trained.probability : null) || 
                                 (smart ? smart.probability : null) || 
                                 75; // Default probability
        
        // Use AI API confidence as PRIMARY, with gas emission as support/fallback
        const finalConfidence = (aiApiAnalysis && aiApiAnalysis.confidence_score) ? aiApiAnalysis.confidence_score :
                               gasAnalysis.confidence || 
                               confidence_score || 
                               (trained ? Math.max(trained.confidence, 85.0) : null) || 
                               (smart ? Math.max(smart.confidence, 85.0) : null) || 
                               85.0; // Default confidence
        
        console.log('✅ [SmartSense Scanner] Final Prediction Values:');
        console.log('    Final Status:', finalStatus);
        console.log('    Final Probability:', finalProbability);
        console.log('    Final Confidence:', finalConfidence);
        console.log('    Status Source:', statusSource);
        if (aiApiAnalysis) {
            console.log('    AI Insights:', aiApiAnalysis.ai_insights || 'None');
            console.log('    AI Summary:', aiApiAnalysis.summary || 'None');
            console.log('    AI Key Factors:', aiApiAnalysis.key_factors || []);
            console.log('    AI Recommendations:', aiApiAnalysis.recommendations || []);
        }

        // Insert ML prediction
        const result = await db.query(
            `INSERT INTO ml_predictions 
            (user_id, food_id, food_name, food_category, expiration_date, temperature, humidity, gas_level,
             spoilage_probability, spoilage_status, confidence_score, model_version, 
             prediction_data, recommendations, is_training_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                food_id || null,
                food_name,
                food_category || null,
                expirationDateValue,
                finalTemperature,
                finalHumidity,
                finalGasLevel,
                finalProbability,
                finalStatus,
                finalConfidence,
                (activeModel && activeModel.model_version) ? activeModel.model_version : '1.0',
                JSON.stringify({
                    ai_analysis: true,
                    ai_api_analysis: aiApiAnalysis || null,
                    ai_analysis_attempted: aiAnalysisAttempted,
                    ai_analysis_error: aiAnalysisError ? aiAnalysisError.message : null,
                    status_source: statusSource,
                    timestamp: new Date().toISOString(),
                    model_type: trained ? 'smart_training_db' : (smart ? 'smartsense_table' : 'client_provided'),
                    ai_api_support: aiApiAnalysis ? {
                        status: aiApiAnalysis.spoilage_status,
                        probability: aiApiAnalysis.spoilage_probability,
                        confidence: aiApiAnalysis.confidence_score,
                        risk_level: aiApiAnalysis.risk_level,
                        summary: aiApiAnalysis.summary,
                        key_factors: aiApiAnalysis.key_factors,
                        recommendations: aiApiAnalysis.recommendations,
                        ai_insights: aiApiAnalysis.ai_insights,
                        estimated_shelf_life_hours: aiApiAnalysis.estimated_shelf_life_hours,
                        source: 'ai_api'
                    } : null,
                    gas_emission_support: {
                        risk_level: gasAnalysis.riskLevel,
                        status: gasBasedStatus,
                        probability: gasAnalysis.probability,
                        confidence: gasAnalysis.confidence,
                        threshold: gasAnalysis.threshold,
                        recommendation: gasAnalysis.recommendation
                    },
                    model: activeModel ? {
                        name: activeModel.model_name,
                        version: activeModel.model_version,
                        type: activeModel.model_type,
                        path: activeModel.model_path
                    } : { version: '1.0' },
                    source_details: trained && trained.meta ? trained.meta : undefined
                }),
                JSON.stringify(recommendations || []),
                1 // This is training data
            ]
        );

        console.log('ML prediction stored successfully with ID:', result.insertId);

        // Update food item expiration date based on ML prediction if food_id exists
        if (food_id && finalStatus) {
            try {
                await updateFoodExpiryFromMLPrediction(food_id, finalStatus, finalProbability);
            } catch (updateError) {
                console.warn('Failed to update food item expiry from ML prediction:', updateError.message);
            }
        }

        // Create alert if spoilage detected, include recommended_action and alert_data like SmartSense
        console.log('🚨 ML Workflow Alert Check:');
        console.log('  Final Status:', finalStatus);
        console.log('  Should Create Alert:', finalStatus !== 'safe');
        
        if (finalStatus !== 'safe') {
            try {
                const alertLevel = finalStatus === 'unsafe' ? 'High' : 'Medium';
                const recommendedAction = finalStatus === 'unsafe'
                    ? 'Discard immediately and sanitize storage area.'
                    : 'Consume soon or improve storage conditions.';
                const alertData = JSON.stringify({
                    source: 'ml_workflow',
                    condition: finalStatus,
                    sensor_readings: {
                        temperature: finalTemperature,
                        humidity: finalHumidity,
                        gas_level: finalGasLevel
                    },
                    ai_thresholds: aiThresholds || null,
                    model: activeModel ? {
                        name: activeModel.model_name,
                        version: activeModel.model_version,
                        type: activeModel.model_type
                    } : { version: '1.0' },
                    prediction_id: result.insertId,
                    timestamp: new Date().toISOString()
                });
                const insertAlertResult = await db.query(
                    `INSERT INTO alerts 
                    (user_id, food_id, message, alert_level, alert_type, ml_prediction_id, spoilage_probability, recommended_action, is_ml_generated, confidence_score, alert_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        user_id,
                        food_id || null,
                        `ML Prediction: ${food_name} may be ${finalStatus} (${finalProbability}% probability)`,
                        alertLevel,
                        'ml_prediction',
                        result.insertId,
                        finalProbability,
                        recommendedAction,
                        1,
                        finalConfidence,
                        alertData
                    ]
                );

                // Send spoilage email (medium/high only) with throttling
                try {
                    if (String(alertLevel).toLowerCase() !== 'low') {
                        const canSend = await shouldSendSpoilageEmail(db, {
                            user_id,
                            food_id: food_id || null,
                            alert_type: 'ml_prediction',
                            alert_level: alertLevel
                        });
                        if (!canSend) {
                            // Throttled: skip email
                        } else {
                        const userRows = await db.query('SELECT first_name, last_name, email FROM users WHERE user_id = ? LIMIT 1', [user_id]);
                        const user = Array.isArray(userRows) ? userRows[0] : null;
                        if (user && user.email) {
                            let foodNameResolved = food_name;
                            if (!foodNameResolved && food_id) {
                                const fi = await db.query('SELECT name FROM food_items WHERE food_id = ? LIMIT 1', [food_id]);
                                if (Array.isArray(fi) && fi.length > 0) foodNameResolved = fi[0].name;
                            }
                            await EmailService.sendSpoilageAlertEmail(
                                user.email,
                                `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
                                {
                                    foodName: foodNameResolved,
                                    alertLevel,
                                    alertType: 'ml_prediction',
                                    probability: finalProbability,
                                    recommendation: recommendedAction,
                                    message: `ML Prediction: ${foodNameResolved || food_name || 'Food item'} may be ${finalStatus} (${finalProbability}%)`,
                                    sensorReadings: {
                                        temperature: finalTemperature,
                                        humidity: finalHumidity,
                                        gas_level: finalGasLevel
                                    }
                                }
                            );
                        }
                        }
                    }
                } catch (_) { }
            } catch (alertError) {
                console.warn('Could not create alert:', alertError.message);
            }
        }

        console.log('📤 [SmartSense Scanner] ML Workflow Response to Frontend:');
        console.log('  Final Status:', finalStatus);
        console.log('  Final Probability:', finalProbability);
        console.log('  Final Confidence:', finalConfidence);
        console.log('  Gas Risk Level:', gasAnalysis.riskLevel);
        console.log('  Status Source:', statusSource);
        console.log('  AI Analysis Used:', !!aiApiAnalysis);
        
        // Build recommendations object - prioritize AI recommendations, fallback to gas emission
        let mainRecommendation = '';
        let recommendationsArray = [];
        
        if (aiApiAnalysis && aiApiAnalysis.recommendations) {
            if (Array.isArray(aiApiAnalysis.recommendations)) {
                recommendationsArray = aiApiAnalysis.recommendations;
                mainRecommendation = aiApiAnalysis.recommendations[0] || '';
            } else if (typeof aiApiAnalysis.recommendations === 'string') {
                mainRecommendation = aiApiAnalysis.recommendations;
                recommendationsArray = [mainRecommendation];
            }
        }
        
        // Fallback to gas emission recommendation if AI doesn't have recommendations
        if (!mainRecommendation && gasAnalysis.recommendation) {
            mainRecommendation = gasAnalysis.recommendation;
            recommendationsArray = [mainRecommendation];
        }
        
        // Fallback to SmartSense recommendation if still no recommendation
        if (!mainRecommendation && smart && smart.recommendation) {
            mainRecommendation = smart.recommendation;
            recommendationsArray = [mainRecommendation];
        }
        
        // Build recommendations object
        const recommendationsObj = {
            main: mainRecommendation || 'No recommendations available',
            details: recommendationsArray.length > 1 ? recommendationsArray.slice(1) : []
        };
        
        console.log('📊 Recommendations for response:', {
            main: recommendationsObj.main,
            details: recommendationsObj.details,
            source: aiApiAnalysis ? 'ai' : (gasAnalysis.recommendation ? 'gas_emission' : 'smartsense')
        });
        
        // Prepare response with AI insights if available
        const response = {
            success: true,
            prediction_id: result.insertId,
            spoilage_status: finalStatus,
            spoilage_probability: finalProbability,
            confidence_score: finalConfidence,
            message: 'ML prediction completed successfully',
            status_source: statusSource,
            recommendation: recommendationsObj.main,
            recommendations: recommendationsObj,
            ai_support: aiApiAnalysis ? {
                used: true,
                status: aiApiAnalysis.spoilage_status,
                probability: aiApiAnalysis.spoilage_probability,
                confidence: aiApiAnalysis.confidence_score,
                summary: aiApiAnalysis.summary,
                key_factors: aiApiAnalysis.key_factors,
                recommendations: aiApiAnalysis.recommendations,
                ai_insights: aiApiAnalysis.ai_insights,
                estimated_shelf_life_hours: aiApiAnalysis.estimated_shelf_life_hours
            } : {
                used: false,
                attempted: aiAnalysisAttempted,
                error: aiAnalysisError ? aiAnalysisError.message : null
            },
            gas_emission_support: {
                risk_level: gasAnalysis.riskLevel,
                status: gasBasedStatus,
                probability: gasAnalysis.probability,
                confidence: gasAnalysis.confidence,
                recommendation: gasAnalysis.recommendation
            }
        };
        
        res.json(response);

    } catch (error) {
        console.error('Error generating ML prediction:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate ML prediction'
        });
    }
});

// POST /api/ml-workflow/update-food-item - Update food item with sensor data
router.post('/update-food-item', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_id,
            scan_status,
            scan_timestamp,
            sensor_data
        } = req.body;

        if (!food_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: food_id'
            });
        }

        // Update food item with sensor data and scan status
        console.log('Updating food item:', {
            food_id,
            user_id,
            scan_status: scan_status || 'analyzed',
            scan_timestamp: scan_timestamp || new Date().toISOString()
        });

        const result = await db.query(
            `UPDATE food_items 
            SET scan_status = ?,
                scan_timestamp = ?,
                updated_at = NOW()
            WHERE food_id = ? AND user_id = ?`,
            [
                scan_status || 'analyzed',
                scan_timestamp || new Date().toISOString(),
                food_id,
                user_id
            ]
        );

        console.log('Food item update result:', {
            affectedRows: result.affectedRows,
            insertId: result.insertId
        });

        if (result.affectedRows === 0) {
            console.error('No food item found to update:', { food_id, user_id });
            return res.status(404).json({
                success: false,
                error: 'Food item not found or access denied'
            });
        }

        // Don't create new readings - just use existing ones for ML training
        // The readings are already stored by the sensor data endpoint
        console.log('Using existing sensor readings for ML training - no new readings created');

        console.log('Food item updated with sensor data successfully');

        res.json({
            success: true,
            message: 'Food item updated with sensor data',
            food_id,
            scan_status: scan_status || 'analyzed',
            sensor_data_stored: !!sensor_data
        });

    } catch (error) {
        console.error('Error updating food item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update food item'
        });
    }
});

// POST /api/ml-workflow/update-all-pending - Update all pending food items to analyzed
router.post('/update-all-pending', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {
            food_name,
            food_category,
            primary_food_id
        } = req.body;

        if (!food_name || !food_category) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: food_name, food_category'
            });
        }

        console.log('Updating all pending food items:', {
            food_name,
            food_category,
            user_id
        });

        // Check current count of analyzed items
        const analyzedCount = await db.query(
            `SELECT COUNT(*) as count FROM food_items 
             WHERE name = ? AND category = ? AND user_id = ? AND scan_status = 'analyzed'`,
            [food_name, food_category, user_id]
        );

        const currentAnalyzedCount = analyzedCount[0].count;
        console.log(`Current analyzed items for ${food_name}: ${currentAnalyzedCount}`);

        // Get all pending food items for this food
        const pendingItems = await db.query(
            `SELECT food_id FROM food_items 
             WHERE name = ? AND category = ? AND user_id = ? AND scan_status = 'pending'
             ORDER BY created_at ASC`,
            [food_name, food_category, user_id]
        );

        console.log(`Found ${pendingItems.length} pending items for ${food_name}`);

        let totalUpdated = 0;

        if (pendingItems.length === 0) {
            // No pending items, check if we need to create new ones
            if (currentAnalyzedCount < 3) {
                const neededCount = 3 - currentAnalyzedCount;
                console.log(`Creating ${neededCount} new food items with same food_id`);
                
                // Get user's sensors
                const sensors = await db.query(
                    'SELECT sensor_id FROM sensor WHERE user_id = ? ORDER BY sensor_id LIMIT ?',
                    [user_id, neededCount]
                );
                
                if (sensors.length > 0) {
                    // Since food_id is PRIMARY KEY (unique), we'll create sequential food_ids
                    // but they represent the same logical food item
                    const maxId = await db.query('SELECT MAX(food_id) as max_id FROM food_items');
                    const baseFoodId = (maxId[0].max_id || 0) + 1;
                    
                    console.log(`Creating ${sensors.length} food items starting from food_id: ${baseFoodId}`);
                    
                    // Create entries with sequential food_ids but same logical grouping
                    for (let i = 0; i < sensors.length; i++) {
                        const currentFoodId = baseFoodId + i;
                        const result = await db.query(
                            `INSERT INTO food_items (food_id, name, category, user_id, scan_status, scan_timestamp, sensor_id, created_at, updated_at)
                             VALUES (?, ?, ?, ?, 'analyzed', NOW(), ?, NOW(), NOW())`,
                            [currentFoodId, food_name, food_category, user_id, sensors[i].sensor_id]
                        );
                        totalUpdated++;
                        console.log(`Created food item with food_id ${currentFoodId} and sensor_id: ${sensors[i].sensor_id}`);
                    }
                } else {
                    console.log('No sensors available for user');
                }
            }
        } else {
            // Update pending items to analyzed status
            const maxToUpdate = Math.min(pendingItems.length, 3 - currentAnalyzedCount);
            
            for (let i = 0; i < maxToUpdate; i++) {
                const item = pendingItems[i];
                const result = await db.query(
                    `UPDATE food_items 
                     SET scan_status = 'analyzed', scan_timestamp = NOW(), updated_at = NOW()
                     WHERE food_id = ?`,
                    [item.food_id]
                );
                totalUpdated++;
                console.log(`Updated food item ${item.food_id} to analyzed status`);
            }

            // If we still need more items to reach 3 total, create them with same food_id
            const remainingCount = 3 - (currentAnalyzedCount + totalUpdated);
            if (remainingCount > 0) {
                console.log(`Creating ${remainingCount} additional food items with same food_id`);
                
                // Get user's sensors
                const sensors = await db.query(
                    'SELECT sensor_id FROM sensor WHERE user_id = ? ORDER BY sensor_id LIMIT ?',
                    [user_id, remainingCount]
                );
                
                if (sensors.length > 0) {
                    // Since food_id is PRIMARY KEY (unique), we'll create sequential food_ids
                    // but they represent the same logical food item
                    const maxId = await db.query('SELECT MAX(food_id) as max_id FROM food_items');
                    const baseFoodId = (maxId[0].max_id || 0) + 1;
                    
                    console.log(`Creating ${sensors.length} additional food items starting from food_id: ${baseFoodId}`);
                    
                    for (let i = 0; i < sensors.length; i++) {
                        const currentFoodId = baseFoodId + i;
                        const result = await db.query(
                            `INSERT INTO food_items (food_id, name, category, user_id, scan_status, scan_timestamp, sensor_id, created_at, updated_at)
                             VALUES (?, ?, ?, ?, 'analyzed', NOW(), ?, NOW(), NOW())`,
                            [currentFoodId, food_name, food_category, user_id, sensors[i].sensor_id]
                        );
                        totalUpdated++;
                        console.log(`Created food item with food_id ${currentFoodId} and sensor_id: ${sensors[i].sensor_id}`);
                    }
                }
            }
        }

        console.log(`Total updated/created: ${totalUpdated} food items`);

        res.json({
            success: true,
            message: `Updated ${totalUpdated} food items to analyzed status`,
            updated_count: totalUpdated,
            food_name,
            food_category
        });

    } catch (error) {
        console.error('Error updating all pending food items:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            success: false,
            error: 'Failed to update all pending food items',
            details: error.message
        });
    }
});

// GET /api/ml-workflow/training-stats - Get training data statistics
router.get('/training-stats', Auth.authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        // Get training data statistics
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_training_data,
                COUNT(CASE WHEN actual_spoilage_status = 'safe' THEN 1 END) as safe_count,
                COUNT(CASE WHEN actual_spoilage_status = 'caution' THEN 1 END) as caution_count,
                COUNT(CASE WHEN actual_spoilage_status = 'unsafe' THEN 1 END) as unsafe_count,
                AVG(quality_score) as avg_quality_score,
                COUNT(DISTINCT food_category) as categories_count
            FROM ml_training_data
        `);

        // Get recent predictions
        const [recentPredictions] = await db.query(`
            SELECT 
                mp.prediction_id,
                mp.food_name,
                mp.food_category,
                mp.spoilage_status,
                mp.confidence_score,
                mp.created_at
            FROM ml_predictions mp
            WHERE mp.user_id = ?
            ORDER BY mp.created_at DESC
            LIMIT 10
        `, [user_id]);

        res.json({
            success: true,
            stats: stats[0],
            recent_predictions: recentPredictions
        });

    } catch (error) {
        console.error('Error getting training stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get training statistics'
        });
    }
});

// GET /api/ml-workflow/models - Get available ML models
router.get('/models', Auth.authenticateToken, async (req, res) => {
    try {
        const [models] = await db.query(`
            SELECT 
                model_id,
                model_name,
                model_version,
                model_type,
                accuracy_score,
                precision_score,
                recall_score,
                f1_score,
                is_active,
                last_trained,
                training_data_count
            FROM ml_models
            ORDER BY is_active DESC, last_trained DESC
        `);

        res.json({
            success: true,
            models
        });

    } catch (error) {
        console.error('Error getting ML models:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get ML models'
        });
    }
});

// Update food item expiration date based on ML prediction results
async function updateFoodExpiryFromMLPrediction(foodId, spoilageStatus, spoilageProbability) {
    try {
        // Calculate new expiration date based on spoilage status and probability
        const now = new Date();
        let daysToAdd = 0;
        
        // Map spoilage status to days remaining
        switch (spoilageStatus.toLowerCase()) {
            case 'safe':
                daysToAdd = 3; // 3 days for safe items
                break;
            case 'caution':
                // 3 hours for caution items - calculate date after adding hours
                const cautionExpiryDate = new Date(now);
                cautionExpiryDate.setHours(cautionExpiryDate.getHours() + 3);
                const year = cautionExpiryDate.getFullYear();
                const month = String(cautionExpiryDate.getMonth() + 1).padStart(2, '0');
                const day = String(cautionExpiryDate.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                
                // Update expiration_date in ml_predictions table for all predictions linked to this food_id
                await db.query(
                    'UPDATE ml_predictions SET expiration_date = ? WHERE food_id = ?',
                    [formattedDate, foodId]
                );
                
                console.log(`Updated ml_predictions expiration_date for food_id ${foodId} to ${formattedDate} based on ML prediction (${spoilageStatus}, ${spoilageProbability}%) - 3 hours expiry`);
                return true;
            case 'unsafe':
                // For unsafe items, set to today or yesterday based on probability
                if (spoilageProbability >= 80) {
                    daysToAdd = -1; // Yesterday (already spoiled)
                } else {
                    daysToAdd = 0; // Today (spoiling today)
                }
                break;
            default:
                daysToAdd = 1; // Default to 1 day
        }
        
        // Calculate new expiration date
        const newExpirationDate = new Date(now);
        newExpirationDate.setDate(now.getDate() + daysToAdd);
        
        // Format as YYYY-MM-DD
        const year = newExpirationDate.getFullYear();
        const month = String(newExpirationDate.getMonth() + 1).padStart(2, '0');
        const day = String(newExpirationDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        // Update expiration_date in ml_predictions table for all predictions linked to this food_id
        await db.query(
            'UPDATE ml_predictions SET expiration_date = ? WHERE food_id = ?',
            [formattedDate, foodId]
        );
        
        console.log(`Updated ml_predictions expiration_date for food_id ${foodId} to ${formattedDate} based on ML prediction (${spoilageStatus}, ${spoilageProbability}%)`);
        
        return true;
    } catch (error) {
        console.error('Error updating food item expiry from ML prediction:', error);
        throw error;
    }
}

module.exports = router;
