const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
console.log('API URL:', API_URL);

export const api = {
  // 獲取所有用戶列表
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      console.log('Fetching all users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // 獲取用戶數據（步速歷史）
  getUserData: async (username) => {
    try {
      const response = await fetch(`${API_URL}/user-data/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // 提交步速數據
  submitGaitSpeed: async (data) => {
    try {
      const response = await fetch(`${API_URL}/gait-speed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 獲取用戶資料
  getUserProfile: async (username) => {
    try {
      const response = await fetch(`${API_URL}/user-profile/${username}`);
      if (!response.ok) {
        throw new Error('獲取用戶資料失敗');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 更新用戶資料
  updateUserProfile: async (data) => {
    try {
      const response = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新資料失敗');
      }
      
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 一般用戶登入
  login: async (loginData) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // 管理員登入
  adminLogin: async (loginData) => {
    try {
      console.log('Attempting admin login with data:', loginData);
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Admin login response:', data);

      if (!response.ok) {
        throw new Error(data.message || '登入失敗');
      }

      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // 管理員密碼重設相關
  requestAdminPasswordReset: async (username) => {
    try {
      const response = await fetch(`${API_URL}/admin/request-reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '請求重設密碼失敗');
      }
      return data;
    } catch (error) {
      console.error('Reset password request error:', error);
      throw error;
    }
  },

  resetAdminPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '重設密碼失敗');
      }
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // 註冊管理員
  registerAdmin: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || '註冊失敗');
      }
      return result;
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  },

  // 驗證管理員 Token
  verifyAdminToken: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Token 驗證失敗');
      }
      return result;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  // 獲取所有管理員列表
  getAllAdmins: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 更新管理員資料
  updateAdmin: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 刪除管理員
  deleteAdmin: async (adminId) => {
    try {
      const response = await fetch(`${API_URL}/admin/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Email 驗證
  verifyEmail: async (token) => {
    try {
      console.log('Attempting to verify email with token:', token);
      console.log('Verification URL:', `${API_URL}/verify-email/${token}`);

      const response = await fetch(`${API_URL}/verify-email/${token}`, {
        method: 'GET'
      });

      if (!response.ok) {
        console.log('Verification response not ok:', response.status);
        throw new Error('驗證失敗');
      }
      const data = await response.json();
      console.log('Verification response:', data);
      return data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  // 刪除緩存
clearAdminCache: async () => {
  try {
    const response = await fetch(`${API_URL}/admin/clear-cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('清除緩存失敗');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Clear cache error:', error);
    throw error;
  }
}
};

export default api;