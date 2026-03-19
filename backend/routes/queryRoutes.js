const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { authenticateUser, supabaseUrl, supabaseKey } = require('../middleware/auth');

// ──────────────────────────────────────────────────────────────────────────────
// Centralized Query Registry (Backend - Single Source of Truth)
// ──────────────────────────────────────────────────────────────────────────────
const queryRegistry = {
  total_events: {
    name: 'Total Events Count',
    description: 'Get the total number of events tracked across your sites',
    sql: 'SELECT * FROM v_total_events WHERE site_id = ANY($1)',
  },
  events_by_type: {
    name: 'Events by Type',
    description: 'Count of events grouped by event type',
    sql: 'SELECT * FROM v_events_by_type WHERE site_id = ANY($1)',
  },
  active_users: {
    name: 'Active Users (Last 7 Days)',
    description: 'Users with activity in the past week',
    sql: 'SELECT * FROM v_active_users WHERE site_id = ANY($1)',
  },
  avg_session_duration: {
    name: 'Average Session Duration',
    description: 'Average session duration by user across your sites',
    sql: 'SELECT * FROM v_avg_session_duration WHERE site_id = ANY($1)',
  },
  hourly_distribution: {
    name: 'Hourly Event Distribution',
    description: 'Events grouped by hour of day',
    sql: 'SELECT * FROM v_hourly_distribution WHERE site_id = ANY($1)',
  },
  user_event_summary: {
    name: 'User Event Summary',
    description: 'Comprehensive user activity statistics',
    sql: 'SELECT * FROM v_user_event_summary WHERE user_id = $2',
  },
  anomalies: {
    name: 'Recent Anomalies',
    description: 'Sessions flagged as anomalous (z-score > 2)',
    sql: 'SELECT * FROM v_recent_anomalies WHERE site_id = ANY($1)',
  },
  risk_scores: {
    name: 'Risk Score Distribution',
    description: 'Count of sessions by risk level',
    sql: 'SELECT * FROM v_risk_scores WHERE site_id = ANY($1)',
  },
  peak_activity: {
    name: 'Peak Activity Hours',
    description: 'Busiest hours of the day on your sites',
    sql: 'SELECT * FROM v_peak_activity WHERE site_id = ANY($1)',
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/queries/execute - Secure Execution Layer
// ──────────────────────────────────────────────────────────────────────────────
router.post('/execute', authenticateUser, async (req, res) => {
    try {
        const { query_id } = req.body;
        const user = req.user;
        const token = req.token;

        // Debug log — visible in Render logs
        console.log(`[SQL Playground] execute called: query_id="${query_id}", user=${user?.id}`);
        console.log(`[SQL Playground] available keys: ${Object.keys(queryRegistry).join(', ')}`);

        if (!query_id || !queryRegistry[query_id]) {
            console.error(`[SQL Playground] Query not found: "${query_id}"`);
            return res.status(404).json({
                success: false,
                error: "Query not found",
                received: query_id,
                available: Object.keys(queryRegistry)
            });
        }

        const queryConfig = queryRegistry[query_id];

        // Create a scoped client for this user request
        const userSupabase = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: { Authorization: `Bearer ${token}` }
            }
        });

        // 1. Fetch user's sites
        const { data: sites, error: siteError } = await userSupabase
            .from("sites")
            .select("id")
            .eq("user_id", user.id);

        if (siteError) {
             console.error("Site fetch error:", siteError);
             return res.status(500).json({ success: false, error: "Failed to fetch user sites" });
        }

        const siteIds = sites.map(s => s.id);

        if (siteIds.length === 0) {
             return res.json({ success: true, query: query_id, rows: [], executionMs: 0 });
        }

        const start = Date.now();
        // 2. Execute query securely via the execute_sql RPC
        const { data, error } = await userSupabase.rpc("execute_sql", {
            sql_query: queryConfig.sql,
            site_ids: siteIds,
            user_id: user.id
        });
        const duration = Date.now() - start;

        if (error) {
            console.error("Query execution RPC error:", error);
            
            // Standardize missing view errors
            if (error.message && (error.message.includes("does not exist") || error.message.includes("not found"))) {
                 return res.status(400).json({ success: false, error: "Required analytics view missing" });
            }
            
            res.status(500).json({ success: false, error: "Failed to execute query", message: error.message });
            return;
        }

        return res.json({
            success: true,
            query: query_id,
            rows: data,
            executionMs: duration
        });

    } catch (err) {
        console.error('Execute route error:', err);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

module.exports = router;
