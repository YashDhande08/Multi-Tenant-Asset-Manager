import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import dashboardService from '../../services/dashboard.service';
import { useState, useEffect } from 'react';
import { useChartTheme } from '../../hooks/useChartTheme';

const LINE_COLORS = {
  netWorth: 'var(--chart-1)',
  assets: 'var(--chart-2)',
  liabilities: 'var(--chart-3)',
};

const NetWorthGrowthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { grid, axis, tooltipBg, tooltipBorder, tooltipShadow } = useChartTheme();

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      const response = await dashboardService.getNetWorthGrowth({ months: 12 });
      if (response.data && response.data.length > 0) {
        setData(
          response.data.map((item) => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            netWorth: parseFloat(item.netWorth),
            assets: parseFloat(item.totalAssets),
            liabilities: parseFloat(item.totalLiabilities),
          }))
        );
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
        <div
          className="theme-chart-tooltip theme-transition"
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            boxShadow: tooltipShadow,
          }}
        >
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
        <div className="h-80 flex items-center justify-center chart-mount-enter">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 theme-transition"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
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
      <div className="h-80 chart-mount-enter">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} strokeOpacity={0.85} />
            <XAxis dataKey="date" stroke={axis} tick={{ fill: axis, fontSize: 12 }} />
            <YAxis
              stroke={axis}
              tick={{ fill: axis, fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
                return `₹${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: axis }} />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke={LINE_COLORS.netWorth}
              strokeWidth={3}
              name="Net Worth"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="assets"
              stroke={LINE_COLORS.assets}
              strokeWidth={2.5}
              name="Total Assets"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="liabilities"
              stroke={LINE_COLORS.liabilities}
              strokeWidth={2.5}
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
