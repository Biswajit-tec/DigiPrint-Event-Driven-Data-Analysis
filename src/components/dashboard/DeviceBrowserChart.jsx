import React from 'react';
import ReactECharts from 'echarts-for-react';

const DeviceBrowserChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No browser data available.</p>
      </div>
    );
  }

  // Map dynamic data to ECharts format
  const chartData = data.map(item => ({
    value: Number(item.users),
    name: item.browser || 'Unknown'
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc' },
      formatter: '{b}: {c} users ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      left: 'center',
      textStyle: { color: '#94a3b8', fontSize: 10 },
      type: 'scroll'
    },
    series: [
      {
        name: 'Browser Access',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 8
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData,
        color: ['#00bfff', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b']
      }
    ]
  };

  return (
    <div className="h-64 mt-4 w-full">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default DeviceBrowserChart;
