import React from 'react';

const NetWorthCard = ({ netWorth, totalAssets, totalLiabilities, currency = 'INR' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="metric-card metric-card-assets p-6 theme-transition">
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--metric-assets-label)' }}>
          Total Assets
        </p>
        <p
          className="text-3xl font-bold tabular-nums stat-value-enter"
          style={{ color: 'var(--metric-assets-value)' }}
        >
          {formatCurrency(totalAssets)}
        </p>
        <div className="mt-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 shrink-0"
            style={{ color: 'var(--accent)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs" style={{ color: 'var(--metric-assets-label)' }}>
            Growing portfolio
          </span>
        </div>
      </div>

      <div className="metric-card metric-card-liabilities p-6 theme-transition">
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--metric-liabilities-label)' }}>
          Total Liabilities
        </p>
        <p
          className="text-3xl font-bold tabular-nums stat-value-enter"
          style={{ color: 'var(--metric-liabilities-value)' }}
        >
          {formatCurrency(totalLiabilities)}
        </p>
        <div className="mt-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 shrink-0"
            style={{ color: 'var(--danger)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <span className="text-xs" style={{ color: 'var(--metric-liabilities-label)' }}>
            Outstanding debts
          </span>
        </div>
      </div>

      <div
        className={`metric-card p-6 theme-transition ${
          netWorth >= 0 ? 'metric-card-networth-positive' : 'metric-card-networth-negative'
        }`}
      >
        <p
          className="text-sm font-medium mb-2"
          style={{ color: netWorth >= 0 ? 'var(--success)' : 'var(--danger)' }}
        >
          Net Worth
        </p>
        <p
          className="text-4xl font-bold tabular-nums stat-value-enter"
          style={{ color: netWorth >= 0 ? 'var(--success)' : 'var(--danger)' }}
        >
          {formatCurrency(netWorth)}
        </p>
        <div className="mt-4 flex items-center">
          {netWorth >= 0 ? (
            <>
              <svg
                className="w-5 h-5 mr-2 shrink-0"
                style={{ color: 'var(--success)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs" style={{ color: 'var(--success)' }}>
                Positive equity
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2 shrink-0"
                style={{ color: 'var(--danger)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs" style={{ color: 'var(--danger)' }}>
                Negative equity
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetWorthCard;
