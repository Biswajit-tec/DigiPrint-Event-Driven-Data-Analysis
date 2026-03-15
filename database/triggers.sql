-- DigiPrint Database Triggers
-- Auto-update session metadata and event processing

-- ======================
-- AUTO-UPDATE SESSION END TIME
-- ======================
CREATE OR REPLACE FUNCTION update_session_end_time()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the session's end_time whenever a new event is added
    UPDATE sessions
    SET end_time = NEW.event_timestamp
    WHERE id = NEW.session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_session_end_time
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION update_session_end_time();

-- ======================
-- AUTO-CALCULATE SESSION DURATION
-- ======================
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate duration in seconds when end_time is set
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_seconds := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))::INTEGER;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_session_duration
BEFORE UPDATE ON sessions
FOR EACH ROW
WHEN (NEW.end_time IS DISTINCT FROM OLD.end_time)
EXECUTE FUNCTION calculate_session_duration();

-- ======================
-- EVENT VALIDATION TRIGGER
-- ======================
CREATE OR REPLACE FUNCTION validate_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure metadata is valid JSON (additional validation can be added)
    IF NEW.metadata IS NOT NULL AND NOT (NEW.metadata::text != 'null') THEN
        RAISE EXCEPTION 'Invalid metadata format';
    END IF;
    
    -- Ensure event_timestamp is not in the future
    IF NEW.event_timestamp > CURRENT_TIMESTAMP + INTERVAL '5 seconds' THEN
        RAISE EXCEPTION 'Event timestamp cannot be in the future';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_event
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION validate_event();

-- ======================
-- UPDATE USER LAST ACTIVE
-- ======================
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's last_active timestamp when new session starts
    UPDATE users
    SET last_active = NEW.start_time
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_last_active
AFTER INSERT ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_user_last_active();
