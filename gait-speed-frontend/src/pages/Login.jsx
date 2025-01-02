import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 檢查是否已登入
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!loginData.username || !loginData.password) {
        setError('請輸入用戶名和密碼');
        return;
      }

    // 呼叫登入 API
    const response = await api.login(loginData);

    if (response.status === 'success') {
      // 儲存用戶資訊
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登入系統
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密碼
              </label>
              <input
                id="password"
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isSubmitting ? '登入中...' : '登入'}
            </button>
          </div>

          <div className="flex justify-between">
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
        </form>
      </div>
    </div>
  );
}

export default Login;