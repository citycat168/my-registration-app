// src/pages/AdminVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

function AdminVerification() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // 新增
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

    // 從 state 或 URL 參數獲取 username
    const username = location.state?.username || searchParams.get('username');
 
    // 檢查是否為超級管理員
    useEffect(() => {
    const checkSuperAdmin = () => {
      const isAdmin = localStorage.getItem('isAdmin');
      const adminToken = localStorage.getItem('adminToken');
      // 這裡可以添加更多的驗證邏輯
      setIsSuperAdmin(!!(isAdmin && adminToken));
    };
    checkSuperAdmin();
  }, []);

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.verifyAdminToken({
        username,
        token
      });

      if (response.status === 'success') {
        if (isSuperAdmin) {
            // 如果是超級管理員驗證其他管理員
            navigate('/admin/dashboard', {
              state: { message: '管理員驗證成功' }
            });
          } else {
        // 如果是管理員自己驗證
        navigate('/admin/login', {
          state: { message: '驗證成功，請登入系統' }
        });
      }
    }
    } catch (error) {
      setError(error.message || '驗證失敗，請重試');
    } finally {
      setIsLoading(false);
    }
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
        <img
            className="mx-auto h-20 w-auto mb-6"
            src="/logo.png"
            alt="KneeHow健康"
          />
          <h2 className="text-xl text-red-600">無效的訪問</h2>
          <p className="text-gray-600 mb-4">
            無法找到用戶資訊，請確保您是從註冊確認郵件中的連結訪問此頁面。
          </p>
          <button
            onClick={() => navigate('/admin/register')}
            className="text-blue-600 hover:text-blue-500"
          >
            返回註冊頁面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <img
              className="h-20 w-auto mb-6"
              src="/logo.png"
              alt="KneeHow健康"
            />
            <h2 className="text-3xl font-bold text-gray-900">
            {isSuperAdmin ? '管理員帳號授權' : '管理員帳號驗證'}
            </h2>
            <p className="mt-4 text-gray-600">
            {isSuperAdmin 
                ? '請輸入驗證碼以授權此管理員帳號' 
                : '請輸入管理員提供的驗證碼以完成帳號驗證'}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                驗證碼
              </label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="請輸入驗證碼"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? '驗證中...' : '驗證帳號'}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            尚未收到驗證碼？請聯繫系統管理員
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminVerification;