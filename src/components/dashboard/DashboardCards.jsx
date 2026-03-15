import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const iconMap = {
  sites: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  sessions: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  events: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  active: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
  rate: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  avg: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const colorSchemes = [
  { bg: 'bg-cyber-500/10', border: 'border-cyber-500/30', text: 'text-cyber-400', iconBg: 'bg-cyber-500/20' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
  { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', iconBg: 'bg-green-500/20' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
  { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', iconBg: 'bg-yellow-500/20' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', iconBg: 'bg-pink-500/20' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', iconBg: 'bg-orange-500/20' },
  { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', iconBg: 'bg-red-500/20' },
];

/** Animated counter value */
const AnimatedValue = ({ value, format = 'number' }) => {
  const [display, setDisplay] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const spring = useSpring(0, { stiffness: 50, damping: 15 });

  useEffect(() => {
    spring.set(numericValue);
    const unsub = spring.on('change', (v) => setDisplay(Math.floor(v)));
    return unsub;
  }, [numericValue, spring]);

  if (format === 'decimal') return display.toLocaleString();
  if (format === 'hour') return numericValue !== null ? `${numericValue}:00` : 'N/A';
  return display.toLocaleString();
};

/**
 * Dashboard metrics grid — 8 cards.
 * Props: summary (from get_dashboard_summary), eventRate (from v_event_rate)
 */
const DashboardCards = ({ summary, eventRate }) => {
  if (!summary) return null;

  const cards = [
    { key: 'sites', title: 'Total Sites', value: summary.total_sites ?? 0, icon: 'sites' },
    { key: 'users', title: 'Total Users', value: summary.total_users ?? 0, icon: 'users' },
    { key: 'sessions', title: 'Total Sessions', value: summary.total_sessions ?? 0, icon: 'sessions' },
    { key: 'events', title: 'Total Events', value: summary.total_events ?? 0, icon: 'events' },
    { key: 'active', title: 'Active Sessions', value: summary.active_sessions ?? 0, icon: 'active' },
    { key: 'rate', title: 'Events / Second', value: eventRate?.events_per_second ?? 0, icon: 'rate', format: 'decimal' },
    { key: 'hour', title: 'Most Active Hour', value: summary.most_active_hour, icon: 'clock', format: 'hour' },
    { key: 'avg', title: 'Avg Events/Session', value: summary.avg_events_per_session ?? 0, icon: 'avg', format: 'decimal' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const scheme = colorSchemes[idx % colorSchemes.length];
        return (
          <motion.div
            key={card.key}
            className={`glass-strong rounded-xl p-5 border ${scheme.border} hover:bg-white/[.08] transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <h3 className={`text-3xl font-bold ${scheme.text} stat-count-up`}>
                  {card.format === 'hour' ? (
                    card.value !== null && card.value !== undefined ? `${card.value}:00` : 'N/A'
                  ) : (
                    <AnimatedValue value={card.value} format={card.format} />
                  )}
                </h3>
              </div>
              <div className={`p-3 ${scheme.iconBg} rounded-lg ${scheme.text}`}>
                {iconMap[card.icon]}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
