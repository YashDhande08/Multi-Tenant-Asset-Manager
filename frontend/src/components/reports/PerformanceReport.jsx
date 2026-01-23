import React from 'react';
import Card from '../common/Card';

const PerformanceReport = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!data) {
    return (
      <Card title="Performance Report">
        <div className="text-center py-8">
          <p className="text-gray-500">No performance data available</p>
        </div>
      </Card>
    );
  }

  const { period, assets, liabilities, netWorth } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assets Breakdown */}
      <Card title="Assets Performance">
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total Assets Value</span>
              <span className="text-2xl font-bold text-green-700">
                {formatCurrency(assets.totalValue)}
              </span>
            </div>
            <p className="text-xs text-gray-600">Total Count: {assets.count}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Breakdown by Type</h4>
            <div className="space-y-2">
              {Object.entries(assets.byType).map(([type, value]) => {
                const percentage = assets.totalValue > 0
                  ? ((value / assets.totalValue) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{type}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(value)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Liabilities Breakdown */}
      <Card title="Liabilities Performance">
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total Liabilities</span>
              <span className="text-2xl font-bold text-red-700">
                {formatCurrency(liabilities.totalAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-600">Total Count: {liabilities.count}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Breakdown by Type</h4>
            <div className="space-y-2">
              {Object.entries(liabilities.byType).map(([type, amount]) => {
                const percentage = liabilities.totalAmount > 0
                  ? ((amount / liabilities.totalAmount) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{type}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(amount)} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Period Info */}
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Report Period</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(period.startDate)} - {formatDate(period.endDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Net Worth</p>
              <p className={`text-2xl font-bold ${
                netWorth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(netWorth)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceReport;
