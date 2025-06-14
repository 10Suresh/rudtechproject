import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import API from '../api';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface User {
  id?: string;
  email?: string;
  name?: string;
}

const DashboardLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }

    // Decode right away
    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
      setUser({ id: decoded.id, email: decoded.email, name: decoded.name });
    } catch (e) {
      console.error('Invalid token:', e);
      setError('Invalid token');
      return;
    }

    // Then verify with backend
    API.get<{ user: User }>('/auth/current', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUser(res.data.user))
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setError(err.response?.data?.message || 'Failed to fetch user');
      });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={false} />
      <main className="flex-1 p-6 bg-gray-100 transition-all duration-300 ml-64">
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-4 shadow-sm">
          👋 Welcome back,{' '}
          <strong>{user?.name || user?.email || 'User'}</strong>!
        </div>
        {error && (
          <div className="text-red-500 mb-4">⚠️ {error}</div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
