const { query } = require('../config/db');

// Get dashboard summary statistics
const getDashboardSummary = async () => {
    try {
        const result = await query('SELECT * FROM get_dashboard_summary()');
        return result.rows[0];
    } catch (error) {
        console.error('Dashboard summary error:', error);
        throw error;
    }
};

// Get event frequency analysis
const getEventFrequency = async (period = 'day') => {
    try {
        const groupByClause = period === 'hour' ? 'hour' : period === 'week' ? 'week' : 'day';

        const result = await query(
            `SELECT event_type, ${groupByClause}, event_count
       FROM v_event_frequency
       WHERE ${groupByClause} >= CURRENT_TIMESTAMP - INTERVAL '7 days'
       ORDER BY ${groupByClause} DESC`
        );

        return result.rows;
    } catch (error) {
        console.error('Event frequency error:', error);
        throw error;
    }
};

// Get peak activity times
const getPeakActivity = async () => {
    try {
        const result = await query('SELECT * FROM v_peak_activity LIMIT 24');
        return result.rows;
    } catch (error) {
        console.error('Peak activity error:', error);
        throw error;
    }
};

// Get user behavior summaries
const getUserBehavior = async (limit = 10) => {
    try {
        const result = await query(
            `SELECT * FROM v_user_behavior 
       ORDER BY total_events DESC 
       LIMIT $1`,
            [limit]
        );

        return result.rows;
    } catch (error) {
        console.error('User behavior error:', error);
        throw error;
    }
};

// Get anomaly detection results
const getAnomalies = async (threshold = 2.0) => {
    try {
        const result = await query(
            `SELECT * FROM detect_anomalies($1)
       WHERE is_anomaly = true
       ORDER BY z_score DESC
       LIMIT 50`,
            [threshold]
        );

        return result.rows;
    } catch (error) {
        console.error('Anomaly detection error:', error);
        throw error;
    }
};

// Get risk scores
const getRiskScores = async (riskLevel = null) => {
    try {
        let queryText = 'SELECT * FROM v_risk_scores';
        const params = [];

        if (riskLevel) {
            queryText += ' WHERE risk_level = $1';
            params.push(riskLevel);
        }

        queryText += ' ORDER BY risk_score DESC LIMIT 100';

        const result = await query(queryText, params);
        return result.rows;
    } catch (error) {
        console.error('Risk scores error:', error);
        throw error;
    }
};

// Get user analytics
const getUserAnalytics = async (userId) => {
    try {
        const result = await query('SELECT * FROM get_user_analytics($1)', [userId]);
        return result.rows[0];
    } catch (error) {
        console.error('User analytics error:', error);
        throw error;
    }
};

// Get event timeline (for charts)
const getEventTimeline = async (startDate, endDate) => {
    try {
        const result = await query(
            'SELECT * FROM get_event_timeline($1, $2)',
            [startDate, endDate]
        );

        return result.rows;
    } catch (error) {
        console.error('Event timeline error:', error);
        throw error;
    }
};

module.exports = {
    getDashboardSummary,
    getEventFrequency,
    getPeakActivity,
    getUserBehavior,
    getAnomalies,
    getRiskScores,
    getUserAnalytics,
    getEventTimeline,
};
