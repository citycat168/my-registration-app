import express from 'express';
import adminRoutes from './adminRoutes.js';
import { 
  addGaitSpeed,
  getUserData,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  registerUser,
  getAllSpeedStats,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from '../controllers/userController.js';
import User from '../models/User.js';  // 添加此行

const router = express.Router();

// 掛載管理員路由
router.use('/admin', adminRoutes);

// 用戶認證相關路由
router.post('/register', registerUser);  // 添加註冊路由
router.post('/login', loginUser);                // 添加登入路由
router.get('/verify-email/:token', verifyEmail); // 添加郵件驗證路由

// 密碼重設相關路由
router.post('/request-reset-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// 用戶檔案相關路由 - 確保這些路由存在
router.get('/users', getAllUsers);
router.get('/user-profile/:username', getUserProfile);  // 確保這個路由存在
router.post('/update-profile', updateUserProfile);

// 步速數據相關路由
router.post('/gait-speed', addGaitSpeed);
router.get('/user-data/:username', getUserData);
router.get('/speed-stats', getAllSpeedStats);

// 添加刪除用戶的路由
router.delete('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await User.findOneAndDelete({ username });
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此用戶'
      });
    }

    res.json({
      status: 'success',
      message: '用戶已成功刪除'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: '刪除用戶時發生錯誤'
    });
  }
});

export default router;