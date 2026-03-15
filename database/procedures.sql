-- DigiPrint Stored Procedures
-- Reusable analytical functions

-- ======================
-- GET USER ANALYTICS
-- ======================
CREATE OR REPLACE FUNCTION get_user_analytics(p_user_id INTEGER)
RETURNS TABLE (
    total_sessions BIGINT,
    total_events BIGINT,
    avg_session_duration NUMERIC,
    most_common_event_type VARCHAR,
    first_seen TIMESTAMP,
    last_seen TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT s.id)::BIGINT as total_sessions,
        COUNT(e.id)::BIGINT as total_events,
        ROUND(AVG(s.duration_seconds), 2) as avg_session_duration,
        MODE() WITHIN GROUP (ORDER BY e.event_type) as most_common_event_type,
        MIN(s.start_time) as first_seen,
        MAX(s.end_time) as last_seen
    FROM sessions s
    LEFT JOIN events e ON s.id = e.session_id
    WHERE s.user_id = p_user_id
    GROUP BY s.user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_analytics IS 'Returns comprehensive analytics for a specific user including session and event statistics';

-- ======================
-- GET EVENT TIMELINE
-- ======================
CREATE OR REPLACE FUNCTION get_event_timeline(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP
)
RETURNS TABLE (
    event_timestamp TIMESTAMP,
    event_type VARCHAR,
    event_count BIGINT,
    unique_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('minute', e.event_timestamp) as event_timestamp,
        e.event_type,
        COUNT(*)::BIGINT as event_count,
        COUNT(DISTINCT e.session_id)::BIGINT as unique_sessions
    FROM events e
    WHERE e.event_timestamp BETWEEN p_start_date AND p_end_date
    GROUP BY DATE_TRUNC('minute', e.event_timestamp), e.event_type
    ORDER BY event_timestamp DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_event_timeline IS 'Returns time-series event data within a date range, aggregated by minute';

-- ======================
-- DETECT ANOMALIES
-- ======================
CREATE OR REPLACE FUNCTION detect_anomalies(p_threshold NUMERIC DEFAULT 2.0)
RETURNS TABLE (
    session_id UUID,
    event_count BIGINT,
    z_score NUMERIC,
    is_anomaly BOOLEAN,
    severity VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH event_stats AS (
        SELECT 
            e.session_id,
            COUNT(*)::BIGINT as event_count
        FROM events e
        GROUP BY e.session_id
    ),
    stats_summary AS (
        SELECT 
            AVG(event_count) as mean_events,
            STDDEV(event_count) as stddev_events
        FROM event_stats
    )
    SELECT 
        es.session_id,
        es.event_count,
        CASE 
            WHEN ss.stddev_events > 0 THEN 
                ROUND((es.event_count - ss.mean_events) / ss.stddev_events, 2)
            ELSE 0
        END as z_score,
        CASE 
            WHEN ss.stddev_events > 0 AND 
                 ABS((es.event_count - ss.mean_events) / ss.stddev_events) > p_threshold 
            THEN true
            ELSE false
        END as is_anomaly,
        CASE 
            WHEN ss.stddev_events > 0 THEN
                CASE 
                    WHEN ABS((es.event_count - ss.mean_events) / ss.stddev_events) > 3 THEN 'critical'
                    WHEN ABS((es.event_count - ss.mean_events) / ss.stddev_events) > p_threshold THEN 'high'
                    ELSE 'normal'
                END
            ELSE 'normal'
        END as severity
    FROM event_stats es, stats_summary ss
    ORDER BY ABS((es.event_count - COALESCE(ss.mean_events, 0)) / NULLIF(ss.stddev_events, 0)) DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION detect_anomalies IS 'Detects anomalous sessions using configurable z-score threshold (default: 2.0)';

-- ======================
-- GET DASHBOARD SUMMARY
-- ======================
CREATE OR REPLACE FUNCTION get_dashboard_summary()
RETURNS TABLE (
    total_users BIGINT,
    total_sessions BIGINT,
    total_events BIGINT,
    active_sessions BIGINT,
    avg_events_per_session NUMERIC,
    most_active_hour INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::BIGINT FROM users) as total_users,
        (SELECT COUNT(*)::BIGINT FROM sessions) as total_sessions,
        (SELECT COUNT(*)::BIGINT FROM events) as total_events,
        (SELECT COUNT(*)::BIGINT FROM sessions WHERE end_time IS NULL) as active_sessions,
        (SELECT ROUND(AVG(event_count), 2) 
         FROM (SELECT COUNT(*) as event_count FROM events GROUP BY session_id) sub) as avg_events_per_session,
        (SELECT EXTRACT(HOUR FROM event_timestamp)::INTEGER as hour 
         FROM events 
         GROUP BY hour 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as most_active_hour;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_dashboard_summary IS 'Returns high-level dashboard metrics for quick overview';
