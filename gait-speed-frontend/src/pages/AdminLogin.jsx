import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    token: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 處理忘記密碼
  const handleForgotPassword = async (username) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.requestAdminPasswordReset(username);
      if (response.status === 'success') {
        setSuccessMessage('重設密碼連結已發送至您的信箱，請查收');
      }
    } catch (error) {
      setError(error.message || '無法發送重設密碼信件，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 處理驗證碼驗證
  const handleVerification = async (token) => {
    try {
      setError('');
      setIsLoading(true);
      
      const response = await api.verifyAdminToken({
        username: formData.username,
        token: token
      });
      
      if (response.status === 'success') {
        const loginResponse = await api.adminLogin({
          username: formData.username,
          password: formData.password,
          token: token
        });

        if (loginResponse.status === 'success') {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminToken', loginResponse.token);
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || '驗證失敗，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    const token = e.target.value;
    setFormData(prev => ({ ...prev, token }));
    
    if (token.length === 64) {
      handleVerification(token);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await api.adminLogin({
        username: formData.username,
        password: formData.password,
        token: formData.token || ''
      });
      
      if (response.requireToken) {
        setShowTokenInput(true);
        setError('首次登入需要驗證碼，請輸入管理員提供的驗證碼');
        setIsLoading(false);
        return;
      }
      
      if (response.status === 'success') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', response.token);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || '帳號或密碼錯誤');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || '登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
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
                KneeHow健康步態管理系統
              </h2>
            </div>
            <h3 className="mt-4 text-xl text-gray-600">
              管理員登入
            </h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {successMessage && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                帳號
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {showTokenInput && (
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  驗證碼
                </label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required={showTokenInput}
                  value={formData.token}
                  onChange={handleTokenChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="請輸入管理員提供的驗證碼"
                />
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? '登入中...' : '登入'}
              </button>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => navigate('/admin/register')}
                  className="text-blue-600 hover:text-blue-500"
                >
                  註冊新帳號
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.username) {
                      handleForgotPassword(formData.username);
                    } else {
                      setError('請輸入帳號以重設密碼');
                    }
                  }}
                  className="text-blue-600 hover:text-blue-500"
                >
                  忘記密碼？
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;