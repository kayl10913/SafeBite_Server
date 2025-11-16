/**
 * Gas Emission Analysis Utility
 * 
 * This utility provides standardized gas emission threshold analysis
 * for food spoilage detection across the SafeBite system.
 * 
 * Location-Specific Environmental Conditions:
 * - Container Temperature: 22-26°C (empty container baseline) - baseline for this location
 * - Humidity: 40-60% (normal range) - baseline for this location
 * - Gas Emission: Real-time food spoilage indicator (not environmental)
 * 
 * Gas Emission Thresholds & Recommendations:
 * - Low Risk (0–120): Fresh/Safe
 * - Medium Risk (121–250): Early Spoilage Signs  
 * - High Risk (251+): Spoilage Detected
 */

/**
 * Analyzes gas emission levels and returns standardized risk assessment
 * @param {number} gasLevel - Gas level in ppm
 * @returns {Object} Analysis result with risk level, status, and recommendations
 */
function analyzeGasEmissionThresholds(gasLevel) {
    // Validate input
    if (typeof gasLevel !== 'number' || isNaN(gasLevel)) {
        return {
            riskLevel: 'unknown',
            status: 'unknown',
            probability: 0,
            confidence: 0,
            recommendation: 'Invalid gas level reading. Please check sensor.',
            threshold: 'invalid',
            gasLevel: gasLevel
        };
    }

    if (gasLevel >= 400) {
        // High Risk (400+ ppm) - Severe Spoilage Detected
        return {
            riskLevel: 'high',
            status: 'unsafe',
            probability: 98,
            confidence: 95,
            recommendation: 'CRITICAL: Severe Spoilage Detected (400+ ppm). Do not consume. Dispose immediately to avoid foodborne illness. Sanitize storage area thoroughly.',
            threshold: '400+ ppm',
            gasLevel: gasLevel,
            alertLevel: 'critical',
            actionRequired: 'immediate_disposal'
        };
    } else if (gasLevel >= 200) {
        // High Risk (200-399 ppm) - Advanced Spoilage
        return {
            riskLevel: 'high',
            status: 'unsafe',
            probability: 90,
            confidence: 90,
            recommendation: 'CRITICAL: Advanced Spoilage Detected (200-399 ppm). Do not consume. Dispose immediately. Check for strong odors, discoloration, or slimy texture.',
            threshold: '200-399 ppm',
            gasLevel: gasLevel,
            alertLevel: 'critical',
            actionRequired: 'immediate_disposal'
        };
    } else if (gasLevel >= 100) {
        // High Risk (100-199 ppm) - Spoilage Detected
        return {
            riskLevel: 'high',
            status: 'unsafe',
            probability: 85,
            confidence: 88,
            recommendation: 'CRITICAL: Spoilage Detected (100-199 ppm). Food is unsafe to consume. Dispose immediately. Inspect for off-odors, discoloration, or texture changes.',
            threshold: '100-199 ppm',
            gasLevel: gasLevel,
            alertLevel: 'critical',
            actionRequired: 'immediate_disposal'
        };
    } else if (gasLevel >= 70) {
        // High Risk (70-99 ppm) - Spoilage Detected (Based on observations)
        return {
            riskLevel: 'high',
            status: 'unsafe',
            probability: 80,
            confidence: 85,
            recommendation: 'CRITICAL: Spoilage Detected (70-99 ppm). Food is unsafe to consume. Based on sensor observations, gas levels above 70 ppm indicate spoilage. Dispose immediately if strong smell or rot is observed.',
            threshold: '70-99 ppm',
            gasLevel: gasLevel,
            alertLevel: 'critical',
            actionRequired: 'immediate_disposal'
        };
    } else if (gasLevel >= 50) {
        // Medium Risk (50-69 ppm) - Early Warning Signs
        return {
            riskLevel: 'medium',
            status: 'caution',
            probability: 60,
            confidence: 85,
            recommendation: 'WARNING: Elevated Gas Levels (50-69 ppm). Food may be starting to spoil. Inspect carefully for any signs of spoilage (smell, color, texture). Consume within 3 hours or discard if suspicious.',
            threshold: '50-69 ppm',
            gasLevel: gasLevel,
            alertLevel: 'warning',
            actionRequired: 'inspect_and_consume_soon'
        };
    } else if (gasLevel >= 0) {
        // Low Risk (0-49 ppm) - Fresh/Safe
        return {
            riskLevel: 'low',
            status: 'safe',
            probability: 20,
            confidence: 90,
            recommendation: 'Low Risk: Fresh/Safe (0-49 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.',
            threshold: '0-49 ppm',
            gasLevel: gasLevel,
            alertLevel: 'info',
            actionRequired: 'normal_storage'
        };
    }
    
    // Invalid gas level (negative values)
    return {
        riskLevel: 'unknown',
        status: 'unknown',
        probability: 0,
        confidence: 0,
        recommendation: 'Invalid gas level reading. Please check sensor.',
        threshold: 'invalid',
        gasLevel: gasLevel,
        alertLevel: 'error',
        actionRequired: 'check_sensor'
    };
}

