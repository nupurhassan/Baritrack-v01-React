import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightChart = ({ chartData, chartTimeframe, weightUnit }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="timepoint"
            stroke="#9CA3AF"
            fontSize={12}
            label={{
              value: chartTimeframe === 'daily' ? 'Days' : 'Weeks',
              position: 'insideBottom',
              offset: -5,
              style: { textAnchor: 'middle', fill: '#9CA3AF' }
            }}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            label={{ value: `Weight (${weightUnit})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(value, name) => {
              if (!value) return ['No data', name];
              const formattedValue = `${value.toFixed(1)} ${weightUnit}`;
              return [formattedValue, name];
            }}
            labelFormatter={(label) => chartTimeframe === 'daily' ? `Day ${label}` : `Week ${label}`}
          />
          <Line
            type="monotone"
            dataKey="expectedWeight"
            stroke="#F97316"
            strokeWidth={3}
            name="Expected Weight"
            connectNulls={true}
            dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="actualWeight"
            stroke="#10B981"
            strokeWidth={3}
            name="Your Weight"
            connectNulls={true}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
