-- DigiPrint Analytical Views
-- Pre-computed views for dashboard and analytics

-- ======================
-- EVENT FREQUENCY ANALYSIS
-- ======================
CREATE OR REPLACE VIEW v_event_frequency AS
SELECT 
    event_type,
    DATE_TRUNC('hour', event_timestamp) as hour,
    DATE_TRUNC('day', event_timestamp) as day,
    DATE_TRUNC('week', event_timestamp) as week,
    COUNT(*) as event_count
FROM events
GROUP BY event_type, hour, day, week
ORDER BY day DESC, hour DESC;

COMMENT ON VIEW v_event_frequency IS 'Event counts aggregated by type and time periods (hour/day/week)';

-- ======================
-- PEAK ACTIVITY TIMES
-- ======================
CREATE OR REPLACE VIEW v_peak_activity AS
SELECT 
    EXTRACT(HOUR FROM event_timestamp) as hour_of_day,
    EXTRACT(DOW FROM event_timestamp) as day_of_week,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM events
GROUP BY hour_of_day, day_of_week
ORDER BY event_count DESC;

COMMENT ON VIEW v_peak_activity IS 'Identifies peak activity hours and days based on event volume';

-- ======================
-- USER BEHAVIOR SUMMARY
-- ======================
CREATE OR REPLACE VIEW v_user_behavior AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(e.id) as total_events,
    AVG(s.duration_seconds) as avg_session_duration,
    MAX(s.end_time) as last_activity,
    ARRAY_AGG(DISTINCT e.event_type) as event_types_used
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id
LEFT JOIN events e ON s.id = e.session_id
GROUP BY u.id, u.username
ORDER BY total_events DESC;

COMMENT ON VIEW v_user_behavior IS 'User-level statistics including session counts, events, and activity patterns';

-- ======================
-- ANOMALY DETECTION (Z-SCORE)
-- ======================
CREATE OR REPLACE VIEW v_anomalies AS
WITH event_stats AS (
    SELECT 
        session_id,
        COUNT(*) as event_count,
        EXTRACT(EPOCH FROM (MAX(event_timestamp) - MIN(event_timestamp))) as duration_seconds
    FROM events
    GROUP BY session_id
),
stats_summary AS (
    SELECT 
        AVG(event_count) as mean_events,
        STDDEV(event_count) as stddev_events,
        AVG(duration_seconds) as mean_duration,
        STDDEV(duration_seconds) as stddev_duration
    FROM event_stats
)
SELECT 
    es.session_id,
    es.event_count,
    es.duration_seconds,
    -- Z-score for event count
    CASE 
        WHEN ss.stddev_events > 0 THEN 
            (es.event_count - ss.mean_events) / ss.stddev_events
        ELSE 0
    END as z_score_events,
    -- Anomaly flag (Z-score > 2 or < -2)
    CASE 
        WHEN ss.stddev_events > 0 AND 
             ABS((es.event_count - ss.mean_events) / ss.stddev_events) > 2 
        THEN true
        ELSE false
    END as is_anomaly
FROM event_stats es, stats_summary ss
WHERE es.event_count > 0
ORDER BY ABS((es.event_count - COALESCE(ss.mean_events, 0)) / NULLIF(ss.stddev_events, 0)) DESC NULLS LAST;

COMMENT ON VIEW v_anomalies IS 'Statistical anomaly detection using z-score method (threshold: |z| > 2)';

-- ======================
-- RISK SCORING
-- ======================
CREATE OR REPLACE VIEW v_risk_scores AS
WITH session_metrics AS (
    SELECT 
        s.id as session_id,
        s.user_id,
        COUNT(e.id) as event_count,
        COUNT(DISTINCT e.event_type) as unique_event_types,
        s.duration_seconds,
        CASE 
            WHEN COUNT(e.id) > 100 THEN 1 
            ELSE 0 
        END as high_volume_flag,
        CASE 
            WHEN s.duration_seconds < 10 THEN 1 
            ELSE 0 
        END as short_session_flag
    FROM sessions s
    LEFT JOIN events e ON s.id = e.session_id
    GROUP BY s.id, s.user_id, s.duration_seconds
)
SELECT 
    session_id,
    user_id,
    event_count,
    duration_seconds,
    (high_volume_flag + short_session_flag + 
     CASE WHEN unique_event_types = 1 THEN 1 ELSE 0 END) as risk_score,
    CASE 
        WHEN (high_volume_flag + short_session_flag) >= 2 THEN 'high'
        WHEN (high_volume_flag + short_session_flag) = 1 THEN 'medium'
        ELSE 'low'
    END as risk_level
FROM session_metrics
ORDER BY risk_score DESC;

COMMENT ON VIEW v_risk_scores IS 'Risk scoring based on volume, duration, and diversity of events (low/medium/high)';
