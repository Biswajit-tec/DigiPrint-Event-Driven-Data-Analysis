import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import StatCard from '../components/ui/StatCard';
import { api } from '../services/api';
import { useModeContext } from '../components/ui/ModeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { generateTimeSeriesData } from '../utils/mockData';

const Analytics = () => {
    const { isLiveMode } = useModeContext();
    const [frequency, setFrequency] = useState([]);
    const [peakTimes, setPeakTimes] = useState([]);
    const [userBehavior, setUserBehavior] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [isLiveMode]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            if (isLiveMode) {
                const [freqData, peakData, behaviorData] = await Promise.all([
                    api.getEventFrequency('day'),
                    api.getPeakActivity(),
                    api.getUserBehavior(10),
                ]);
                setFrequency(freqData.data || []);
                setPeakTimes(peakData.data || []);
                setUserBehavior(behaviorData.data || []);
            } else {
                // Mock data
                setFrequency(generateTimeSeriesData(7));
                setPeakTimes([
                    { hour: 9, event_count: 450 },
                    { hour: 12, event_count: 680 },
                    { hour: 15, event_count: 520 },
                    { hour: 18, event_count: 390 },
                ]);
                setUserBehavior([
                    { username: 'user_1', total_events: 1245, total_sessions: 45 },
                    { username: 'user_2', total_events: 987, total_sessions: 38 },
                    { username: 'user_3', total_events: 856, total_sessions: 32 },
                    { username: 'user_4', total_events: 743, total_sessions: 28 },
                    { username: 'user_5', total_events: 621, total_sessions: 24 },
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen py-8"
        >
            <div className="container mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
                    <p className="text-gray-400">Deep dive into event patterns and user behavior</p>
                </div>

                {/* Event Frequency Chart */}
                <GlassCard className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Event Frequency Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={frequency}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="events"
                                stroke="#00bfff"
                                strokeWidth={2}
                                dot={{ fill: '#00bfff', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sessions"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ fill: '#8b5cf6', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </GlassCard>

                {/* Peak Activity Times */}
                <GlassCard className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Peak Activity Times</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={peakTimes}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="hour" stroke="#94a3b8" tickFormatter={(hour) => `${hour}:00`} />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                }}
                            />
                            <Bar dataKey="event_count" fill="#00bfff" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GlassCard>

                {/* User Behavior */}
                <GlassCard>
                    <h2 className="text-2xl font-semibold mb-6">Top Active Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Events</th>
                                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Sessions</th>
                                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Avg Events/Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userBehavior.map((user, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 font-medium">{user.username}</td>
                                        <td className="py-3 px-4 text-right text-cyber-400">{user.total_events}</td>
                                        <td className="py-3 px-4 text-right text-purple-400">{user.total_sessions}</td>
                                        <td className="py-3 px-4 text-right text-gray-300">
                                            {(user.total_events / user.total_sessions).toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default Analytics;
