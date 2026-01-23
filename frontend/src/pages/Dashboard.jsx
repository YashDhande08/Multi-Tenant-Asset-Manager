import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import AssetAllocationChart from '../components/dashboard/AssetAllocationChart';
import NetWorthGrowthChart from '../components/dashboard/NetWorthGrowthChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import Loader from '../components/common/Loader';
import dashboardService from '../services/dashboard.service';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader size="lg" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <NetWorthCard
          netWorth={data?.summary?.netWorth || 0}
          totalAssets={data?.summary?.totalAssets || 0}
          totalLiabilities={data?.summary?.totalLiabilities || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetAllocationChart assetAllocation={data?.assetAllocation} />
          <NetWorthGrowthChart />
        </div>

        <RecentActivity activities={data?.recentActivity} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