/**
 * Gets gas emission threshold constants
 * @returns {Object} Threshold values
 */
function getGasEmissionThresholds() {
    return {
        low: {
            min: 0,
            max: 49,
            status: 'Fresh / Safe',
            description: 'Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.'
        },
        medium: {
            min: 50,
            max: 69,
            status: 'Early Warning',
            description: 'Elevated gas levels detected. Food may be starting to spoil. Inspect carefully and consume within 3 hours or discard if suspicious.'
        },
        high: {
            min: 70,
            max: 99,
            status: 'Spoilage Detected',
            description: 'CRITICAL: Gas levels above 70 ppm indicate spoilage. Food is unsafe to consume. Dispose immediately if strong smell or rot is observed.'
        },
        high_2: {
            min: 100,
            max: 199,
            status: 'Spoilage Detected',
            description: 'CRITICAL: Food is unsafe to consume. Dispose immediately. Inspect for off-odors, discoloration, or texture changes.'
        },
        high_3: {
            min: 200,
            max: 399,
            status: 'Advanced Spoilage',
            description: 'CRITICAL: Advanced spoilage detected. Do not consume. Dispose immediately. Check for strong odors, discoloration, or slimy texture.'
        },
        critical: {
            min: 400,
            max: Infinity,
            status: 'Severe Spoilage',
            description: 'CRITICAL: Severe spoilage detected. Do not consume. Dispose immediately to avoid foodborne illness. Sanitize storage area thoroughly.'
        }
    };
}

/**
 * Determines if gas level requires immediate attention
 * @param {number} gasLevel - Gas level in ppm
 * @returns {boolean} True if immediate attention required
 */
function requiresImmediateAttention(gasLevel) {
    const analysis = analyzeGasEmissionThresholds(gasLevel);
    return analysis.riskLevel === 'high' || analysis.riskLevel === 'medium';
}

/**
 * Gets appropriate alert level for gas emission
 * @param {number} gasLevel - Gas level in ppm
 * @returns {string} Alert level (critical, warning, info, error)
 */
function getAlertLevel(gasLevel) {
    const analysis = analyzeGasEmissionThresholds(gasLevel);
    return analysis.alertLevel;
}

/**
 * Gets recommended action for gas emission level
 * @param {number} gasLevel - Gas level in ppm
 * @returns {string} Recommended action
 */
function getRecommendedAction(gasLevel) {
    const analysis = analyzeGasEmissionThresholds(gasLevel);
    return analysis.actionRequired;
}

/**
 * Analyzes environmental conditions based on food-specific requirements
 * @param {number} temperature - Current temperature in °C
 * @param {number} humidity - Current humidity in %
 * @param {string} foodType - Type of food being analyzed (optional)
 * @returns {Object} Environmental analysis result
 */
function analyzeEnvironmentalConditions(temperature, humidity, foodType = null) {
    // Get food-specific environmental requirements
    const foodRequirements = getFoodSpecificRequirements(foodType);
    
    // Location-specific environmental conditions for this location
    const baselineTemp = 24; // Average of 22-26°C (empty container temperature) - baseline for this location
    const baselineHumidity = 50; // Average of 40-60% (normal range) - baseline for this location
    
    const tempDeviation = temperature - baselineTemp;
    const humidityDeviation = humidity - baselineHumidity;
    
    let tempRisk = 'normal';
    let humidityRisk = 'normal';
    let overallRisk = 'normal';
    
    // Temperature analysis based on food-specific requirements
    if (temperature > foodRequirements.tempMax) {
        tempRisk = 'high';   // Above food-specific maximum
    } else if (temperature > foodRequirements.tempOptimal) {
        tempRisk = 'medium'; // Above food-specific optimal but within max
    } else if (temperature < foodRequirements.tempMin) {
        tempRisk = 'low';    // Below food-specific minimum
    }
    
    // Humidity analysis based on food-specific requirements
    // Extreme humidity (>90%) should always be considered high risk
    if (humidity > 90) {
        humidityRisk = 'high';   // Extreme humidity - critical risk
    } else if (humidity > foodRequirements.humidityMax) {
        humidityRisk = 'high';   // Above food-specific maximum
    } else if (humidity > foodRequirements.humidityOptimal) {
        humidityRisk = 'medium'; // Above food-specific optimal but within max
    } else if (humidity < foodRequirements.humidityMin) {
        humidityRisk = 'low';    // Below food-specific minimum
    }
    
    // Overall environmental risk
    if (tempRisk === 'high' || humidityRisk === 'high') {
        overallRisk = 'high';
    } else if (tempRisk === 'medium' || humidityRisk === 'medium') {
        overallRisk = 'medium';
    }
    
    return {
        baselineTemp,
        baselineHumidity,
        tempDeviation,
        humidityDeviation,
        tempRisk,
        humidityRisk,
        overallRisk,
        recommendation: getEnvironmentalRecommendation(tempRisk, humidityRisk, foodType)
    };
}

