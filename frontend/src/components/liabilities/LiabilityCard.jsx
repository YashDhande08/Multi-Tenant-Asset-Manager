import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const LiabilityCard = ({ liability, onEdit, onDelete }) => {
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

  const liabilityTypeName = liability.liabilityType?.name || 'Unknown';
  const currentValue = parseFloat(liability.currentValue || 0);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{liability.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {liabilityTypeName}
            </span>
            {liability.acquisitionDate && (
              <span className="text-xs text-gray-500">
                Acquired: {formatDate(liability.acquisitionDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Current Value</p>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(currentValue, liability.currency)}
        </p>
      </div>

      {(liability.interestRate || liability.monthlyPayment) && (
        <div className="mb-4 space-y-1">
          {liability.interestRate && (
            <p className="text-sm text-gray-600">
              Interest Rate: <span className="font-medium">{parseFloat(liability.interestRate).toFixed(2)}%</span>
            </p>
          )}
          {liability.monthlyPayment && (
            <p className="text-sm text-gray-600">
              Monthly Payment: <span className="font-medium">{formatCurrency(parseFloat(liability.monthlyPayment), liability.currency)}</span>
            </p>
          )}
        </div>
      )}

      {liability.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{liability.description}</p>
      )}

      {liability.ownerUser && (
        <p className="text-xs text-gray-500 mb-4">
          Owner: {liability.ownerUser.name || liability.ownerUser.email}
        </p>
      )}

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        {onEdit && (
          <Button
            variant="secondary"
            onClick={() => onEdit(liability)}
            className="flex-1 text-sm"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="danger"
            onClick={() => onDelete(liability.id)}
            className="flex-1 text-sm"
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default LiabilityCard;
