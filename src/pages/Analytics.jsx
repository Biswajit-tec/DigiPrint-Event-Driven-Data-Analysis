import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import {
  fetchEventFrequency,
  fetchPeakActivity,
  fetchSiteBehavior,
  fetchUserSites,
  fetchTopEvents,
  fetchConversionOverTime,
  fetchSessionDistribution,
  fetchDeviceBrowser,
  fetchTopPages,
} from '../api/queries';
import TopEventsBreakdown from '../components/dashboard/TopEventsBreakdown';
import ConversionFunnelChart from '../components/dashboard/ConversionFunnelChart';
import SessionDurationChart from '../components/dashboard/SessionDurationChart';
import DeviceBrowserChart from '../components/dashboard/DeviceBrowserChart';
import TopPagesChart from '../components/dashboard/TopPagesChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';

const Analytics = () => {
    const [frequency, setFrequency] = useState([]);
    const [peakTimes, setPeakTimes] = useState([]);
    const [userBehavior, setUserBehavior] = useState([]);
    
    // New Advanced Analytics State
    const [topEventsBreakdown, setTopEventsBreakdown] = useState([]);
    const [funnelData, setFunnelData] = useState([]);
    const [sessionDistribution, setSessionDistribution] = useState([]);
    const [deviceBrowser, setDeviceBrowser] = useState([]);
    const [topPages, setTopPages] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);

            const sites = await fetchUserSites();
            const siteIds = sites.map(s => s.id);

            const results = await Promise.allSettled([
                fetchEventFrequency(),
                fetchPeakActivity(),
                fetchSiteBehavior(),
                fetchTopEvents(siteIds),
                fetchConversionOverTime(siteIds),
                fetchSessionDistribution(siteIds),
                fetchDeviceBrowser(siteIds),
                fetchTopPages(siteIds),
            ]);

            setFrequency(results[0].status === 'fulfilled' ? results[0].value : []);
            setPeakTimes(results[1].status === 'fulfilled' ? results[1].value : []);
            setUserBehavior(results[2].status === 'fulfilled' ? results[2].value : []);
            setTopEventsBreakdown(results[3].status === 'fulfilled' ? results[3].value : []);
            setFunnelData(results[4].status === 'fulfilled' ? results[4].value : []);
            setSessionDistribution(results[5].status === 'fulfilled' ? results[5].value : []);
            setDeviceBrowser(results[6].status === 'fulfilled' ? results[6].value : []);
            setTopPages(results[7].status === 'fulfilled' ? results[7].value : []);
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

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Event Frequency Chart */}
                    <GlassCard>
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
                    <GlassCard>
                    <h2 className="text-2xl font-semibold mb-6">Peak Activity Times</h2>
                    {peakTimes.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <ReactECharts
                                option={{
                                    grid: {
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 40,
                                        containLabel: true,
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: { 
                                            type: 'none'
                                        },
                                        backgroundColor: '#1e293b',
                                        borderColor: '#475569',
                                        textStyle: { color: '#f8fafc' },
                                    },
                                    xAxis: {
                                        type: 'category',
                                        data: peakTimes.map(d => `${d.hour}:00`),
                                        axisLabel: { inside: true, color: '#fff' },
                                        axisTick: { show: false },
                                        axisLine: { show: false },
                                        z: 10,
                                    },
                                    yAxis: {
                                        type: 'value',
                                        axisLine: { show: false },
                                        axisTick: { show: false },
                                        axisLabel: { color: '#94a3b8' },
                                        splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
                                    },
                                    dataZoom: [{ type: 'inside' }],
                                    series: [
                                        {
                                            type: 'bar',
                                            barWidth: '30%',
                                            barMaxWidth: 35,
                                            itemStyle: {
                                                borderRadius: [4, 4, 0, 0],
                                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                    { offset: 0, color: '#83bff6' },
                                                    { offset: 0.5, color: '#188df0' },
                                                    { offset: 1, color: '#188df0' }
                                                ])
                                            },
                                            emphasis: {
                                                itemStyle: {
                                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                        { offset: 0, color: '#2378f7' },
                                                        { offset: 0.7, color: '#2378f7' },
                                                        { offset: 1, color: '#83bff6' }
                                                    ])
                                                }
                                            },
                                            data: peakTimes.map(d => d.event_count)
                                        }
                                    ]
                                }}
                                style={{ height: '300px', width: '100%' }}
                                onEvents={{
                                    click: (params, instance) => {
                                        const zoomSize = 6;
                                        instance.dispatchAction({
                                            type: 'dataZoom',
                                            startValue: Math.max(params.dataIndex - zoomSize / 2, 0),
                                            endValue: Math.min(params.dataIndex + zoomSize / 2, peakTimes.length - 1)
                                        });
                                    }
                                }}
                            />
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            No peak activity data available yet
                        </div>
                    )}
                    </GlassCard>
                </div>

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

                {/* Advanced Analytics Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-6">Top Events</h2>
                        <TopEventsBreakdown data={topEventsBreakdown} />
                    </GlassCard>
                    
                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-6">Conversion Funnel</h2>
                        <ConversionFunnelChart data={funnelData} />
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-6">Session Durations</h2>
                        <SessionDurationChart data={sessionDistribution} />
                    </GlassCard>

                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-6">Device & Browser</h2>
                        <DeviceBrowserChart data={deviceBrowser} />
                    </GlassCard>
                </div>

                {/* Top Pages Table Block */}
                <div className="mt-8">
                    <GlassCard>
                        <h2 className="text-2xl font-semibold mb-6">Top Pages</h2>
                        <TopPagesChart data={topPages} />
                    </GlassCard>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
