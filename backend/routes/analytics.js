const express = require('express');
const router = express.Router();
const db = require('../../db/db'); // Adjust path to your db connection

// --- MOCK DATA GENERATION ---
// In a real application, you would generate this from your database.
// For now, we'll create some mock data to simulate chart data.

// Generates an array of daily values for a month.
const generateMonthlyData = (days, maxVal) => {
    return Array.from({ length: days }, () => Math.floor(Math.random() * maxVal));
};

// --- API ENDPOINTS ---

/**
 * @route   GET /api/analytics/summary
 * @desc    Get the summary data for the AI Analyzer box
 * @access  Public
 */
router.get('/summary', (req, res) => {
    // This is mock data. In a real scenario, you'd calculate this.
    const summaryData = {
        sensorActivityChange: 30,
        foodRiskChange: -50, // Negative for decrease
        sensorActivityText: 'Indicates increased scanning and possibly user engagement.',
        foodRiskText: 'Suggests improvement in food handling or detection accuracy.',
    };
    res.json({ success: true, data: summaryData });
});


/**
 * @route   GET /api/analytics/sensor-activity
 * @desc    Get data for the sensor activity chart
 * @access  Public
 */
router.get('/sensor-activity', (req, res) => {
    // Mock data for the chart. 30 days of activity.
    const chartData = {
        score: 100,
        change: 10,
        dataPoints: generateMonthlyData(30, 150), // 30 days, max 150 activities/day
    };

    // Find the first and last month with data
    let firstMonth = null;
    let lastMonth = null;
    const monthToValue = {};
    for (let i = 0; i < chartData.dataPoints.length; i++) {
        const date = new Date(2025, 0, 1 + i).toISOString().split('T')[0];
        const monthIdx = parseInt(date.split('-')[1]) - 1;
        monthToValue[monthIdx] = chartData.dataPoints[i];
        if (firstMonth === null || monthIdx < firstMonth) firstMonth = monthIdx;
        if (lastMonth === null || monthIdx > lastMonth) lastMonth = monthIdx;
    }
    firstMonth ??= 0;
    lastMonth ??= 11;

    const spots = [];
    for (let m = 0; m < 12; m++) {
        let y = 0;
        if (m >= firstMonth && m <= lastMonth) {
            y = monthToValue[m] ?? 0;
        }
        spots.push({ x: m, y });
    }

    res.json({ success: true, data: { spots } });
});


/**
 * @route   GET /api/analytics/food-risk
 * @desc    Get data for the food risk chart
 * @access  Public
 */
router.get('/food-risk', (req, res) => {
    // Mock data for the chart. 30 days of risk levels.
    const chartData = {
        score: 100,
        change: -50,
        dataPoints: generateMonthlyData(30, 50), // 30 days, max risk level 50
    };

    // Find the first and last month with data
    let firstMonth = null;
    let lastMonth = null;
    const monthToValue = {};
    for (let i = 0; i < chartData.dataPoints.length; i++) {
        const date = new Date(2025, 0, 1 + i).toISOString().split('T')[0];
        const monthIdx = parseInt(date.split('-')[1]) - 1;
        monthToValue[monthIdx] = chartData.dataPoints[i];
        if (firstMonth === null || monthIdx < firstMonth) firstMonth = monthIdx;
        if (lastMonth === null || monthIdx > lastMonth) lastMonth = monthIdx;
    }
    firstMonth ??= 0;
    lastMonth ??= 11;

    const spots = [];
    for (let m = 0; m < 12; m++) {
        let y = 0;
        if (m >= firstMonth && m <= lastMonth) {
            y = monthToValue[m] ?? 0;
        }
        spots.push({ x: m, y });
    }

    res.json({ success: true, data: { spots } });
});


/**
 * @route   GET /api/analytics/recent-detections
 * @desc    Get the most recent food detections
 * @access  Public
 */
router.get('/recent-detections', (req, res) => {
    // In a real application, you would query the 'food_items' table.
    // For now, here is some static mock data.
    const recentDetections = [
        { food: 'Adobo', date: 'Jun 1, 2025', status: 'Good' },
        { food: 'Sinigang', date: 'Jun 3, 2025', status: 'Spoilt' },
        { food: 'Tinola', date: 'Jun 8, 2025', status: 'Good' },
        { food: 'Adobo', date: 'Jun 8, 2025', status: 'Spoilt warning' },
        { food: 'Lechon', date: 'Jun 10, 2025', status: 'Good' },
    ];
    res.json({ success: true, data: recentDetections });
});


module.exports = router;
