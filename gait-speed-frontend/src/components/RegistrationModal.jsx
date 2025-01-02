import { useState } from 'react';
import PropTypes from 'prop-types';

const RegistrationModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    birthdate: '2000-01-01',
    gender: '',
    phone: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // 前端基本驗證
      const validationErrors = [];
      
      if (!formData.username || formData.username.length < 3) {
        validationErrors.push('用戶名至少需要3個字符');
      }

      if (!formData.name || formData.name.length < 2) {
        validationErrors.push('姓名至少需要2個字符');
      }

      if (!formData.password || formData.password.length < 6) {
        validationErrors.push('密碼至少需要6個字符');
      }

      if (formData.password !== formData.confirmPassword) {
        validationErrors.push('兩次密碼輸入不一致');
        return;
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          birthdate: formData.birthdate,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          organization: formData.organization,
          password: formData.password
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('新增用戶成功！');
        onRegisterSuccess(); // 重新獲取用戶列表
        onClose(); // 關閉 Modal
        
        // 重置表單
        setFormData({
          username: '',
          name: '',
          birthdate: '2000-01-01',
          gender: '',
          phone: '',
          email: '',
          organization: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(result.message || '新增失敗');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('新增失敗: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">新增用戶</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {errors.length > 0 && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  出現以下錯誤：
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用戶名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 required-field">
              用戶名
            </label>
            <input
              type="text"
              required
              placeholder="帳號名稱"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 required-field">
              姓名
            </label>
            <input
              type="text"
              required
              placeholder="全名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 生日 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 required-field">
              生日
            </label>
            <input
              type="date"
              required
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 性別 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              性別
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 required-field">
              手機
            </label>
            <input
              type="tel"
              required
              placeholder="09XXXXXXXX"
              pattern="^09\d{8}$"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              請輸入09開頭的10位數字
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 機關單位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              機關單位
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 required-field">
              密碼
            </label>
            <input
              type="password"
              required
              placeholder="請輸入密碼"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 確認密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 required-field">
              確認密碼
            </label>
            <input
              type="password"
              required
              placeholder="請再次輸入密碼"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400"
            >
              {isSubmitting ? '處理中...' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRegisterSuccess: PropTypes.func.isRequired
};

export default RegistrationModal;