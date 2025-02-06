// src/routes/guards.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// 用戶路由保護
export const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem('username');
  return username ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// 管理員路由保護
export const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired
};