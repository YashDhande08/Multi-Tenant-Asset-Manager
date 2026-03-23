import React from 'react';
import Card from '../common/Card';
/// format currency
const NetWorthCard = ({ netWorth, totalAssets, totalLiabilities, currency = 'INR' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };
/// get net worth color function
  const getNetWorthColor = (value) => {
    if (value >= 0) return 'text-green-600';
    return 'text-red-600';
  };
/// get net worth background color function
  const getNetWorthBgColor = (value) => {
    if (value >= 0) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      /// total assets card
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="p-6">
          <p className="text-sm font-medium text-blue-600 mb-2">Total Assets</p>
          <p className="text-3xl font-bold text-blue-900">
            
            ///It also shows an upward arrow icon indicating portfolio growth.

            {formatCurrency(totalAssets)}</p>
          <div className="mt-4 flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs text-blue-600">Growing portfolio</span>
          </div>
        </div>
      </Card>


      /// This card shows debts or liabilities.
      /// It uses red color to indicate debt.

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div className="p-6">
          <p className="text-sm font-medium text-red-600 mb-2">Total Liabilities</p>
          <p className="text-3xl font-bold text-red-900">{formatCurrency(totalLiabilities)}</p>
          <div className="mt-4 flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            <span className="text-xs text-red-600">Outstanding debts</span>
          </div>
        </div>
      </Card>


      /// This card shows the net worth.
      /// It uses green color to indicate positive net worth.
      /// It also shows a check icon indicating positive net worth.
      /// It also shows a negative arrow icon indicating negative net worth.
      <Card className={`bg-gradient-to-br ${getNetWorthBgColor(netWorth)}`}>
        <div className="p-6">
          <p className="text-sm font-medium mb-2" style={{ color: netWorth >= 0 ? '#059669' : '#DC2626' }}>
            Net Worth
          </p>
          <p className={`text-4xl font-bold ${getNetWorthColor(netWorth)}`}>
            {formatCurrency(netWorth)}
          </p>
          <div className="mt-4 flex items-center">
            {netWorth >= 0 ? (
              <>
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs" style={{ color: '#059669' }}>Positive equity</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-red-600">Negative equity</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NetWorthCard;
