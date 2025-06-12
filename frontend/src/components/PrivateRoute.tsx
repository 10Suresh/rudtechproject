import React from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
