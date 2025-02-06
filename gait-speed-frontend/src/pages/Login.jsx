import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';

function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 處理忘記密碼
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setResetMessage('');

    try {
      if (!loginData.username) {
        setError('請輸入帳號以重設密碼');
        setIsSubmitting(false);
        return;
      }

      const response = await api.requestPasswordReset(loginData.username);
      
      if (response.status === 'success') {
        setResetMessage('重設密碼郵件已發送到您的信箱，請查收！');
        setIsForgotPassword(false);
      } else {
        throw new Error(response.message || '重設密碼請求失敗');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || '重設密碼請求失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!loginData.username || (!isForgotPassword && !loginData.password)) {
        setError('請填寫所有必填欄位');
        setIsSubmitting(false);
        return;
      }

      if (isForgotPassword) {
        return handleForgotPassword(e);
      }

      const response = await api.login(loginData);

      if (response.status === 'success') {
        localStorage.setItem('username', loginData.username);
        navigate('/dashboard');
      } else {
        throw new Error(response.message || '登入失敗');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || '登入失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <img
              className="h-20 w-auto mb-6 transform hover:scale-105 transition-transform duration-200"
              src="/logo.png"
              alt="KneeHow健康"
            />
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-gray-900">
                KneeHow健康
              </h2>
            </div>
            <h3 className="mt-4 text-xl text-gray-600">
              {isForgotPassword ? '重設密碼' : '會員登入'}
            </h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {location.state?.message && (
            <div className="mb-4 p-4 bg-green-50 rounded-md text-green-700">
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {resetMessage && (
            <div className="mb-4 p-4 bg-green-50 rounded-md">
              <p className="text-green-700 text-sm">{resetMessage}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                用戶名稱
              </label>
              <input
                id="username"
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密碼
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (isForgotPassword ? '發送中...' : '登入中...') 
                  : (isForgotPassword ? '發送重設密碼郵件' : '登入')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(!isForgotPassword);
                  setError('');
                  setResetMessage('');
                  setLoginData(prev => ({ ...prev, password: '' }));
                }}
                className="ml-4 text-sm text-blue-600 hover:text-blue-500"
              >
                {isForgotPassword ? '返回登入' : '忘記密碼？'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 flex justify-between">
          <Link 
            to="/register" 
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            註冊新帳號
          </Link>
          <Link 
            to="/admin/login" 
            className="text-sm text-gray-600 hover:text-gray-500"
          >
            管理員入口
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;