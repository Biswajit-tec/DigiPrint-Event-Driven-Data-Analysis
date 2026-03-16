import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import DashboardCards from '../components/dashboard/DashboardCards';
import SiteAnalyticsChart from '../components/dashboard/SiteAnalyticsChart';
import TopEventTypesChart from '../components/dashboard/TopEventTypesChart';
import {
  fetchDashboardSummary,
  fetchEventRate,
  fetchSiteAnalytics,
  fetchTopEventTypes,
  fetchLiveEvents,
} from '../api/queries';

const POLL_INTERVAL = 30_000; // 30s

const eventTypeColors = {
  login: 'bg-green-500/20 text-green-400 border-green-500/30',
  logout: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  click: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  search: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  api_call: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  page_view: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  session_start: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  session_end: 'bg-red-500/20 text-red-400 border-red-500/30',
  scroll: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  scroll_depth: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  form_submit: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  navigation: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  hover: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  download: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  external_link_click: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  rage_click: 'bg-red-600/20 text-red-400 border-red-600/30',
};

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [eventRate, setEventRate] = useState(null);
  const [siteAnalytics, setSiteAnalytics] = useState([]);
  const [topEventTypes, setTopEventTypes] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      // Fetch each independently so one failure doesn't break everything
      const results = await Promise.allSettled([
        fetchDashboardSummary(),
        fetchEventRate(),
        fetchSiteAnalytics(),
        fetchTopEventTypes(),
        fetchLiveEvents({ limit: 20 }),
      ]);

      setSummary(results[0].status === 'fulfilled' ? results[0].value : null);
      setEventRate(results[1].status === 'fulfilled' ? results[1].value : { events_per_second: 0 });
      setSiteAnalytics(results[2].status === 'fulfilled' ? results[2].value : []);
      setTopEventTypes(results[3].status === 'fulfilled' ? results[3].value : []);
      setRecentEvents(results[4].status === 'fulfilled' ? results[4].value : []);

      const errors = results.filter(r => r.status === 'rejected');
      setError(errors.length ? `${errors.length} queries failed` : null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard from Supabase...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Real-time digital footprint analytics — powered by Supabase</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live — Auto-refresh every 30s
            </span>
            {error && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50">
                ⚠️ {error}
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8">
          <DashboardCards summary={summary} eventRate={eventRate} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <GlassCard>
            <SiteAnalyticsChart data={siteAnalytics} />
          </GlassCard>
          <GlassCard>
            <TopEventTypesChart data={topEventTypes} />
          </GlassCard>
        </div>

        {/* Recent Activity Table */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <span className="flex items-center gap-2 text-sm text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="pb-3 pr-4">Site</th>
                  <th className="pb-3 pr-4">Event Type</th>
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3">Session ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentEvents.length > 0 ? (
                  recentEvents.map((ev, idx) => {
                    const colorClass = eventTypeColors[ev.event_type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
                    return (
                      <motion.tr
                        key={ev.event_id || idx}
                        className="hover:bg-white/[.04] transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <td className="py-3 pr-4 text-white font-medium">{ev.site_name || '—'}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                            {(ev.event_type || '').replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{formatTime(ev.event_timestamp)}</td>
                        <td className="py-3 text-gray-500 font-mono text-xs">
                          {ev.session_id ? String(ev.session_id).slice(0, 12) + '…' : '—'}
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      No recent events
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

export default Dashboard;
