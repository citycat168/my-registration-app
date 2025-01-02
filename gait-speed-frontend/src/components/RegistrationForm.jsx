import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    birthdate: '2000-01-01',
    gender: '',  // 添加性別
    phone: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // 前端基本驗證
      const validationErrors = [];
      
      // 驗證必填欄位
      if (!formData.username || formData.username.length < 3) {
        validationErrors.push('用戶名至少需要3個字符');
      }

      if (!formData.name || formData.name.length < 2) {
        validationErrors.push('姓名至少需要2個字符');
      }

      // 添加 Email 驗證
      if (!formData.email) {
        validationErrors.push('電子郵件為必填欄位');
      } else {
        // Email 格式驗證
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          validationErrors.push('請輸入有效的電子郵件地址');
        }
      }

      if (!formData.password || formData.password.length < 6) {
        validationErrors.push('密碼至少需要6個字符');
      }

      // 密碼確認
      if (formData.password !== formData.confirmPassword) {
        alert('兩次密碼輸入不一致');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // 資料登錄後台資料庫
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          birthdate: formData.birthdate,
          gender: formData.gender,  // 添加性別
          phone: formData.phone,
          email: formData.email,
          organization: formData.organization,
          password: formData.password
        })
      });

      const result = await response.json();

      // 在這裡添加提交邏輯
      if (result.status === 'success') {
        alert('註冊成功！');
        navigate('/login');
      } else {
        throw new Error(result.message || '註冊失敗');
      }
  
    } catch (error) {
      console.error('Registration error:', error);
      alert('註冊失敗: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src="/logo.png"
              alt="步速記錄系統 Logo"
              className="h-16 w-auto mb-4"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            註冊新帳號
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 錯誤訊息顯示 */}
          {errors.length > 0 && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    註冊出現以下錯誤：
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 用戶名 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 required-field">
              用戶名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="你的帳號名稱"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* 姓名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 required-field">
              姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="全名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* 生日 */}
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 required-field">
              生日
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              required
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* 性別 */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              性別
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            >
              <option value="">請選擇</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          {/* 手機 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 required-field">
              手機
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="09XXXXXXXX"
              pattern="^09\d{8}$"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              請輸入09開頭的10位數字
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 required-field">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="XXXXX@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* 機關單位 */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              機關單位
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* 密碼 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 required-field">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="請輸入密碼"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          {/* 確認密碼 */}
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
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isSubmitting ? '註冊中...' : '註冊'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              已有帳號？立即登入
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;