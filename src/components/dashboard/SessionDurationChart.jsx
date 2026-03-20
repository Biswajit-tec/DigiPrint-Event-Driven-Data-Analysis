import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const SessionDurationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No session data available.</p>
      </div>
    );
  }

  // Create standard order
  const order = ['0-30s', '30-60s', '1-5min', '5min+'];
  const orderedData = [...data].sort((a, b) => {
    const idxA = order.indexOf(a.duration_bucket);
    const idxB = order.indexOf(b.duration_bucket);
    return (idxA >= 0 ? idxA : 99) - (idxB >= 0 ? idxB : 99);
  });

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={orderedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="duration_bucket" stroke="#ffffff50" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
          <YAxis stroke="#ffffff50" fontSize={12} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
            formatter={(value) => [value, 'Sessions']}
          />
          <Bar dataKey="sessions" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {orderedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#8b5cf6" fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionDurationChart;
