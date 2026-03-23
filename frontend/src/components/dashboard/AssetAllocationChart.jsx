import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../common/Card';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const AssetAllocationChart = ({ assetAllocation }) => {
  if (!assetAllocation || Object.keys(assetAllocation).length === 0) {
    return (
      <Card title="Asset Allocation">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No asset data available</p>
        </div>
      </Card>
    );
  }
/// convert  object  to array of objects
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
/// detail tooltip when hover on the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-blue-600 font-medium">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-500">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Asset Allocation">
      <div className="h-80">
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
              formatter={(value) => `${value} - ${formatCurrency(data.find(d => d.name === value)?.value || 0)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AssetAllocationChart;
