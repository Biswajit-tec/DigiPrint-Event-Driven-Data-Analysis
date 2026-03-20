import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const ConversionFunnelChart = ({ data }) => {
  if (!data || data.length === 0 || data.every(d => d.count === 0)) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No funnel data available.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-semibold text-white mb-1 uppercase text-xs">{label.replace(/_/g, ' ')}</p>
          <p className="text-emerald-400 font-mono">{dataPoint.count.toLocaleString()} triggers</p>
          {dataPoint.dropoff > 0 && (
            <p className="text-red-400 text-xs mt-1">-{dataPoint.dropoff}% drop-off</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
          <XAxis type="number" stroke="#ffffff50" fontSize={12} />
          <YAxis type="category" dataKey="step" stroke="#ffffff50" fontSize={12} width={100} tickFormatter={(val) => val.replace(/_/g, ' ')} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => {
              const colors = ['#00bfff', '#38bdf8', '#818cf8', '#a78bfa'];
              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionFunnelChart;
