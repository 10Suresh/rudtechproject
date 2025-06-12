import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

const DashboardLayout: React.FC = () => {
  const [userName, setUserName] = useState<string>('Guest');
  const [isSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const name = decoded.name || decoded.email || 'User';
        setUserName(name);
      }
    } catch (error) {
      console.warn('Invalid or expired token');
      setUserName('Guest');
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <main className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Welcome Message */}
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-4 shadow-sm">
          👋 Welcome back, <strong>{userName}</strong>!
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
