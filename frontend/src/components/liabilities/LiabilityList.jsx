import React from 'react';
import LiabilityCard from './LiabilityCard';
import Button from '../common/Button';

const LiabilityList = ({ liabilities, onAdd, onEdit, onDelete }) => {
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!liabilities || liabilities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📉</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No liabilities yet</h3>
        <p className="text-gray-600 mb-6">Start tracking your liabilities by adding your first one.</p>
        <Button onClick={onAdd}>Add Your First Liability</Button>
      </div>
    );
  }

  // Calculate total
  const totalValue = liabilities.reduce((sum, liability) => {
    return sum + parseFloat(liability.currentValue || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-red-100 text-sm font-medium mb-1">Total Liabilities</p>
            <p className="text-3xl font-bold">
              {formatCurrency(totalValue, liabilities[0]?.currency || 'INR')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-red-100 text-sm font-medium mb-1">Total Count</p>
            <p className="text-3xl font-bold">{liabilities.length}</p>
          </div>
        </div>
      </div>

      {/* Liabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liabilities.map((liability) => (
          <LiabilityCard
            key={liability.id}
            liability={liability}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default LiabilityList;