/**
 * Gets food-specific environmental requirements
 * @param {string} foodType - Type of food
 * @returns {Object} Food-specific temperature and humidity requirements
 */
function getFoodSpecificRequirements(foodType) {
    if (!foodType) {
        // Default requirements for unknown foods - room temperature storage
        return {
            tempMin: 15,
            tempOptimal: 22,
            tempMax: 30,
            humidityMin: 30,
            humidityOptimal: 50,
            humidityMax: 70,
            category: 'general'
        };
    }
    
    const foodTypeLower = foodType.toLowerCase();
    
    // Meat and poultry requirements - room temperature storage
    if (foodTypeLower.includes('meat') || foodTypeLower.includes('chicken') || 
        foodTypeLower.includes('beef') || foodTypeLower.includes('pork') || 
        foodTypeLower.includes('lamb') || foodTypeLower.includes('turkey')) {
        return {
            tempMin: 15,
            tempOptimal: 22,
            tempMax: 28,
            humidityMin: 30,
            humidityOptimal: 50,
            humidityMax: 60,
            category: 'meat'
        };
    }
    
    // Seafood requirements - room temperature storage
    if (foodTypeLower.includes('fish') || foodTypeLower.includes('salmon') || 
        foodTypeLower.includes('tuna') || foodTypeLower.includes('shrimp') || 
        foodTypeLower.includes('seafood') || foodTypeLower.includes('crab')) {
        return {
            tempMin: 15,
            tempOptimal: 22,
            tempMax: 28,
            humidityMin: 40,
            humidityOptimal: 60,
            humidityMax: 70,
            category: 'seafood'
        };
    }
    
    // Dairy requirements - room temperature storage
    if (foodTypeLower.includes('milk') || foodTypeLower.includes('cheese') || 
        foodTypeLower.includes('yogurt') || foodTypeLower.includes('butter') || 
        foodTypeLower.includes('cream') || foodTypeLower.includes('dairy')) {
        return {
            tempMin: 15,
            tempOptimal: 22,
            tempMax: 28,
            humidityMin: 30,
            humidityOptimal: 50,
            humidityMax: 60,
            category: 'dairy'
        };
    }
    
    // Vegetables requirements - room temperature storage
    if (foodTypeLower.includes('vegetable') || foodTypeLower.includes('carrot') || 
        foodTypeLower.includes('potato') || foodTypeLower.includes('onion') || 
        foodTypeLower.includes('tomato') || foodTypeLower.includes('lettuce')) {
        return {
            tempMin: 15,
            tempOptimal: 22,
            tempMax: 30,
            humidityMin: 40,
            humidityOptimal: 60,
            humidityMax: 80,
            category: 'vegetables'
        };
    }
    
    // Fruits requirements - room temperature storage
    if (foodTypeLower.includes('fruit') || foodTypeLower.includes('apple') || 
        foodTypeLower.includes('banana') || foodTypeLower.includes('orange') || 
        foodTypeLower.includes('berry') || foodTypeLower.includes('grape')) {
        return {
            tempMin: 15,
            tempOptimal: 22,
            tempMax: 30,
            humidityMin: 40,
            humidityOptimal: 60,
            humidityMax: 70,
            category: 'fruits'
        };
    }
    
    // Default requirements for other foods - room temperature storage
    return {
        tempMin: 15,
        tempOptimal: 22,
        tempMax: 30,
        humidityMin: 30,
        humidityOptimal: 50,
        humidityMax: 70,
        category: 'general'
    };
}

/**
 * Gets environmental recommendation based on risk levels and food type
 * @param {string} tempRisk - Temperature risk level
 * @param {string} humidityRisk - Humidity risk level
 * @param {string} foodType - Type of food (optional)
 * @returns {string} Recommendation
 */
function getEnvironmentalRecommendation(tempRisk, humidityRisk, foodType = null) {
    const foodRequirements = getFoodSpecificRequirements(foodType);
    
    if (tempRisk === 'high' && humidityRisk === 'high') {
        return `High temperature and humidity detected for ${foodRequirements.category}. Consider refrigeration or air conditioning to slow spoilage.`;
    } else if (tempRisk === 'high') {
        return `High temperature detected for ${foodRequirements.category}. Store in cooler location or refrigerate if possible.`;
    } else if (humidityRisk === 'high') {
        return `High humidity detected for ${foodRequirements.category}. Use dehumidifier or store in drier location.`;
    } else if (tempRisk === 'medium' || humidityRisk === 'medium') {
        return `Environmental conditions are slightly elevated for ${foodRequirements.category}. Monitor food closely.`;
    } else {
        return `Environmental conditions are optimal for ${foodRequirements.category} storage.`;
    }
}

module.exports = {
    analyzeGasEmissionThresholds,
    getGasEmissionThresholds,
    requiresImmediateAttention,
    getAlertLevel,
    getRecommendedAction,
    analyzeEnvironmentalConditions,
    getEnvironmentalRecommendation,
    getFoodSpecificRequirements
};
