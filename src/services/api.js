import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
    }
);

// API Methods
export const api = {
    // Events
    ingestEvent: (eventData) => apiClient.post('/events', eventData),
    createSession: (sessionData) => apiClient.post('/events/session', sessionData),
    endSession: (sessionId) => apiClient.put(`/events/session/${sessionId}/end`),
    getEventStream: (limit = 50) => apiClient.get('/events/stream', { params: { limit } }),
    getEventsForReplay: (startDate, endDate) =>
        apiClient.get('/events/replay', { params: { start_date: startDate, end_date: endDate } }),

    // Analytics
    getDashboardSummary: () => apiClient.get('/analytics/dashboard'),
    getEventFrequency: (period = 'day') => apiClient.get('/analytics/frequency', { params: { period } }),
    getPeakActivity: () => apiClient.get('/analytics/peak-times'),
    getUserBehavior: (limit = 10) => apiClient.get('/analytics/user-behavior', { params: { limit } }),
    getAnomalies: (threshold = 2.0) => apiClient.get('/analytics/anomalies', { params: { threshold } }),
    getRiskScores: (riskLevel = null) => apiClient.get('/analytics/risk-scores', { params: { risk_level: riskLevel } }),
    getUserAnalytics: (userId) => apiClient.get(`/analytics/user/${userId}`),
    getEventTimeline: (startDate, endDate) =>
        apiClient.get('/analytics/timeline', { params: { start_date: startDate, end_date: endDate } }),

    // Queries
    getPredefinedQueries: () => apiClient.get('/queries/predefined'),
    getQuery: (queryId) => apiClient.get(`/queries/predefined/${queryId}`),
    executeQuery: (queryId) => apiClient.post('/queries/execute', { query_id: queryId }),
};

export default api;
