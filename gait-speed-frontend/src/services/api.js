const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
   // 獲取所有用戶列表
   getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
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
      const response = await fetch(`${API_BASE_URL}/user-data/${username}`);
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
      const response = await fetch(`${API_BASE_URL}/gait-speed`, {
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
  // 獲取用戶數據
  getUserProfile: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/${username}`);
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
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
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

  // 更新用戶檔案
  updateProfile: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Profile update result:', result);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};