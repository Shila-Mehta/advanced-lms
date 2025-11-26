'use client';

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchDashboardData } from '@/redux/slices/dashboardSlice';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminData } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <h2 className="text-xl font-semibold text-gray-600 mt-2">Platform Management</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
            <div className={`p-4 rounded-lg ${
              adminData?.systemHealth.status === 'healthy' ? 'bg-green-50 border border-green-200' :
              adminData?.systemHealth.status === 'degraded' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800 capitalize">{adminData?.systemHealth.status}</div>
                  <div className="text-sm text-gray-600">
                    Uptime: {adminData?.systemHealth.uptime}% • Active Users: {adminData?.systemHealth.activeUsers}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  adminData?.systemHealth.status === 'healthy' ? 'bg-green-500' :
                  adminData?.systemHealth.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {adminData?.platformMetrics.map((metric, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.name}</div>
                  <div className={`text-xs ${
                    metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        {adminData?.recentSignups && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Signups</h3>
              <div className="space-y-3">
                {adminData.recentSignups.slice(0, 5).map((signup) => (
                  <div key={signup.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{signup.name}</div>
                      <div className="text-sm text-gray-600">{signup.email} • {signup.role}</div>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{signup.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Admin Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                Manage Users
              </button>
              <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                Course Approval
              </button>
              <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                System Settings
              </button>
              <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium">
                Analytics Reports
              </button>
              <button className="p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                Backup System
              </button>
              <button className="p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;