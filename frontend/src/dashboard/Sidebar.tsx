import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // or sessionStorage.removeItem if used
    navigate('/login'); // redirect to login page
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-4 rounded hover:bg-blue-500 hover:text-white ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700'}`;

  return (
    <div className={`fixed top-0 left-0 h-full ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md p-4 transition-all duration-300`}>
      <h2 className={`text-xl font-bold text-black mb-6 ${isCollapsed ? 'hidden' : ''}`}>Dashboard</h2>
      <nav className="space-y-2">
        <NavLink to="/dashboard/home" className={linkClasses}>Home</NavLink>
        <NavLink to="/dashboard/users" className={linkClasses}>Users</NavLink>
        <NavLink to="/dashboard/socket" className={linkClasses}>Socket Screen</NavLink>
        <NavLink to="/dashboard/settings" className={linkClasses}>Settings</NavLink>

        {/* 🔓 Logout Button */}
        <button
          onClick={handleLogout}
          className="block w-full text-left py-2 px-4 rounded text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
