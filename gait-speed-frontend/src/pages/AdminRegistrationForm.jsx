// src/pages/AdminRegistrationForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function AdminRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    organization: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // 驗證密碼匹配
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致');
      setIsSubmitting(false);
      return;
    }

    // 驗證手機號碼格式
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('請輸入有效的手機號碼（格式：09xxxxxxxx）');
      setIsSubmitting(false);
      return;
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('請輸入有效的電子郵件地址');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.registerAdmin(formData);
      
      if (response.status === 'success') {
        alert('管理員註冊申請已提交，請等待系統管理員審核。');
        navigate('/admin/verify', {
          state: { username: formData.username }
        });
      } else {
        throw new Error(response.message || '註冊失敗');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || '註冊過程中發生錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <style>
          {`
            .required-field::after {
              content: '*';
              color: #EF4444;
              margin-left: 4px;
            }
          `}
        </style>
        
        <div className="text-center">
          <div className="flex flex-col items-center">
            <img
              className="h-20 w-auto mb-6 transform hover:scale-105 transition-transform duration-200"
              src="/logo.png"
              alt="KneeHow健康"
            />
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold text-gray-900">KneeHow健康</h2>
              <h2 className="text-3xl font-bold text-gray-900">步態管理系統</h2>
            </div>
            <h3 className="mt-4 text-xl text-gray-600">管理員註冊申請</h3>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4 text-sm text-gray-500">
            <span className="text-red-500">*</span> 為必填欄位
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 required-field">
                帳號
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="請輸入3-20個字符的帳號"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">至少3個字符，最多20個字符</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 required-field">
                申請人姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="請輸入真實姓名"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 required-field">
                機關單位
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                required
                placeholder="請輸入您的服務單位"
                value={formData.organization}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 required-field">
                聯絡電話
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="09xxxxxxxx"
                pattern="^09\d{8}$"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">請輸入09開頭的10位數字</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 required-field">
                電子郵件
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">請輸入有效的電子郵件地址</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 required-field">
                密碼
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="請輸入6位以上的密碼"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">密碼長度至少6個字符</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 required-field">
                確認密碼
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="請再次輸入密碼"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">請確保與上方輸入的密碼相同</p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? '提交中...' : '提交申請'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/admin/login')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              返回登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegistrationForm;