-- DigiPrint Performance Indexes
-- Optimized indexes for time-series queries and analytics

-- ======================
-- TIME-SERIES QUERY OPTIMIZATION
-- ======================

-- Primary index on event_timestamp for time-range queries (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_events_timestamp 
ON events USING BTREE (event_timestamp DESC);

COMMENT ON INDEX idx_events_timestamp IS 'B-tree index for time-range queries in event replay and analytics';

-- ======================
-- SESSION ANALYSIS OPTIMIZATION
-- ======================

-- Composite index for session-based queries
CREATE INDEX IF NOT EXISTS idx_events_session_timestamp 
ON events (session_id, event_timestamp DESC);

COMMENT ON INDEX idx_events_session_timestamp IS 'Composite index for efficient session timeline queries';

-- Index on sessions.user_id for user lookup performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id 
ON sessions (user_id);

COMMENT ON INDEX idx_sessions_user_id IS 'Index for fast user-to-session lookups in user analytics';

-- ======================
-- EVENT TYPE FILTERING
-- ======================

-- Index on event_type for filtering dashboards
CREATE INDEX IF NOT EXISTS idx_events_event_type 
ON events (event_type);

COMMENT ON INDEX idx_events_event_type IS 'Index for event type filtering in analytics and live streams';

-- ======================
-- PARTIAL INDEX FOR RECENT EVENTS
-- ======================

-- Partial index on recent events (last 30 days) for dashboard performance
-- NOTE:
-- A partial index on recent events (e.g., last 30 days) was intentionally NOT created.
-- PostgreSQL requires partial index predicates to be IMMUTABLE, and expressions using
-- CURRENT_TIMESTAMP are VOLATILE.
-- Instead, dashboard queries rely on the standard B-tree index on event_timestamp,
-- with time-based filtering applied at query execution.

-- ======================
-- NULL HANDLING FOR ACTIVE SESSIONS
-- ======================

-- Index for finding active sessions (where end_time IS NULL)
CREATE INDEX IF NOT EXISTS idx_sessions_active 
ON sessions (start_time DESC)
WHERE end_time IS NULL;

COMMENT ON INDEX idx_sessions_active IS 'Partial index for quickly identifying active sessions';

-- ======================
-- JSON METADATA INDEXING (OPTIONAL - GIN)
-- ======================

-- GIN index on metadata for JSON queries (optional, use if querying JSON frequently)
-- CREATE INDEX IF NOT EXISTS idx_events_metadata 
-- ON events USING GIN (metadata);

-- COMMENT ON INDEX idx_events_metadata IS 'GIN index for efficient JSON metadata queries (optional)';

-- ======================
-- QUERY PERFORMANCE ANALYSIS
-- ======================

-- Sample EXPLAIN queries to demonstrate index usage:

-- EXPLAIN ANALYZE
-- SELECT * FROM events 
-- WHERE event_timestamp BETWEEN '2026-02-01' AND '2026-02-09'
-- ORDER BY event_timestamp DESC;
-- Expected: Uses idx_events_timestamp

-- EXPLAIN ANALYZE
-- SELECT * FROM events 
-- WHERE session_id = 'some-uuid'
-- ORDER BY event_timestamp;
-- Expected: Uses idx_events_session_timestamp

-- EXPLAIN ANALYZE
-- SELECT * FROM sessions
-- WHERE user_id = 123;
-- Expected: Uses idx_sessions_user_id
