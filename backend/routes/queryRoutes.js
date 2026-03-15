const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Predefined safe queries for SQL playground
const predefinedQueries = [
    {
        id: 1,
        name: 'Total Events by Type',
        description: 'Count of events grouped by event type',
        sql: 'SELECT event_type, COUNT(*) as count FROM events GROUP BY event_type ORDER BY count DESC',
    },
    {
        id: 2,
        name: 'Recent Events (Last 24 hours)',
        description: 'All events from the last 24 hours',
        sql: "SELECT * FROM events WHERE timestamp >= NOW() - INTERVAL '24 hours' ORDER BY timestamp DESC LIMIT 100",
    },
    {
        id: 3,
        name: 'User Session Summary',
        description: 'Session statistics per user',
        sql: 'SELECT * FROM v_user_behavior LIMIT 10',
    },
    {
        id: 4,
        name: 'Peak Activity Hours',
        description: 'Busiest hours of the day',
        sql: 'SELECT * FROM v_peak_activity ORDER BY event_count DESC LIMIT 24',
    },
    {
        id: 5,
        name: 'Anomaly Detection',
        description: 'Sessions with anomalous activity',
        sql: 'SELECT * FROM v_anomalies WHERE is_anomaly = true LIMIT 20',
    },
    {
        id: 6,
        name: 'High Risk Sessions',
        description: 'Sessions with high risk scores',
        sql: "SELECT * FROM v_risk_scores WHERE risk_level = 'high' LIMIT 20",
    },
    {
        id: 7,
        name: 'Event Timeline (Last 7 Days)',
        description: 'Daily event counts for the past week',
        sql: "SELECT DATE(timestamp) as date, COUNT(*) as events FROM events WHERE timestamp >= NOW() - INTERVAL '7 days' GROUP BY DATE(timestamp) ORDER BY date DESC",
    },
    {
        id: 8,
        name: 'Session Duration Analysis',
        description: 'Average session duration per user',
        sql: 'SELECT user_id, AVG(duration_seconds) as avg_duration, COUNT(*) as session_count FROM sessions WHERE duration_seconds IS NOT NULL GROUP BY user_id ORDER BY avg_duration DESC LIMIT 10',
    },
];

// Whitelist of allowed SQL keywords (read-only operations)
const allowedKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'AS', 'AND', 'OR'];
const disallowedKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'GRANT', 'REVOKE'];

// Validate SQL query for safety
const validateQuery = (sql) => {
    const upperSQL = sql.toUpperCase().trim();

    // Check for disallowed keywords
    for (const keyword of disallowedKeywords) {
        if (upperSQL.includes(keyword)) {
            return { valid: false, error: `Forbidden keyword: ${keyword}` };
        }
    }

    // Must start with SELECT
    if (!upperSQL.startsWith('SELECT')) {
        return { valid: false, error: 'Only SELECT queries are allowed' };
    }

    return { valid: true };
};

// GET /api/queries/predefined - List all predefined queries
router.get('/predefined', (req, res) => {
    res.json({
        success: true,
        queries: predefinedQueries.map(q => ({
            id: q.id,
            name: q.name,
            description: q.description,
        })),
        count: predefinedQueries.length,
    });
});

// GET /api/queries/predefined/:id - Get a specific predefined query with SQL
router.get('/predefined/:id', (req, res) => {
    const queryId = parseInt(req.params.id);
    const predefined = predefinedQueries.find(q => q.id === queryId);

    if (!predefined) {
        return res.status(404).json({ error: 'Query not found' });
    }

    res.json({ success: true, query: predefined });
});

// POST /api/queries/execute - Execute a predefined query (by ID)
router.post('/execute', async (req, res) => {
    try {
        const { query_id } = req.body;

        if (!query_id) {
            return res.status(400).json({ error: 'query_id is required' });
        }

        const predefined = predefinedQueries.find(q => q.id === parseInt(query_id));

        if (!predefined) {
            return res.status(404).json({ error: 'Query not found' });
        }

        // Execute the query with a timeout
        const result = await query(predefined.sql);

        res.json({
            success: true,
            query: {
                id: predefined.id,
                name: predefined.name,
                sql: predefined.sql,
            },
            results: result.rows,
            row_count: result.rowCount,
        });
    } catch (error) {
        console.error('Query execution error:', error);
        res.status(500).json({ error: 'Failed to execute query', message: error.message });
    }
});

module.exports = router;
