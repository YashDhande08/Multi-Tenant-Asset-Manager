import React from 'react';
import Card from '../common/Card';

const AssetValueHistory = ({ history }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card title="Value History">
      {history && history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry) => (
            <div key={entry.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${entry.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{formatDate(entry.recordedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No history available</p>
      )}
    </Card>
  );
};

export default AssetValueHistory;

