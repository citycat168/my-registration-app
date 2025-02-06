// src/components/EmailVerification.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        console.log('Verifying token:', token);

        if (!token) {
            console.log('No token found');
            setStatus('error');
            return;
          }
         
        // 如果已經驗證成功，不要重複驗證
        if (status === 'success') {
          return;
        }

        const response = await api.verifyEmail(token);
        console.log('Verification response:', response);

        if (response.status === 'success') {
          setStatus('success');
          // 立即導向登入頁面
          navigate('/login', { 
            state: { 
              message: '帳號驗證成功！請登入系統。' 
            } 
          });
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
}, [searchParams, navigate, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        {status === 'verifying' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">驗證中...</h2>
            <p className="text-gray-600">請稍候，正在驗證您的電子郵件</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">驗證成功！</h2>
            <p className="text-gray-600">您的帳號已成功啟用，即將導向登入頁面...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">驗證失敗</h2>
            <p className="text-gray-600">驗證連結可能已過期或無效</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              返回登入頁面
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;