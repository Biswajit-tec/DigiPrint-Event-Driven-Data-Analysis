import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import {
  fetchEventFrequency,
  fetchPeakActivity,
  fetchSiteBehavior,
} from '../api/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
    const [frequency, setFrequency] = useState([]);
    const [peakTimes, setPeakTimes] = useState([]);
    const [userBehavior, setUserBehavior] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);

            const results = await Promise.allSettled([
                fetchEventFrequency(),
                fetchPeakActivity(),
                fetchSiteBehavior(),
            ]);

            setFrequency(results[0].status === 'fulfilled' ? results[0].value : []);
            setPeakTimes(results[1].status === 'fulfilled' ? results[1].value : []);
            setUserBehavior(results[2].status === 'fulfilled' ? results[2].value : []);
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
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading analytics...</p>
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
                    <p className="text-muted-foreground">Deep dive into event patterns and site behavior</p>
                </div>

                {/* Event Frequency Chart */}
                <GlassCard className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Event Frequency Over Time</h2>
                    {frequency.length > 0 ? (
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
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No event frequency data available yet
                        </div>
                    )}
                </GlassCard>

                {/* Peak Activity Times */}
                <GlassCard className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Peak Activity Times</h2>
                    {peakTimes.length > 0 ? (
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
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No peak activity data available yet
                        </div>
                    )}
                </GlassCard>

                {/* Site Behavior */}
                <GlassCard>
                    <h2 className="text-2xl font-semibold mb-6">Top Active Sites</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Site</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total Events</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Sessions</th>
                                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Avg Events/Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userBehavior.length > 0 ? (
                                    userBehavior.map((site, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-muted transition-colors">
                                            <td className="py-3 px-4 font-medium">{site.username}</td>
                                            <td className="py-3 px-4 text-right text-primary">{site.total_events}</td>
                                            <td className="py-3 px-4 text-right text-secondary-foreground">{site.total_sessions}</td>
                                            <td className="py-3 px-4 text-right text-muted-foreground">
                                                {(site.total_events / (site.total_sessions || 1)).toFixed(1)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-muted-foreground">
                                            No site behavior data available yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>
        </motion.div>
    );
};

export default Analytics;
