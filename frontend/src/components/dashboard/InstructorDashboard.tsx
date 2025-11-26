'use client';

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchDashboardData } from '@/redux/slices/dashboardSlice';

const InstructorDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { instructorData, courses, activities } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
        <h2 className="text-xl font-semibold text-gray-600 mt-2">Teaching Analytics</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Instructor Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Teaching Overview</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{instructorData?.totalCourses || 0}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{instructorData?.activeStudents || 0}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{instructorData?.pendingAssignments || 0}</div>
                <div className="text-sm text-gray-600">Pending Grading</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {instructorData?.rating ? `${instructorData.rating}/5` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Course Analytics */}
          {instructorData?.courseAnalytics && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Performance</h3>
              <div className="space-y-4">
                {instructorData.courseAnalytics.map((analytic) => (
                  <div key={analytic.courseId} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800">{analytic.courseName}</div>
                        <div className="text-sm text-gray-600">
                          {analytic.enrollment} students • {analytic.completionRate}% completion
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{analytic.averageGrade}%</div>
                        <div className="text-sm text-gray-600">Avg. Grade</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <div className="font-medium">Create New Course</div>
                <div className="text-sm">Start building your course</div>
              </button>
              <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left">
                <div className="font-medium">Grade Assignments</div>
                <div className="text-sm">{instructorData?.pendingAssignments || 0} pending</div>
              </button>
              <button className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div className="font-medium">Schedule Live Class</div>
                <div className="text-sm">Host a session</div>
              </button>
              <button className="p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm">Detailed reports</div>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Student Engagement */}
          {instructorData?.studentEngagement && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Metrics</h3>
              <div className="space-y-3">
                {instructorData.studentEngagement.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{metric.metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{metric.value}%</span>
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'access' ? 'bg-blue-500' :
                    activity.type === 'message' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-800">{activity.title}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;