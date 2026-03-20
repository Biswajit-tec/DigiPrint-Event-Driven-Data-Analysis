import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00bfff', '#8b5cf6', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg p-3 border border-border text-sm">
      <p className="text-foreground font-medium mb-1">{label}</p>
      <p className="text-primary">{payload[0].value.toLocaleString()} events</p>
      {payload[0].payload.total_sessions !== undefined && (
        <p className="text-secondary-foreground">{payload[0].payload.total_sessions.toLocaleString()} sessions</p>
      )}
    </div>
  );
};

/**
 * Site Analytics bar chart.
 * Props: data (from v_site_analytics — array of { site_name, total_events, total_sessions })
 */
const SiteAnalyticsChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No site analytics data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-xl font-semibold mb-4">Site Analytics</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="site_name"
            tick={{ fill: '#94a3b8', fontSize: 13 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 13 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="total_events" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SiteAnalyticsChart;
