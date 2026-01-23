import React from 'react';
import Card from '../common/Card';

const RecentActivity = ({ activities }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return '➕';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      case 'LOGIN':
        return '🔐';
      case 'LOGOUT':
        return '🚪';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <Card title="Recent Activity">
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Activity">
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${getActionColor(activity.action)}`}>
              {getActionIcon(activity.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user?.name || activity.user?.email || 'System'}
                </p>
                <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{activity.action}</span> {activity.entityType}
                {activity.entityId && ` #${activity.entityId}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
