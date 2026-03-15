-- DigiPrint Event-Driven Digital Footprint Platform
-- PostgreSQL Database Schema (3NF Compliant)

-- ======================
-- USERS TABLE
-- ======================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consent_status BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP
);

-- ======================
-- SESSIONS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    device_info JSONB,
    ip_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- EVENTS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('login', 'click', 'search', 'api_call', 'session_start', 'session_end', 'page_view')),
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    ip_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- COMMENTS
-- ======================
COMMENT ON TABLE users IS 'Stores user information with privacy consent tracking';
COMMENT ON TABLE sessions IS 'Tracks user sessions with device and timing information';
COMMENT ON TABLE events IS 'Time-series event storage for digital footprint tracking';

COMMENT ON COLUMN events.metadata IS 'Flexible JSON storage for event-specific data. Examples: {"action": "button_click", "element_id": "submit-btn"} or {"query": "search term", "results_count": 42}';
COMMENT ON COLUMN sessions.device_info IS 'JSON storage for device metadata: {"browser": "Chrome", "os": "Windows", "screen": "1920x1080"}';
