'use client';

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchDashboardData } from '@/redux/slices/dashboardSlice';

const StudentDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    courses,
    deadlines,
    activities,
    recommendations,
    studentData,
    status,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Sample calendar days (you can generate dynamically if needed)
  const calendarDays = [
    [31, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 1, 2, 3, 4],
  ];

  const today = new Date().getDate();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{studentData?.totalCourses || 0}</div>
          <div className="text-sm text-gray-600">Enrolled Courses</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{studentData?.completedCourses || 0}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">{studentData?.points || 0}</div>
          <div className="text-sm text-gray-600">Points</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {studentData?.averageGrade ? `${studentData.averageGrade}%` : '0'}
          </div>
          <div className="text-sm text-gray-600">Avg. Grade</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">My Courses</h3>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{course.title}</span>
                    <span className="text-gray-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${course.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'access'
                        ? 'bg-blue-500'
                        : activity.type === 'message'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-800">{activity.title}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h3>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {weekDays.map((day, index) => (
                <div key={index} className="font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            {calendarDays.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2 text-center mb-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`py-2 border rounded cursor-pointer ${
                      day === today ? 'bg-blue-200 font-bold' : 'text-gray-700'
                    } hover:bg-gray-100`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-800">{deadline.title}</div>
                    <div className="text-sm text-gray-600">{deadline.course}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(deadline.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-800 mb-2">{rec.title}</div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    {rec.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
