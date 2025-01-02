import express from 'express';
import { 
  addGaitSpeed,
  getUserData,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  registerUser,
  getAllSpeedStats 
} from '../controllers/userController.js';

const router = express.Router();

// 步速數據相關路由
router.post('/gait-speed', addGaitSpeed);
router.get('/user-data/:username', getUserData);
router.get('/speed-stats', getAllSpeedStats);

// 用戶檔案相關路由 - 確保這些路由存在
router.post('/register', registerUser);  // 添加註冊路由
router.get('/users', getAllUsers);
router.get('/user-profile/:username', getUserProfile);  // 確保這個路由存在
router.post('/update-profile', updateUserProfile);

export default router;