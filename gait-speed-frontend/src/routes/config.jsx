// src/routes/config.jsx
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RegistrationForm from '../components/RegistrationForm';
import EmailVerification from '../components/EmailVerification';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import AdminResetPassword from '../pages/AdminResetPassword';
import AdminVerification from '../pages/AdminVerification';
import AdminManagementPage from '../pages/AdminManagementPage';
import AdminRegistrationForm from '../pages/AdminRegistrationForm';  // 添加這行
import NotFound from '../pages/NotFound';
import ResetPassword from '../pages/ResetPassword';  // 添加這行
import { ProtectedRoute, AdminRoute } from './guards';

// 錯誤邊界組件
const ErrorBoundary = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <img
          className="mx-auto h-20 w-auto mb-6"
          src="/logo.png"
          alt="KneeHow健康"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">頁面發生錯誤</h1>
        <p className="text-gray-600 mb-8">抱歉，請稍後再試。</p>
        <a href="/" className="text-blue-600 hover:text-blue-500">
          返回首頁
        </a>
      </div>
    </div>
  );
};

export const routesConfig = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin/login" replace />
      },
      {
        path: "user/login", //一般用戶登入路徑
        element: <Login />
      },
      {
        path: "register",
        element: <RegistrationForm />
      },
      {
        path: "verify-email",
        element: <EmailVerification />
      },
      {
        path: "reset-password",  
        element: <ResetPassword />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/verify",  // 新增管理員驗證頁面路由
        element: <AdminVerification />
      },
      {
        path: "admin/management",
        element: (
          <AdminRoute>
            <AdminManagementPage />
          </AdminRoute>
        )
      },
      {
        path: "admin/login",
        element: <AdminLogin />
      },
      {
        path: "admin/reset-password",  // 添加這個路由
        element: <AdminResetPassword />
      },
      {
        path: "admin/register",  // 添加管理員註冊路由
        element: <AdminRegistrationForm />
      },
      {
        path: "admin/dashboard", // 修改路徑
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
];