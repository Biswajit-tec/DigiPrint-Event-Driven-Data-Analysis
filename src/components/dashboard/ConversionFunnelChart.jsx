import React from 'react';
import ReactECharts from 'echarts-for-react';

const ConversionFunnelChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 mt-4 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
        <p className="text-sm">No conversion data available over time.</p>
      </div>
    );
  }

  const colors = ['#5070dd', '#b6d634', '#505372'];
  
  const days = data.map(d => d.day);
  const pageViews = data.map(d => d.page_views);
  const clicks = data.map(d => d.clicks);
  const conversions = data.map(d => d.conversions);

  const option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#1e293b',
      borderColor: '#475569',
      textStyle: { color: '#f8fafc' },
    },
    grid: {
      right: '25%',
      left: '10%',
      top: '15%',
      bottom: '15%'
    },
    legend: {
      data: ['Page Views', 'Clicks', 'Conversions'],
      textStyle: { color: '#94a3b8' },
      top: '0'
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { alignWithLabel: true },
        data: days,
        axisLabel: { color: '#94a3b8' }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Page Views',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: { color: colors[0] }
        },
        axisLabel: { formatter: '{value}', color: '#94a3b8' },
        splitLine: { show: false }
      },
      {
        type: 'value',
        name: 'Clicks',
        position: 'right',
        alignTicks: true,
        offset: 80,
        axisLine: {
          show: true,
          lineStyle: { color: colors[1] }
        },
        axisLabel: { formatter: '{value}', color: '#94a3b8' },
        splitLine: { show: false }
      },
      {
        type: 'value',
        name: 'Conversions',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: { color: colors[2] }
        },
        axisLabel: { formatter: '{value}', color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
      }
    ],
    series: [
      {
        name: 'Page Views',
        type: 'bar',
        data: pageViews
      },
      {
        name: 'Clicks',
        type: 'bar',
        yAxisIndex: 1,
        data: clicks
      },
      {
        name: 'Conversions',
        type: 'line',
        yAxisIndex: 2,
        data: conversions,
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 3 }
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

export default ConversionFunnelChart;
