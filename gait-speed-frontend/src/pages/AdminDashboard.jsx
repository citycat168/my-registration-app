import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import SpeedGauge from '../components/SpeedGauge';
import UserListItem from '../components/UserListItem';  
import SpeedHistoryChart from '../components/SpeedHistoryChart';
import UserListModal from '../components/UserListModal';
import RegistrationModal from '../components/RegistrationModal';  // 新增
import UserEditModal from '../components/UserEditModal';  // 新增
import ExportCSVButton from '../components/ExportCSVButton';
import { api } from '../services/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState({ mean: 0, stdev: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalStats, setGlobalStats] = useState({ mean: 0, stdev: 0 });
  const [showUserList, setShowUserList] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);  // 新增
  const [gaitSpeed, setGaitSpeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  // 獨立的統計計算函數
  const calculateStats = (data) => {
    if (!data || data.length === 0) return { mean: 0, stdev: 0 };

    const speeds = data.map(d => Number(d.speed));
    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    
    if (speeds.length === 1) {
      return { 
        mean: Number(mean.toFixed(2)), 
        stdev: 0 
      };
    }

    const squareDiffs = speeds.map(speed => Math.pow(speed - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / (speeds.length - 1);
    const stdev = Math.sqrt(avgSquareDiff);

    return {
      mean: Number(mean.toFixed(2)),
      stdev: Number(stdev.toFixed(2))
    };
  };

  // 獲取所有用戶
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.getAllUsers();
      
      if (result.status === 'success') {
        // 獲取每個用戶的完整資料（包括頭像）
        const usersWithProfiles = await Promise.all(
          result.data.map(async (user) => {
            try {
              const profileResult = await api.getUserProfile(user.username);
              return {
                ...user,
                avatar: profileResult.status === 'success' ? profileResult.data.avatar : null
              };
            } catch (error) {
              console.error(`Error fetching profile for ${user.username}:`, error);
              return user;
            }
          })
        );
        
        setUsers(usersWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('獲取用戶列表失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 添加獲取全局統計數據的函數
  const fetchGlobalStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/speed-stats');
      const result = await response.json();
      
      if (result.status === 'success') {
        setGlobalStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching global stats:', error);
    }
  }, []);

  // 獲取特定用戶數據
  const fetchUserData = useCallback(async (username) => {
    if (!username) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // 從現有的 users 列表中獲取用戶信息
      const currentUser = users.find(user => user.username === username);
      
      if (!currentUser) {
        throw new Error('無法找到用戶信息');
      }
      
      // 並行獲取用戶數據和配置
      const [dataResult, profileResult] = await Promise.all([
        api.getUserData(username),
        api.getUserProfile(username)
      ]);
      
      if (dataResult.status === 'success') {
        // 處理所有數據，但不做截取
        const processedData = dataResult.data
          .map(item => ({
            ...item,
            date: format(new Date(item.date), 'yyyy-MM-dd'),
            speed: Number(parseFloat(item.speed).toFixed(2))
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))

        // 設置用戶數據，保存完整歷史並分開存儲顯示數據
        setSelectedUser({
          ...currentUser, // 包含完整的用戶信息（name, organization 等）
          data: processedData,   // 保存完整歷史數據
          displayData: processedData.slice(-6),   // 只顯示最後6筆
          avatar: profileResult.status === 'success' ? profileResult.data.avatar : null
        });

        // 使用完整數據計算統計
        setUserStats(calculateStats(processedData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('獲取用戶數據失敗');
    
      // 即使出錯也保留基本用戶信息
      const currentUser = users.find(user => user.username === username);
      setSelectedUser(currentUser ? {  
        ...currentUser, // 錯誤情況下也保留用戶基本信息
        data: [],
        displayData: [],
        avatar: null
      } : {
        username,
        data: [],
        displayData: [],
        avatar: null
      });
      setUserStats({ mean: 0, stdev: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [users]); // 添加 users 作為依賴

// 添加提交步速的處理函數
const handleSubmitSpeed = async (e) => {
  e.preventDefault();
  if (!selectedUser) return;

  setIsSubmitting(true);
  try {
    const data = {
      username: selectedUser.username,
      date: format(new Date(), 'yyyy-MM-dd'),
      speed: Number(parseFloat(gaitSpeed).toFixed(2))
    };

    const result = await api.submitGaitSpeed(data);
    
    if (result.status === 'success') {
      setGaitSpeed(''); // 清空輸入
      alert('步速提交成功！');
      // 重新獲取用戶數據
      await fetchUserData(selectedUser.username);
    } else {
      throw new Error(result.message || '提交失敗');
    }
  } catch (error) {
    console.error('Error submitting speed:', error);
    alert('提交失敗：' + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

// 添加編輯和刪除處理函數
const handleEditUser = (user) => {
  setEditingUser(user);
  setShowEditModal(true);
};

const handleDeleteUser = async (username) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      alert('用戶已成功刪除');
      fetchUsers(); // 重新獲取用戶列表
      if (selectedUser?.username === username) {
        setSelectedUser(null); // 清除選中的用戶
      }
    } else {
      throw new Error(result.message || '刪除失敗');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('刪除失敗：' + error.message);
  }
};

// 處理用戶資料更新
const handleSaveUser = async (userData) => {
  try {
    // 使用現有的 updateProfile 方法
    const result = await api.updateProfile(userData);
    
    if (result.status === 'success') {
      alert('用戶資料已更新');
      setShowEditModal(false);
      fetchUsers(); // 重新獲取用戶列表
      if (selectedUser?.username === userData.username) {
        fetchUserData(userData.username); // 更新當前顯示的用戶資料
      }
    } else {
      throw new Error(result.message || '更新失敗');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    alert('更新失敗：' + error.message);
  }
};

  // 初始加載
  useEffect(() => {
    fetchUsers();
    fetchGlobalStats();
    const interval = setInterval(() => {
      fetchUsers();
      fetchGlobalStats();
    }, 5*60*1000); // 每5分鐘更新一次
    return () => clearInterval(interval);
  }, [fetchUsers, fetchGlobalStats]);

  // 渲染載入狀態
  if (isLoading && users.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl text-gray-600">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* 左側用戶列表 */}
      <div className="w-1/4 bg-white shadow-lg p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">用戶列表</h2>
          <button
            onClick={() => setShowRegistrationModal(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {users.map(user => (
            <UserListItem
              key={user.username}
              user={user}
              isSelected={selectedUser?.username === user.username}
              isLoading={isLoading}
              onClick={fetchUserData}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      </div>
  
      {/* 右側內容區域 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* 頂部導航列 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png"
              alt="步速記錄系統 Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800">步態管理儀表板</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowUserList(true)}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              用戶資料清單
            </button>
            <button
               onClick={() => {
                // 清除管理員登入狀態
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('adminToken');
                // 導航到管理員登入頁面
                navigate('/admin/login');
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
            >
              登出
            </button>
          </div>
        </div>
  
        {/* 錯誤提示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
  
        {/* 統計數據區域 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 全體用戶步速統計 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">全體用戶步速統計</h2>
            <SpeedGauge speed={globalStats.mean} deviation={globalStats.stdev} />
          </div>
  
          {/* 個人用戶數據區域 */}
          <div className={`bg-white rounded-lg shadow-lg p-6 ${!selectedUser && 'flex items-center justify-center'}`}>
            {selectedUser ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  {/* 用戶頭像 */}
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                    {selectedUser.avatar ? (
                      <img 
                        src={selectedUser.avatar} 
                        alt={`${selectedUser.name || selectedUser.username}的頭像`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 text-xl font-semibold">
                          {(selectedUser.name || selectedUser.username).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedUser.name || selectedUser.username} 的步速數據
                    </h2>
                    {selectedUser.name && (
                      <p className="text-sm text-gray-500">
                        帳號：{selectedUser.username}
                      </p>
                    )}
                  </div>
                </div>
                <SpeedGauge speed={userStats.mean} deviation={userStats.stdev} />
                
                {/* 新增步速提交表單 */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">新增步速記錄</h3>
                  <form onSubmit={handleSubmitSpeed} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        步速（公尺/秒）
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5"
                        value={gaitSpeed}
                        onChange={(e) => setGaitSpeed(e.target.value)}
                        placeholder="例如: 1.23"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">請輸入到小數點後第二位，例如：1.23 公尺/秒</p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                      {isSubmitting ? '提交中...' : '提交步速'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-gray-500">請選擇一位用戶查看數據</div>
            )}
          </div>
        </div>
  
        {/* 個人歷史記錄 */}
        {selectedUser && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium mb-4">步速歷史記錄</h3>
              <ExportCSVButton 
              data={selectedUser.data.map(record => [
                selectedUser.username,
                record.date,
                record.speed
              ])}
              headers={['用戶名', '日期', '步速']}
              filename={`${selectedUser.name || selectedUser.username}_步速歷史記錄.csv`}
            />
          </div> 
            {selectedUser.displayData.length > 0 ? (
              <>
                <div className="text-sm text-gray-500 mb-2">
                  顯示最近 6 筆記錄 (共 {selectedUser.data.length} 筆)
                </div>
              <SpeedHistoryChart data={selectedUser.displayData} />
            </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                尚無記錄
              </div>
            )}
          </div>
        )}
      </div>
  
      {/* Modals */}
      <UserListModal 
        isOpen={showUserList}
        onClose={() => setShowUserList(false)}
        users={users || []} 
      />
      
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegisterSuccess={fetchUsers}
      />

      {/* 添加 Modal */}
    <UserEditModal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      userData={editingUser}
      onSave={handleSaveUser}
    />

    </div>
  );
}

export default AdminDashboard;