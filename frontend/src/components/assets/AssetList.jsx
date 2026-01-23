import React from 'react';
import AssetCard from './AssetCard';
import Button from '../common/Button';

const AssetList = ({ assets, onAdd, onEdit, onDelete }) => {
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">💰</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets yet</h3>
        <p className="text-gray-600 mb-6">Start tracking your assets by adding your first one.</p>
        <Button onClick={onAdd}>Add Your First Asset</Button>
      </div>
    );
  }

  // Calculate total value
  const totalValue = assets.reduce((sum, asset) => {
    const value = asset.currentValue || (asset.valueHistory && asset.valueHistory.length > 0
      ? parseFloat(asset.valueHistory[0].valueAmount)
      : 0);
    return sum + value;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Assets Value</p>
            <p className="text-3xl font-bold">
              {formatCurrency(totalValue, assets[0]?.currency || 'INR')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm font-medium mb-1">Total Assets</p>
            <p className="text-3xl font-bold">{assets.length}</p>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetList;
