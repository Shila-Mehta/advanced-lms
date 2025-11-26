'use client';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchCourses, setFilter } from '@/redux/slices/courseSlice';
import { Course } from '@/types/course';

const CoursesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses, loading, error, filter } = useAppSelector((state) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(filter.search.toLowerCase())
  );

  const calculateCourseProgress = (course: Course) => {
    // if (!course.students?.length) return 0;
    
    const totalStudentProgress = course.students.reduce((sum: number, student: { progress: { filter: (arg0: (p: any) => any) => { (): any; new(): any; length: number; }; }; }) => {
      const completedLessons = student.progress?.filter(p => p.completed).length || 0;
      const totalLessons = course.lessons?.length || 1;
      return sum + (completedLessons / totalLessons) * 100;
    }, 0);
    
    return Math.round(totalStudentProgress / course.students.length);
  };

  const calculateAverageProgress = () => {
    if (courses.length === 0) return 0;
    
    const totalProgress = courses.reduce((sum, course) => {
      return sum + calculateCourseProgress(course);
    }, 0);
    
    return Math.round(totalProgress / courses.length);
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.students?.length || 0), 0);
  const publishedCourses = courses.filter(c => c.isPublished).length;

  const handleViewAnalytics = (course:Course) => {
    setSelectedCourse(course);
  };

  const closeAnalyticsModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* ===== Page Header ===== */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Overview</h1>
            <p className="text-gray-600 text-lg">Monitor and analyze all courses in one place</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200">
              <span>📊</span>
              Export Report
            </button>
            <button 
              onClick={() => dispatch(fetchCourses())}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
            >
              <span>🔄</span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ===== Statistics Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Total Courses</p>
              <h2 className="text-3xl font-bold text-blue-900">{courses.length}</h2>
            </div>
            <div className="text-2xl">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Published</p>
              <h2 className="text-3xl font-bold text-green-900">{publishedCourses}</h2>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium mb-1">Total Students</p>
              <h2 className="text-3xl font-bold text-orange-900">{totalStudents}</h2>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Avg. Progress</p>
              <h2 className="text-3xl font-bold text-purple-900">{calculateAverageProgress()}%</h2>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
      </div>

      {/* ===== Search & Filters ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search courses by title, instructor, or category..."
                value={filter.search}
                onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              onChange={(e) => {
                const val = e.target.value;
                const published = val === 'published' ? true : val === 'draft' ? false : undefined;
                dispatch(setFilter({ published } as any));
              }}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            
            <select 
              onChange={(e) => dispatch(setFilter({ category: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== Courses Table ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500 text-lg mb-2">❌ {error}</div>
            <button 
              onClick={() => dispatch(fetchCourses())}
              className="text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses?.map((course) => (
                <tr 
                  key={course.id} 
                  className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewAnalytics(course)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={course.courseImage || "/images/default-course.png"} 
                        alt={course.title}
                        className="w-12 h-12 rounded-xl object-cover mr-4 border border-gray-200"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.category || 'Uncategorized'} • {course.instructors?.length || 0} instructors
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {course.students?.length || 0}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${calculateCourseProgress(course)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {calculateCourseProgress(course)}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.isPublished ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        ✅ Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        ⏸️ Draft
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAnalytics(course);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                    >
                      View Analytics →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-2">No courses found</p>
            <button 
              onClick={() => dispatch(setFilter({ search: '', published: undefined, category: '' } as any))}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ===== Analytics Modal ===== */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCourse.title} Analytics
                </h3>
                <button 
                  onClick={closeAnalyticsModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCourse.students?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Average Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateCourseProgress(selectedCourse)}%
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Progress Distribution</h4>
                <div className="space-y-2">
                  {['0-25%', '26-50%', '51-75%', '76-100%'].map((range) => (
                    <div key={range} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{range}</span>
                      <span className="text-sm font-medium text-gray-900">0 students</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-end gap-3">
                <button 
                  onClick={closeAnalyticsModal}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;