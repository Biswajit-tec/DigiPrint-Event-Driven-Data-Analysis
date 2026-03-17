import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00bfff', '#8b5cf6', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];

const eventTypeLabels = {
  login: 'Login',
  click: 'Click',
  search: 'Search',
  api_call: 'API Call',
  session_start: 'Session Start',
  session_end: 'Session End',
  page_view: 'Page View',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="glass-strong rounded-lg p-3 border border-border text-sm">
      <p className="text-foreground font-medium">{d.name}</p>
      <p style={{ color: d.payload.fill }}>{d.value.toLocaleString()} events</p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-2">
    {payload?.map((entry, idx) => (
      <span key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
        {entry.value}
      </span>
    ))}
  </div>
);

/**
 * Top Event Types pie chart.
 * Props: data — array of { event_type, count }
 */
const TopEventTypesChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No event type data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: eventTypeLabels[d.event_type] || d.event_type,
    value: d.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-xl font-semibold mb-4">Top Event Types</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopEventTypesChart;
