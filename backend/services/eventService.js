const { query } = require('../config/db');

// Event ingestion service
const ingestEvent = async (eventData, io) => {
    const { session_id, event_type, metadata, ip_hash } = eventData;

    try {
        const result = await query(
            `INSERT INTO events (session_id, event_type, metadata, ip_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [session_id, event_type, JSON.stringify(metadata || {}), ip_hash]
        );

        const newEvent = result.rows[0];

        // Broadcast event to connected clients via Socket.IO
        if (io) {
            io.to('events').emit('new_event', {
                id: newEvent.id,
                event_type: newEvent.event_type,
                event_timestamp: newEvent.event_timestamp,
                metadata: newEvent.metadata,
            });
        }

        return newEvent;
    } catch (error) {
        console.error('Event ingestion error:', error);
        throw error;
    }
};

// Validate event type
const validEventTypes = ['login', 'click', 'search', 'api_call', 'session_start', 'session_end', 'page_view'];

const validateEventType = (eventType) => {
    return validEventTypes.includes(eventType);
};

// Create session
const createSession = async (userId, deviceInfo, ipHash) => {
    try {
        const result = await query(
            `INSERT INTO sessions (user_id, device_info, ip_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [userId, JSON.stringify(deviceInfo || {}), ipHash]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Session creation error:', error);
        throw error;
    }
};

// End session
const endSession = async (sessionId) => {
    try {
        const result = await query(
            `UPDATE sessions 
       SET end_time = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
            [sessionId]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Session end error:', error);
        throw error;
    }
};

// Get recent events
const getRecentEvents = async (limit = 50) => {
    try {
        const result = await query(
            `SELECT e.*, s.user_id
       FROM events e
       JOIN sessions s ON e.session_id = s.id
       ORDER BY e.event_timestamp DESC
       LIMIT $1`,
            [limit]
        );

        return result.rows;
    } catch (error) {
        console.error('Get recent events error:', error);
        throw error;
    }
};

// Get events for replay (time range)
const getEventsForReplay = async (startDate, endDate) => {
    try {
        const result = await query(
            `SELECT e.*, s.user_id
       FROM events e
       JOIN sessions s ON e.session_id = s.id
       WHERE e.event_timestamp BETWEEN $1 AND $2
       ORDER BY e.event_timestamp ASC`,
            [startDate, endDate]
        );

        return result.rows;
    } catch (error) {
        console.error('Get events for replay error:', error);
        throw error;
    }
};

module.exports = {
    ingestEvent,
    validateEventType,
    createSession,
    endSession,
    getRecentEvents,
    getEventsForReplay,
};
