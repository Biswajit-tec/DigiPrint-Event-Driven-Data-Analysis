import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const TopPagesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No page data available.</p>
      </div>
    );
  }

  // Ensure data fits properly
  const chartData = data.slice(0, 7).map(row => ({
    page: String(row.page).replace('https://', '').replace('http://', '').split('?')[0],
    visits: Number(row.visits)
  }));

  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
          <XAxis type="number" stroke="#ffffff50" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis 
            type="category" 
            dataKey="page" 
            stroke="#ffffff50" 
            fontSize={11} 
            width={120} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            formatter={(value) => [value, 'Visits']}
          />
          <Bar dataKey="visits" radius={[0, 4, 4, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#00bfff" fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPagesChart;
