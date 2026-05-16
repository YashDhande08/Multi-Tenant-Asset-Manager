import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../common/Card';
import { useChartTheme } from '../../hooks/useChartTheme';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
];

const AssetAllocationChart = ({ assetAllocation }) => {
  const { axis, tooltipBg, tooltipBorder, tooltipShadow } = useChartTheme();

  if (!assetAllocation || Object.keys(assetAllocation).length === 0) {
    return (
      <Card title="Asset Allocation">
        <div className="h-64 flex items-center justify-center chart-mount-enter">
          <p className="text-gray-500">No asset data available</p>
        </div>
      </Card>
    );
  }

  const data = Object.entries(assetAllocation).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0];
      const percentage = ((row.value / total) * 100).toFixed(1);
      return (
        <div
          className="theme-chart-tooltip theme-transition"
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            boxShadow: tooltipShadow,
          }}
        >
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="font-medium mt-1" style={{ color: 'var(--accent)' }}>
            {formatCurrency(row.value)}
          </p>
          <p className="text-sm text-gray-500 mt-1">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Asset Allocation">
      <div className="h-80 chart-mount-enter">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ color: axis }}
              formatter={(value) => `${value} - ${formatCurrency(data.find((d) => d.name === value)?.value || 0)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AssetAllocationChart;
