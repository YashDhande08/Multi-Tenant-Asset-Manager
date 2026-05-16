import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const AssetCard = ({ asset, onEdit, onDelete }) => {
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const currentValue = asset.currentValue || (asset.valueHistory && asset.valueHistory.length > 0
    ? parseFloat(asset.valueHistory[0].valueAmount)
    : 0);

  const assetTypeName = asset.assetType?.name || 'Unknown';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{asset.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100">
              {assetTypeName}
            </span>
            {asset.acquisitionDate && (
              <span className="text-xs text-gray-500">
                Acquired: {formatDate(asset.acquisitionDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Current Value</p>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(currentValue, asset.currency)}
        </p>
      </div>

      {asset.user && (
        <p className="text-xs text-gray-500 mb-4">
          Owner: {asset.user.name || asset.user.email}
        </p>
      )}

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        {onEdit && (
          <Button
            variant="secondary"
            onClick={() => onEdit(asset)}
            className="flex-1 text-sm"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="danger"
            onClick={() => onDelete(asset.id)}
            className="flex-1 text-sm"
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AssetCard;
