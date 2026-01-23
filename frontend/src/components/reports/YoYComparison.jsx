import React from 'react';
import Card from '../common/Card';

const YoYComparison = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!data) {
    return (
      <Card title="Year-over-Year Comparison">
        <div className="text-center py-8">
          <p className="text-gray-500">No comparison data available</p>
        </div>
      </Card>
    );
  }

  const { currentYear, previousYear, growth } = data;

  return (
    <Card title="Year-over-Year Comparison">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Year */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            {currentYear.year}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Assets:</span>
              <span className="font-semibold text-green-700">
                {formatCurrency(currentYear.totalAssets)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Liabilities:</span>
              <span className="font-semibold text-red-700">
                {formatCurrency(currentYear.totalLiabilities)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
              <span className="text-sm font-medium text-gray-800">Net Worth:</span>
              <span className="text-xl font-bold text-blue-900">
                {formatCurrency(currentYear.netWorth)}
              </span>
            </div>
          </div>
        </div>

        {/* Previous Year */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {previousYear.year}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Assets:</span>
              <span className="font-semibold text-green-700">
                {formatCurrency(previousYear.totalAssets)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Liabilities:</span>
              <span className="font-semibold text-red-700">
                {formatCurrency(previousYear.totalLiabilities)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-800">Net Worth:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(previousYear.netWorth)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Indicator */}
      <div className={`p-6 rounded-lg border-2 ${
        growth >= 0
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Growth Rate</p>
            <p className="text-xs text-gray-600">
              {currentYear.year} vs {previousYear.year}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-bold ${
              growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {growth >= 0 ? '+' : ''}{growth}%
            </p>
            <p className={`text-sm font-medium mt-1 ${
              growth >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {growth >= 0 ? 'Increase' : 'Decrease'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default YoYComparison;
