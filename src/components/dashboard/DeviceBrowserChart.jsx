import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00bfff', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

const DeviceBrowserChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No browser data available.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-xl text-sm">
          <p className="font-semibold text-white">{payload[0].name}</p>
          <p className="text-muted-foreground">{payload[0].value.toLocaleString()} users</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="users"
            nameKey="browser"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeviceBrowserChart;
