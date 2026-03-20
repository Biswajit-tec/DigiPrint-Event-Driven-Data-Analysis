-- ==============================================================================
-- DATA EXPLORER MIGRATION
-- Execute this entirely inside your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create the secure execution generic function
CREATE OR REPLACE FUNCTION execute_sql(
  sql_query text,
  site_ids uuid[],
  user_id uuid
)
RETURNS SETOF json AS $$
BEGIN
  -- Execute the raw SQL string safely injecting site_ids and user_id dynamically
  RETURN QUERY EXECUTE sql_query USING site_ids, user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Ensure all required views exist. 
-- These views MUST contain a 'site_id' or 'user_id' column to be properly 
-- filtered by the Data Explorer registry.

CREATE OR REPLACE VIEW v_total_events AS
SELECT site_id, count(id) as total_events
FROM events
GROUP BY site_id;

CREATE OR REPLACE VIEW v_events_by_type AS
SELECT site_id, event_type, count(id) as event_count
FROM events
GROUP BY site_id, event_type
ORDER BY event_count DESC;

CREATE OR REPLACE VIEW v_active_users AS
SELECT site_id, count(DISTINCT session_id) as active_sessions 
-- Typically active users count requires user_id, but session_id proxy works
FROM events 
WHERE event_timestamp > now() - interval '7 days'
GROUP BY site_id;

CREATE OR REPLACE VIEW v_avg_session_duration AS
SELECT site_id, ROUND(AVG(duration_seconds)) as avg_duration_seconds
FROM sessions
WHERE duration_seconds IS NOT NULL
GROUP BY site_id;

CREATE OR REPLACE VIEW v_hourly_distribution AS
SELECT site_id, extract(hour from event_timestamp) as hour, count(id) as event_count
FROM events
GROUP BY site_id, hour
ORDER BY hour ASC;

CREATE OR REPLACE VIEW v_user_event_summary AS
-- Requires joining sites and sessions to get user_id if tying directly to users
SELECT s.user_id, count(e.id) as total_events, count(DISTINCT e.session_id) as total_sessions
FROM events e
JOIN sessions sess ON e.session_id = sess.id
JOIN sites s ON sess.site_id = s.id
GROUP BY s.user_id;

CREATE OR REPLACE VIEW v_recent_anomalies AS
SELECT id as session_id, site_id, start_time, duration_seconds, 
       (duration_seconds / NULLIF(AVG(duration_seconds) OVER (PARTITION BY site_id), 0)) as anomaly_score
FROM sessions
WHERE duration_seconds IS NOT NULL
ORDER BY anomaly_score DESC;

CREATE OR REPLACE VIEW v_risk_scores AS
SELECT site_id, duration_seconds as session_duration,
       CASE 
         WHEN duration_seconds > 3600 THEN 'High Risk'
         WHEN duration_seconds > 1800 THEN 'Medium Risk'
         ELSE 'Low Risk'
       END as risk_level
FROM sessions
WHERE duration_seconds IS NOT NULL;

CREATE OR REPLACE VIEW v_peak_activity AS
SELECT site_id, extract(hour from event_timestamp) as peak_hour, count(id) as event_count
FROM events
GROUP BY site_id, peak_hour
ORDER BY event_count DESC;

-- Advanced Analytics Views

CREATE OR REPLACE VIEW v_top_events AS
SELECT
  site_id,
  event_type,
  COUNT(*) AS total
FROM events
GROUP BY site_id, event_type
ORDER BY total DESC;

CREATE OR REPLACE VIEW v_conversion_funnel AS
SELECT
  site_id,
  COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS page_views,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) AS clicks,
  COUNT(CASE WHEN event_type = 'form_submit' THEN 1 END) AS conversions
FROM events
GROUP BY site_id;

CREATE OR REPLACE VIEW v_session_distribution AS
SELECT
  site_id,
  CASE
    WHEN duration_seconds < 30 THEN '0-30s'
    WHEN duration_seconds < 60 THEN '30-60s'
    WHEN duration_seconds < 300 THEN '1-5min'
    ELSE '5min+'
  END AS duration_bucket,
  COUNT(*) AS sessions
FROM sessions
WHERE duration_seconds IS NOT NULL
GROUP BY site_id,
  CASE
    WHEN duration_seconds < 30 THEN '0-30s'
    WHEN duration_seconds < 60 THEN '30-60s'
    WHEN duration_seconds < 300 THEN '1-5min'
    ELSE '5min+'
  END;

CREATE OR REPLACE VIEW v_device_browser AS
SELECT
  site_id,
  COALESCE(metadata->>'browser', 'Unknown') AS browser,
  COUNT(DISTINCT session_id) AS users
FROM events
GROUP BY site_id, COALESCE(metadata->>'browser', 'Unknown');

CREATE OR REPLACE VIEW v_top_pages AS
SELECT
  site_id,
  COALESCE(metadata->>'page', 'Unknown') AS page,
  COUNT(*) AS visits
FROM events
WHERE event_type = 'page_view'
GROUP BY site_id, COALESCE(metadata->>'page', 'Unknown')
ORDER BY visits DESC;
