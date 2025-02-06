// src/routes/adminRoutes.js
import express from 'express';
import {registerAdmin, 
        verifyAdminToken, 
        adminLogin,
        listAdmins,     // 新增
        updateAdmin,    // 新增
        deleteAdmin,     // 新增
        requestAdminPasswordReset,  // 添加這兩行
        resetAdminPassword,
        clearCache   //清除緩存
    } from '../controllers/adminController.js';
import { verifyJWT } from '../middleware/auth.js';  // 新增的中間件

const router = express.Router();

//不需要驗證的公開路由
router.post('/register', registerAdmin); //管理員註冊
router.post('/verify-token', verifyAdminToken); //驗證 Token
router.post('/login', adminLogin); //管理員登入
router.post('/request-reset-password', requestAdminPasswordReset);  // 添加這兩行
router.post('/reset-password', resetAdminPassword);

// 需要JWT驗證的受保護路由
router.get('/list', verifyJWT, listAdmins); //獲取管理員列表
router.put('/update', verifyJWT, updateAdmin); //更新管理員資料
router.delete('/:id', verifyJWT, deleteAdmin); //刪除管理員

// 添加清除緩存的路由
router.post('/clear-cache', verifyJWT, clearCache);  // 需要 JWT 驗證

export default router;