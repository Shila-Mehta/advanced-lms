'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  // Common navigation items for all roles
  const commonNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Calendar', href: '/dashboard/calendar', icon: '📅' },
    { name: 'Messages', href: '/dashboard/messages', icon: '💬' },
  ];

  // Role-specific navigation items
  const roleNavItems = {
    student: [
      { name: 'My Learning', href: '/dashboard/learning', icon: '🎓' },
      { name: 'Assignments', href: '/dashboard/assignments', icon: '📝' },
      { name: 'Grades', href: '/dashboard/grades', icon: '🏆' },
      { name: 'Study Groups', href: '/dashboard/groups', icon: '👥' },
    ],
    instructor: [
      { name: 'My Courses', href: '/dashboard/teaching', icon: '👨‍🏫' },
      { name: 'Students', href: '/dashboard/students', icon: '👥' },
      { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
      { name: 'Create Course', href: '/dashboard/create-course', icon: '➕' },
    ],
    admin: [
      { name: 'User Management', href: '/dashboard/users', icon: '👥' },
      { name: 'Courses', href: '/dashboard/courses', icon: '📚' },
      { name: 'Course Management', href: '/dashboard/course-management', icon: '📋' },
      { name: 'Create Course', href: '/dashboard/create-course', icon: '➕' },
      { name: 'System Settings', href: '/dashboard/settings', icon: '⚙️' },
      { name: 'Reports', href: '/dashboard/reports', icon: '📊' },
      { name: 'Billing', href: '/dashboard/billing', icon: '💰' },
    ],
  };

  const navItems = [
    ...commonNavItems,
    ...(roleNavItems[user?.role as keyof typeof roleNavItems] || []),
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'instructor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar for desktop and mobile */}
      <div
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-40 bg-white shadow-lg transition-all duration-300 flex flex-col h-full
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                LMS
              </div>
              <h1 className="text-xl font-bold text-gray-800">EduPlatform</h1>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto">
              L
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 hidden lg:block"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="font-medium truncate">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Link
            href="/dashboard/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-lg">👤</span>
            {sidebarOpen && <span className="font-medium">Profile</span>}
          </Link>
          
          <Link
            href="/dashboard/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-lg">⚙️</span>
            {sidebarOpen && <span className="font-medium">Settings</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.role === 'student' && 'Learning Dashboard'}
                {user?.role === 'instructor' && 'Teaching Dashboard'}
                {user?.role === 'admin' && 'Admin Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'student' && 'Continue your learning journey'}
                {user?.role === 'instructor' && 'Manage your courses and students'}
                {user?.role === 'admin' && 'Manage platform and users'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {/* Messages */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <span className="text-xl">💬</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User avatar for mobile */}
              <div className="lg:hidden w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div>
              © 2024 EduPlatform. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <button className="hover:text-gray-900">Help</button>
              <button className="hover:text-gray-900">Privacy</button>
              <button className="hover:text-gray-900">Terms</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;