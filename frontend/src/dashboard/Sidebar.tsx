import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaComments, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700'
    }`;

  return (
    <div
      className={`fixed top-0 left-0 h-full ${isCollapsed ? 'w-16' : 'w-64'
        } bg-white shadow-md p-4 transition-all duration-300`}
    >
      {!isCollapsed && (
        <h2 className="text-xl font-bold text-black mb-6">Dashboard</h2>
      )}
      <nav className="space-y-2">
        <NavLink to="/dashboard/home" className={linkClasses}>
          <FaHome />
          {!isCollapsed && 'Home'}
        </NavLink>
        <NavLink to="/dashboard/users" className={linkClasses}>
          <FaUsers />
          {!isCollapsed && 'Users'}
        </NavLink>
        <NavLink to="/dashboard/socket" className={linkClasses}>
          <FaComments />
          {!isCollapsed && 'Socket Screen'}
        </NavLink>
        <NavLink to="/dashboard/settings" className={linkClasses}>
          <FaCog />
          {!isCollapsed && 'Settings'}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left py-2 px-4 rounded text-red-600 hover:bg-red-100 transition-colors"
        >
          <FaSignOutAlt />
          {!isCollapsed && 'Logout'}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
