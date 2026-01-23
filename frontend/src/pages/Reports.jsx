import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import YoYComparison from '../components/reports/YoYComparison';
import PerformanceReport from '../components/reports/PerformanceReport';
import Loader from '../components/common/Loader';
import reportService from '../services/report.service';

const Reports = () => {
  const [yoyData, setYoyData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [yoyResponse, performanceResponse] = await Promise.all([
        reportService.getYearOverYearComparison(),
        reportService.getPerformanceReport(),
      ]);
      setYoyData(yoyResponse.data);
      setPerformanceData(performanceResponse.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial insights and performance metrics</p>
        </div>
        <YoYComparison data={yoyData} />
        <PerformanceReport data={performanceData} />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
