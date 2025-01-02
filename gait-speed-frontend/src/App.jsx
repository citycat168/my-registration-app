import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Layout from './components/Layout';
import RegistrationForm from './components/RegistrationForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './components/AdminLogin';

// 添加用戶路由保護組件
const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem('username');
  return username ? children : <Navigate to="/login" replace />;
};

// 添加 PropTypes 驗證
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// 管理員路由保護組件
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// 路由配置
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <RegistrationForm />
      },
      {
        path: "dashboard",
        element:(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "admin/login",
        element: <AdminLogin />
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;