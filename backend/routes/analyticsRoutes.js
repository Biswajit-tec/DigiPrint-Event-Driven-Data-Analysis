const express = require('express');
const router = express.Router();
const {
    getDashboardSummary,
    getEventFrequency,
    getPeakActivity,
    getUserBehavior,
    getAnomalies,
    getRiskScores,
    getUserAnalytics,
    getEventTimeline,
} = require('../services/analyticsService');

// GET /api/analytics/dashboard - Dashboard summary statistics
router.get('/dashboard', async (req, res) => {
    try {
        const summary = await getDashboardSummary();
        res.json({ success: true, data: summary });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard summary' });
    }
});

// GET /api/analytics/frequency - Event frequency analysis
router.get('/frequency', async (req, res) => {
    try {
        const period = req.query.period || 'day'; // hour, day, week
        const data = await getEventFrequency(period);

        res.json({ success: true, data, period });
    } catch (error) {
        console.error('Event frequency error:', error);
        res.status(500).json({ error: 'Failed to fetch event frequency' });
    }
});

// GET /api/analytics/peak-times - Peak activity times
router.get('/peak-times', async (req, res) => {
    try {
        const data = await getPeakActivity();
        res.json({ success: true, data });
    } catch (error) {
        console.error('Peak activity error:', error);
        res.status(500).json({ error: 'Failed to fetch peak activity times' });
    }
});

// GET /api/analytics/user-behavior - User behavior summaries
router.get('/user-behavior', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await getUserBehavior(limit);

        res.json({ success: true, data, count: data.length });
    } catch (error) {
        console.error('User behavior error:', error);
        res.status(500).json({ error: 'Failed to fetch user behavior' });
    }
});

// GET /api/analytics/anomalies - Anomaly detection results
router.get('/anomalies', async (req, res) => {
    try {
        const threshold = parseFloat(req.query.threshold) || 2.0;
        const data = await getAnomalies(threshold);

        res.json({ success: true, data, threshold, count: data.length });
    } catch (error) {
        console.error('Anomaly detection error:', error);
        res.status(500).json({ error: 'Failed to fetch anomalies' });
    }
});

// GET /api/analytics/risk-scores - Risk scoring
router.get('/risk-scores', async (req, res) => {
    try {
        const riskLevel = req.query.risk_level; // low, medium, high
        const data = await getRiskScores(riskLevel);

        res.json({ success: true, data, filter: riskLevel || 'all', count: data.length });
    } catch (error) {
        console.error('Risk scores error:', error);
        res.status(500).json({ error: 'Failed to fetch risk scores' });
    }
});

// GET /api/analytics/user/:id - User-specific analytics
router.get('/user/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const data = await getUserAnalytics(userId);

        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('User analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch user analytics' });
    }
});

// GET /api/analytics/timeline - Event timeline for charts
router.get('/timeline', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'start_date and end_date are required' });
        }

        const data = await getEventTimeline(start_date, end_date);
        res.json({ success: true, data, count: data.length });
    } catch (error) {
        console.error('Event timeline error:', error);
        res.status(500).json({ error: 'Failed to fetch event timeline' });
    }
});

module.exports = router;
