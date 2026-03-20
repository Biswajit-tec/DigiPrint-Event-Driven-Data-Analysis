import React from 'react';
import ReactECharts from 'echarts-for-react';

const TopPagesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No page data available.</p>
      </div>
    );
  }

  // Map dynamic data to ECharts format
  const chartData = data.slice(0, 8).map(item => ({
    value: Number(item.visits),
    name: String(item.page).replace('https://', '').replace('http://', '').split('?')[0]
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc' },
      formatter: '{b}: {c} visits ({d}%)'
    },
    legend: {
      top: 'bottom',
      textStyle: { color: '#94a3b8', fontSize: 12 },
      type: 'scroll',
      padding: [10, 0, 0, 0]
    },
    series: [
      {
        name: 'Top Pages',
        type: 'pie',
        radius: [40, 110], // Increased radius for better visibility
        center: ['50%', '45%'], // Adjusted center to make room for legend
        roseType: 'radius', // Balanced Nightingale Rose chart
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'rgba(0,0,0,0.3)',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}',
          fontSize: 13,
          color: '#f8fafc',
          fontWeight: 500
        },
        labelLine: {
          length: 15,
          length2: 10,
          smooth: true,
          lineStyle: {
            width: 2,
            type: 'solid'
          }
        },
        data: chartData,
        color: ['#00bfff', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b', '#0ea5e9', '#6366f1']
      }
    ]
  };

  return (
    <div className="h-80 mt-4 w-full">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default TopPagesChart;
