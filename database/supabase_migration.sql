-- ============================================
-- DigiPrint Supabase Migration
-- Adds: sites table, site_id FK, views, indexes
-- ============================================

-- ======================
-- SITES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS sites (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(100) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE sites IS 'Tracked websites for multi-site monitoring';

-- ======================
-- ADD site_id TO sessions
-- ======================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'sessions' AND column_name = 'site_id'
    ) THEN
        ALTER TABLE sessions ADD COLUMN site_id INTEGER REFERENCES sites(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ======================
-- ADD site_id TO events
-- ======================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'events' AND column_name = 'site_id'
    ) THEN
        ALTER TABLE events ADD COLUMN site_id INTEGER REFERENCES sites(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ======================
-- PERFORMANCE INDEXES
-- ======================
CREATE INDEX IF NOT EXISTS idx_events_site_id
ON events(site_id);

CREATE INDEX IF NOT EXISTS idx_events_timestamp
ON events(event_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_site_id
ON sessions(site_id);

-- ======================
-- VIEW: v_live_events
-- ======================
CREATE OR REPLACE VIEW v_live_events AS
SELECT
    e.id AS event_id,
    s.site_name,
    s.domain,
    e.event_type,
    e.event_timestamp,
    e.metadata,
    se.device_info,
    se.id AS session_id
FROM events e
JOIN sessions se ON e.session_id = se.id
JOIN sites s ON e.site_id = s.id
ORDER BY e.event_timestamp DESC;

COMMENT ON VIEW v_live_events IS 'Live event feed joining events, sessions, and sites. Frontend applies LIMIT.';

-- ======================
-- VIEW: v_site_analytics
-- ======================
CREATE OR REPLACE VIEW v_site_analytics AS
SELECT
    s.site_name,
    s.domain,
    COUNT(DISTINCT e.id) AS total_events,
    COUNT(DISTINCT se.id) AS total_sessions
FROM sites s
LEFT JOIN sessions se ON s.id = se.site_id
LEFT JOIN events e ON s.id = e.site_id
WHERE s.is_active = TRUE
GROUP BY s.id, s.site_name, s.domain
ORDER BY total_events DESC;

COMMENT ON VIEW v_site_analytics IS 'Per-site metrics: total events and sessions';

-- ======================
-- VIEW: v_event_rate
-- ======================
CREATE OR REPLACE VIEW v_event_rate AS
SELECT
    ROUND(
        COUNT(*)::NUMERIC / GREATEST(60, 1), 2
    ) AS events_per_second
FROM events
WHERE event_timestamp >= NOW() - INTERVAL '60 seconds';

COMMENT ON VIEW v_event_rate IS 'Events per second calculated over the last 60 seconds';

-- ======================
-- UPDATE get_dashboard_summary()
-- ======================
CREATE OR REPLACE FUNCTION get_dashboard_summary()
RETURNS TABLE (
    total_sites BIGINT,
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
        (SELECT COUNT(*)::BIGINT FROM sites WHERE is_active = TRUE) AS total_sites,
        (SELECT COUNT(*)::BIGINT FROM users) AS total_users,
        (SELECT COUNT(*)::BIGINT FROM sessions) AS total_sessions,
        (SELECT COUNT(*)::BIGINT FROM events) AS total_events,
        (SELECT COUNT(*)::BIGINT FROM sessions WHERE end_time IS NULL) AS active_sessions,
        (SELECT ROUND(AVG(event_count), 2)
         FROM (SELECT COUNT(*) AS event_count FROM events GROUP BY session_id) sub) AS avg_events_per_session,
        (SELECT EXTRACT(HOUR FROM event_timestamp)::INTEGER AS hour
         FROM events
         GROUP BY hour
         ORDER BY COUNT(*) DESC
         LIMIT 1) AS most_active_hour;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_dashboard_summary IS 'Dashboard summary including total_sites';

-- ======================
-- SEED SAMPLE SITES
-- ======================
INSERT INTO sites (site_name, domain) VALUES
    ('Portfolio', 'portfolio.local'),
    ('Blog', 'blog.local'),
    ('Shop', 'shop.local'),
    ('Docs', 'docs.local')
ON CONFLICT (domain) DO NOTHING;
