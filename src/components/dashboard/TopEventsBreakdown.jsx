import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';

const TopEventsBreakdown = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No event data available.</p>
      </div>
    );
  }

  // Get top 8 events
  const chartData = data.slice(0, 8);

  const option = {
    grid: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 40,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { 
        type: 'shadow'
      },
      backgroundColor: '#1e293b',
      borderColor: '#475569',
      textStyle: { color: '#f8fafc' },
    },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.event_type),
      axisLabel: { 
        color: '#94a3b8',
        fontSize: 10,
        interval: 0,
        rotate: 30,
        formatter: (value) => {
          const label = value.replace(/_/g, ' ');
          return label.length > 12 ? label.substring(0, 10) + '...' : label;
        }
      },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        barMaxWidth: 40,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        data: chartData.map(d => d.total)
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

export default TopEventsBreakdown;
