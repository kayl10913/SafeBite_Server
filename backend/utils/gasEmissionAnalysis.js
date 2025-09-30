/**
 * Gas Emission Analysis Utility
 * 
 * This utility provides standardized gas emission threshold analysis
 * for food spoilage detection across the SafeBite system.
 * 
 * Baseline Environmental Conditions:
 * - Base Temperature: 27-28°C
 * - Base Humidity: 71% monthly, 85% monthly, 73.8% annually
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

    if (gasLevel >= 251) {
        // High Risk (251+ ppm) - Spoilage Detected
        return {
            riskLevel: 'high',
            status: 'unsafe',
            probability: 95,
            confidence: 90,
            recommendation: 'High Risk: Spoilage Detected (251+ ppm). Do not consume. Dispose of the food to avoid foodborne illness. Sanitize storage area to prevent cross-contamination.',
            threshold: '251+ ppm',
            gasLevel: gasLevel,
            alertLevel: 'critical',
            actionRequired: 'immediate_disposal'
        };
    } else if (gasLevel >= 121) {
        // Medium Risk (121-250 ppm) - Early Spoilage Signs
        return {
            riskLevel: 'medium',
            status: 'caution',
            probability: 75,
            confidence: 85,
            recommendation: 'Medium Risk: Early Spoilage Signs (121-250 ppm). Consume soon (within 1–2 days). Refrigerate immediately if not yet stored. Check for changes in smell, texture, or color.',
            threshold: '121-250 ppm',
            gasLevel: gasLevel,
            alertLevel: 'warning',
            actionRequired: 'consume_soon'
        };
    } else if (gasLevel >= 0) {
        // Low Risk (0-120 ppm) - Fresh/Safe
        return {
            riskLevel: 'low',
            status: 'safe',
            probability: gasLevel > 80 ? 60 : 20,
            confidence: 90,
            recommendation: 'Low Risk: Fresh/Safe (0-120 ppm). Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.',
            threshold: '0-120 ppm',
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
            max: 120,
            status: 'Fresh / Safe',
            description: 'Food is safe to consume and store. Keep in a cool, dry place or refrigerate if needed.'
        },
        medium: {
            min: 121,
            max: 250,
            status: 'Early Spoilage Signs',
            description: 'Consume soon (within 1–2 days). Refrigerate immediately if not yet stored. Check for changes in smell, texture, or color.'
        },
        high: {
            min: 251,
            max: Infinity,
            status: 'Spoilage Detected',
            description: 'Do not consume. Dispose of the food to avoid foodborne illness. Sanitize storage area to prevent cross-contamination.'
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
 * Analyzes environmental conditions based on baseline values
 * @param {number} temperature - Current temperature in °C
 * @param {number} humidity - Current humidity in %
 * @returns {Object} Environmental analysis result
 */
function analyzeEnvironmentalConditions(temperature, humidity) {
    // Baseline environmental conditions
    const baselineTemp = 27.5; // Average of 27-28°C
    const baselineHumidity = 73.8; // Annual average
    
    const tempDeviation = temperature - baselineTemp;
    const humidityDeviation = humidity - baselineHumidity;
    
    let tempRisk = 'normal';
    let humidityRisk = 'normal';
    let overallRisk = 'normal';
    
    // Temperature analysis
    if (temperature > baselineTemp + 5) {
        tempRisk = 'high';
    } else if (temperature > baselineTemp + 2) {
        tempRisk = 'medium';
    } else if (temperature < baselineTemp - 5) {
        tempRisk = 'low'; // Cooler than baseline
    }
    
    // Humidity analysis
    if (humidity > baselineHumidity + 15) {
        humidityRisk = 'high';
    } else if (humidity > baselineHumidity + 8) {
        humidityRisk = 'medium';
    } else if (humidity < baselineHumidity - 15) {
        humidityRisk = 'low'; // Drier than baseline
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
        recommendation: getEnvironmentalRecommendation(tempRisk, humidityRisk)
    };
}

/**
 * Gets environmental recommendation based on risk levels
 * @param {string} tempRisk - Temperature risk level
 * @param {string} humidityRisk - Humidity risk level
 * @returns {string} Recommendation
 */
function getEnvironmentalRecommendation(tempRisk, humidityRisk) {
    if (tempRisk === 'high' && humidityRisk === 'high') {
        return 'High temperature and humidity detected. Consider refrigeration or air conditioning to slow spoilage.';
    } else if (tempRisk === 'high') {
        return 'High temperature detected. Store in cooler location or refrigerate if possible.';
    } else if (humidityRisk === 'high') {
        return 'High humidity detected. Use dehumidifier or store in drier location.';
    } else if (tempRisk === 'medium' || humidityRisk === 'medium') {
        return 'Environmental conditions are slightly elevated. Monitor food closely.';
    } else {
        return 'Environmental conditions are within normal range for your location.';
    }
}

module.exports = {
    analyzeGasEmissionThresholds,
    getGasEmissionThresholds,
    requiresImmediateAttention,
    getAlertLevel,
    getRecommendedAction,
    analyzeEnvironmentalConditions,
    getEnvironmentalRecommendation
};
