const express = require('express');
const router = express.Router();
const {
    ingestEvent,
    validateEventType,
    createSession,
    endSession,
    getRecentEvents,
    getEventsForReplay,
} = require('../services/eventService');

// POST /api/events - Ingest new event
router.post('/', async (req, res) => {
    try {
        const { session_id, event_type, metadata, ip_hash } = req.body;

        // Validation
        if (!session_id || !event_type) {
            return res.status(400).json({ error: 'session_id and event_type are required' });
        }

        if (!validateEventType(event_type)) {
            return res.status(400).json({ error: 'Invalid event_type' });
        }

        const io = req.app.get('io');
        const event = await ingestEvent({ session_id, event_type, metadata, ip_hash }, io);

        res.status(201).json({ success: true, event });
    } catch (error) {
        console.error('Event ingestion error:', error);
        res.status(500).json({ error: 'Failed to ingest event' });
    }
});

// POST /api/events/session - Create new session
router.post('/session', async (req, res) => {
    try {
        const { user_id, device_info, ip_hash } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const session = await createSession(user_id, device_info, ip_hash);
        res.status(201).json({ success: true, session });
    } catch (error) {
        console.error('Session creation error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// PUT /api/events/session/:id/end - End session
router.put('/session/:id/end', async (req, res) => {
    try {
        const { id } = req.params;
        const session = await endSession(id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({ success: true, session });
    } catch (error) {
        console.error('Session end error:', error);
        res.status(500).json({ error: 'Failed to end session' });
    }
});

// GET /api/events/stream - Get recent events (for live stream)
router.get('/stream', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const events = await getRecentEvents(limit);

        res.json({ success: true, events, count: events.length });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// GET /api/events/replay - Get events for replay
router.get('/replay', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'start_date and end_date are required' });
        }

        const events = await getEventsForReplay(start_date, end_date);
        res.json({ success: true, events, count: events.length });
    } catch (error) {
        console.error('Replay events error:', error);
        res.status(500).json({ error: 'Failed to fetch replay events' });
    }
});

module.exports = router;
