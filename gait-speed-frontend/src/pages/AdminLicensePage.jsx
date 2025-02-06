// src/pages/AdminLicensePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function AdminLicensePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    token: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.verifyAdminToken(formData);
      if (response.status === 'success') {
        alert('授權驗證成功！請前往登入頁面登入。');
        navigate('/admin/login');
      }
    } catch (error) {
      setError(error.message || '驗證失敗，請確認帳號和授權碼是否正確');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-20 w-auto"
            src="/logo.png"
            alt="KneeHow健康"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            管理員授權驗證
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">帳號</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="請輸入註冊的帳號"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
              />
            </div>
            <div>
              <label htmlFor="token" className="sr-only">授權碼</label>
              <input
                id="token"
                name="token"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="請輸入系統管理員提供的授權碼"
                value={formData.token}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  token: e.target.value
                }))}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? '驗證中...' : '驗證授權'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/admin/login')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            返回登入
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLicensePage;