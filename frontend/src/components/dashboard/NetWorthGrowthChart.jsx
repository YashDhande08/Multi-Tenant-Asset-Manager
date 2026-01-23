import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import dashboardService from '../../services/dashboard.service';
import { useState, useEffect } from 'react';

const NetWorthGrowthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      const response = await dashboardService.getNetWorthGrowth({ months: 12 });
      if (response.data && response.data.length > 0) {
        setData(response.data.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          netWorth: parseFloat(item.netWorth),
          assets: parseFloat(item.totalAssets),
          liabilities: parseFloat(item.totalLiabilities),
        })));
      }
    } catch (error) {
      console.error('Error fetching growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-semibold">{entry.name}:</span> {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card title="Net Worth Growth">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Net Worth Growth">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No historical data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Net Worth Growth (12 Months)">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
                return `₹${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Net Worth"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="assets" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Total Assets"
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="liabilities" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Total Liabilities"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default NetWorthGrowthChart;
