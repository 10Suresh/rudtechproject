import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SocketScreen from './components/SocketScreen';
import PrivateRoute from './components/PrivateRoute';

// Dashboard
import DashboardLayout from './dashboard/DashboardLayout';
import Home from './dashboard/pages/Home';
import Users from './dashboard/pages/Users';
import Settings from './dashboard/pages/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/socket"
          element={
            <PrivateRoute>
              <SocketScreen />
            </PrivateRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path='socket' element={<SocketScreen />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
