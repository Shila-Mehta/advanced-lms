// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import InstructorDashboard from '@/components/dashboard/InstructorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Please log in to view dashboard</div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return renderDashboard();
};

export default DashboardPage;