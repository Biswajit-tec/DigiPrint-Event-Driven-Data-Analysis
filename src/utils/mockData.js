/**
 * Mock Data Generator for Demo Mode
 * Privacy-safe synthetic data
 */

const eventTypes = ['login', 'click', 'search', 'api_call', 'session_start', 'session_end', 'page_view'];

const sampleMetadata = {
    login: () => ({ attempt_number: Math.floor(Math.random() * 3) + 1, success: true, auth_method: 'password' }),
    click: () => ({ element_id: `btn-${Math.random().toString(36).substr(2, 9)}`, page_url: '/dashboard' }),
    search: () => ({ query: 'analytics dashboard', results_count: Math.floor(Math.random() * 100) }),
    api_call: () => ({ endpoint: '/api/analytics/dashboard', method: 'GET', status: 200 }),
    session_start: () => ({ device: 'desktop', browser: 'Chrome' }),
    session_end: () => ({ duration: Math.floor(Math.random() * 3600) }),
    page_view: () => ({ page: '/dashboard', referrer: '/' }),
};

// Generate random event
export const generateRandomEvent = () => {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    return {
        id: Math.floor(Math.random() * 1000000),
        event_type: eventType,
        event_timestamp: new Date().toISOString(),
        metadata: sampleMetadata[eventType](),
        session_id: `session-${Math.random().toString(36).substr(2, 9)}`,
    };
};

// Generate multiple events
export const generateEventBatch = (count = 10) => {
    return Array.from({ length: count }, generateRandomEvent);
};

// Generate user data
export const generateMockUsers = (count = 5) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        username: `user_${i + 1}`,
        email: `user${i + 1}@example.com`,
        total_sessions: Math.floor(Math.random() * 50) + 10,
        total_events: Math.floor(Math.random() * 500) + 100,
        avg_session_duration: Math.floor(Math.random() * 1200) + 300,
    }));
};

// Generate dashboard summary
export const generateMockDashboardSummary = () => {
    return {
        total_users: Math.floor(Math.random() * 1000) + 100,
        total_sessions: Math.floor(Math.random() * 5000) + 500,
        total_events: Math.floor(Math.random() * 50000) + 5000,
        active_sessions: Math.floor(Math.random() * 20) + 5,
        avg_events_per_session: (Math.random() * 20 + 10).toFixed(2),
        most_active_hour: Math.floor(Math.random() * 24),
    };
};

// Generate time-series data for charts
export const generateTimeSeriesData = (days = 7) => {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        data.push({
            date: date.toISOString().split('T')[0],
            events: Math.floor(Math.random() * 1000) + 200,
            sessions: Math.floor(Math.random() * 100) + 20,
        });
    }

    return data;
};

// Generate anomaly data
export const generateMockAnomalies = (count = 5) => {
    return Array.from({ length: count }, (_, i) => ({
        session_id: `session-${Math.random().toString(36).substr(2, 9)}`,
        event_count: Math.floor(Math.random() * 500) + 100,
        z_score: (Math.random() * 3 + 2).toFixed(2),
        is_anomaly: true,
        severity: ['high', 'critical'][Math.floor(Math.random() * 2)],
    }));
};
