import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import SpeedIndicator from '../components/SpeedIndicator';
import SpeedGauge from '../components/SpeedGauge';
import UserAvatar from '../components/UserAvatar';
import SpeedInputForm from '../components/SpeedInputForm';
import SpeedHistoryChart from '../components/SpeedHistoryChart';
import UserEditModal from '../components/UserEditModal';  
import { api } from '../services/api';

// 圖片壓縮功能
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 設置最大尺寸
        const maxSize = 800;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 壓縮為 base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
    };
  });
};

function Dashboard() {
  const [gaitSpeed, setGaitSpeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [fullHistory, setFullHistory] = useState([]); // 添加這行
  const [stats, setStats] = useState({ mean: 0, stdev: 0 });
  const [avatar, setAvatar] = useState(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // 獨立的統計計算函數
  const calculateStats = (data) => {
    if (!data || data.length === 0) return { mean: 0, stdev: 0 };

    const speeds = data.map(d => Number(d.speed));
    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    
    if (data.length === 1) {
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

  // 提交新的步速數據
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        username,
        date: format(new Date(), 'yyyy-MM-dd'),
        speed: Number(parseFloat(gaitSpeed).toFixed(2))
      };

      const result = await api.submitGaitSpeed(data);
      
      if (result.status === 'success') {
        setGaitSpeed('');
        setIsLoading(true);  // 重新設置載入狀態
        await fetchHistory();
      } else {
        throw new Error(result.message || '提交失敗');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('提交失敗：' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

    // 加載用戶頭像的函數
    const loadUserProfile = useCallback(async () => {
      if (!username) return;
  
      try {
    console.log('Loading user profile for:', username);
    const profileResult = await api.getUserProfile(username);
    console.log('Profile result:', profileResult);
    
      if (profileResult.status === 'success' && profileResult.data?.avatar) {
      console.log('Setting avatar:', profileResult.data.avatar);
      setAvatar(profileResult.data.avatar);
      }
    } catch (error) {
    console.error('Error loading user profile:', error);
  }
},[username]);

  // 獲取用戶資料
  const fetchUserProfile = useCallback(async () => {
    try {
      const profileResult = await api.getUserProfile(username);
  
      if (profileResult.status === 'success') {
        // 更新用戶資料
        setUserProfile(profileResult.data);
        // 如果有頭像，也更新頭像狀態
        if (profileResult.data.avatar) {
          setAvatar(profileResult.data.avatar);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [username]); 

  // 獲取歷史數據
  const fetchHistory = useCallback(async () => {
    if (!username) return;
    
    try {
      const result = await api.getUserData(username);
      
      if (result.status === 'success' && Array.isArray(result.data)) {
        // 處理所有數據，按日期排序
        const processedData = result.data
          .map(item => ({
            ...item,
            date: format(new Date(item.date), 'yyyy-MM-dd'),
            speed: Number(parseFloat(item.speed).toFixed(2))
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
  
        // 儲存完整歷史數據
        setFullHistory(processedData);
        // 只顯示最後6筆
        setHistory(processedData.slice(-6));

        // 使用完整數據計算統計
        if (processedData.length > 0) {
          setStats(calculateStats(processedData));
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

   // 處理頭像更新
   const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsUpdatingAvatar(true);
      const compressedImage = await compressImage(file);
      
      const result = await api.updateProfile({
        username,
        avatar: compressedImage
      });

      if (result.status === 'success') {
        console.log('Avatar updated successfully');
        setAvatar(compressedImage);

        // 立即重新加載用戶配置以確保數據同步
        await loadUserProfile();
      } else {
        throw new Error(result.message || '更新頭像失敗');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('更新頭像失敗：' + error.message);
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // 登出處理
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  // 檢查登入狀態和獲取歷史數據
  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

   const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchHistory()
      ]);

    } catch (error) {
      console.error('Error initializing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  loadInitialData();
}, [username, navigate, fetchUserProfile, fetchHistory]);

     // 處理儲存用戶資料
  const handleSaveUserData = async (formData) => {
    try {
        // 確保保留未修改的欄位，並加入所有需要的資料
        const updatedData = {
          ...userProfile,  // 保留現有資料
          ...formData,     // 使用新的表單資料覆蓋
          username,        // 確保包含用戶名
          avatar: userProfile?.avatar // 保持現有頭像
        };

       // 呼叫 API 更新用戶資料
        const result = await api.updateUserProfile(updatedData);

      if (result.status === 'success') {
        // 更新本地狀態
        setUserProfile(result.data);
      
        // 更新頭像顯示（如果有更新的話）
        if (result.data.avatar) {
          setAvatar(result.data.avatar);
        }

        // 添加成功提示
        setIsEditModalOpen(false);
        alert('資料更新成功！');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('更新失敗：' + error.message);
    }
  };

  // 載入指示器
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-gray-600">載入中...</div>
          <div className="mt-2 text-sm text-gray-500">正在獲取數據，請稍候</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
    {/* Logo */}
    <img 
      src="/logo.png"  // 你的 logo 路徑
      alt="步速記錄系統 Logo"
      className="h-10 w-auto"
    />
        <h2 className="text-2xl font-bold text-gray-800">
          步速記錄系統
        </h2>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">   
            <UserAvatar 
              avatar={avatar}
              isUpdating={isUpdatingAvatar}
              onClick={() => fileInputRef.current.click()}
            />
            <div className="text-gray-600">
              用戶：
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {username}
              </button>
              </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
          >
            登出
          </button>
        </div>
      </div>

       {/* 添加 Modal */}
       <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userProfile}
        onSave={handleSaveUserData}
      />

      {/* Speed Input Form */}
      <SpeedInputForm
        gaitSpeed={gaitSpeed}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onChange={(e) => setGaitSpeed(e.target.value)}
      />

 {/* 基礎數據指標 */}
 <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">基本數據</h3>
          <SpeedIndicator mean={stats.mean} stdev={stats.stdev} />
        </div>

        {/* 詳細分析指標 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">步速分析</h3>
          <SpeedGauge speed={stats.mean} deviation={stats.stdev} />
        </div>

        {/* 歷史記錄 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 pt-8 flex justify-between items-center">
            <h3 className="text-lg font-semibold">步速歷史記錄</h3>
            <button
              onClick={fetchHistory}
              className="text-blue-600 hover:text-blue-700 text-sm"
              disabled={isLoading}
            >
              {isLoading ? '載入中...' : '重新整理'}
            </button>
          </div>

          <div className="mt-4 px-6 pb-8">
            {history.length > 0 ? (
              <>
                <div className="text-sm text-gray-500 mb-2">
                  顯示最近 6 筆記錄 (共 {fullHistory.length} 筆)
                </div>
                <SpeedHistoryChart data={history} />
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                尚無記錄
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Dashboard;