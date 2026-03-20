import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const TopEventsBreakdown = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No event data available.</p>
      </div>
    );
  }

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
          <XAxis type="number" stroke="#ffffff50" fontSize={12} tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val} />
          <YAxis type="category" dataKey="event_type" stroke="#ffffff50" fontSize={12} width={100} tickFormatter={(val) => val.replace(/_/g, ' ')} />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
            formatter={(value) => [value, 'Events']}
            labelFormatter={(label) => String(label).replace(/_/g, ' ').toUpperCase()}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={'#00bfff'} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopEventsBreakdown;
