// src/controllers/adminController.js
import Admin from '../models/Admin.js';
import EmailService from '../components/EmailService/EmailService.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 添加緩存對象
const cache = {
  adminList: {
    data: null,
    timestamp: null
  }
};

// 設置緩存過期時間（毫秒）
const CACHE_TTL = 5 * 60 * 1000; // 5分鐘

// 清除緩存的輔助函數
const clearAdminListCache = () => {
  cache.adminList = {
    data: null,
    timestamp: null
  };
  console.log('管理員列表緩存已清除');
};

export const initializeSuperAdmin = async () => {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    
    // 使用環境變數的配置
    const superAdmin = await Admin.findOneAndUpdate(
      { role: process.env.SUPER_ADMIN_ROLE },
      {
        $set: {
          username: process.env.SUPER_ADMIN_USERNAME,
          email: process.env.SUPER_ADMIN_EMAIL,
          password: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, saltRounds),
          isVerified: true,
          status: 'active',
          firstLogin: false,
          name: '超級管理員',
          organization: 'KneeHow',
          phone: '0900000000',
          role: process.env.SUPER_ADMIN_ROLE
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    // 日誌記錄時避免顯示敏感信息
    console.log('超級管理員初始化:', {
      username: superAdmin.username,
      email: superAdmin.email,
      role: superAdmin.role,
      status: superAdmin.status
    });

    // 驗證設置但避免在日誌中顯示密碼相關信息
    const verifyPassword = await bcrypt.compare(
      process.env.SUPER_ADMIN_PASSWORD,
      superAdmin.password
    );

    if (!verifyPassword) {
      console.error('超級管理員密碼驗證失敗');
    } else {
      console.log('超級管理員初始化成功');
    }

  } catch (error) {
    console.error('超級管理員初始化錯誤:', {
      message: error.message,
      code: error.code
    });
    throw error;
  }
};

// 管理員登入
export const adminLogin = async (req, res) => {
  try {
    const { username, password, token } = req.body;
    console.log('登入嘗試:', { username, hasToken: !!token });

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ 
        status: 'error', 
        message: '帳號或密碼錯誤' 
      });
    }

    // 基本的登入信息日誌
    console.log('管理員登入:', { 
      username: admin.username,
      role: admin.role,
      firstLogin: admin.firstLogin,
      isVerified: admin.isVerified,
      status: admin.status
    });

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('密碼驗證失敗');
      return res.status(401).json({ 
        status: 'error', 
        message: '帳號或密碼錯誤' 
      });
    }

    // 檢查是否需要驗證 token
    if (admin.firstLogin && admin.role === 'admin') {
      console.log('首次登入檢查:', { 
        hasToken: !!token, 
        validToken: admin.verificationToken === token,
        tokenExpired: admin.tokenExpires < new Date()
      });

      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: '首次登入需要驗證碼',
          requireToken: true
        });
      }

      if (admin.verificationToken !== token) {
        return res.status(401).json({
          status: 'error',
          message: '驗證碼錯誤'
        });
      }

      if (admin.tokenExpires < new Date()) {
        return res.status(401).json({
          status: 'error',
          message: '驗證碼已過期'
        });
      }

      // 更新首次登入狀態
      admin.firstLogin = false;
      admin.verificationToken = undefined;
      admin.tokenExpires = undefined;
      await admin.save();
      console.log('首次登入驗證成功，狀態已更新');
    }

    // 生成 JWT token
    const jwtToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 更新最後登入時間
    admin.lastLogin = new Date();
    await admin.save();

    console.log('登入成功');
    res.json({
      status: 'success',
      message: '登入成功',
      token: jwtToken,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('登入錯誤:', {
      message: error.message,
      code: error.code
    });
    res.status(500).json({
      status: 'error',
      message: '登入過程中發生錯誤'
    });
  }
};

// 註冊管理員
export const registerAdmin = async (req, res) => {
  try {
    console.log('開始處理註冊請求');
    console.log('接收到的數據:', req.body);

    const {
      username,
      name,
      organization,
      phone,
      email,
      password
    } = req.body;

    // 檢查必要欄位
    if (!username || !name || !organization || !phone || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: '請填寫所有必要欄位'
      });
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: '請輸入有效的電子郵件地址'
      });
    }

    // 驗證手機號碼格式
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        status: 'error',
        message: '請輸入有效的手機號碼（格式：09xxxxxxxx）'
      });
    }

    // 檢查用戶名是否已存在
    console.log('檢查用戶名:', username);
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: '此帳號已被使用'
      });
    }

    // 生成驗證 token
    console.log('生成驗證 token');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setMonth(tokenExpires.getMonth() + 1);

    // 創建新的管理員記錄
    console.log('創建新管理員記錄');
    const newAdmin = new Admin({
      username,
      name,
      organization,
      phone,
      email,
      password,
      verificationToken,
      tokenExpires,
      status: 'pending',
      isVerified: false,
      role: 'admin',
      firstLogin: true
    });

    // 保存管理員記錄
    await newAdmin.save();
    console.log('管理員記錄已保存');
    clearAdminListCache(); // 清除緩存

    // 發送郵件通知
    console.log('準備發送註冊通知郵件');
    try {
      await EmailService.sendAdminNotificationEmail(process.env.SUPER_ADMIN_EMAIL, {
        applicantName: name,
        username,
        organization,
        phone,
        email,
        token: verificationToken
      });
      console.log('註冊通知郵件發送成功');
    } catch (emailError) {
      console.error('郵件發送錯誤:', emailError);
      console.log('郵件發送失敗，但繼續完成註冊流程');
    }

    console.log('註冊流程完成');
    return res.json({
      status: 'success',
      message: '註冊申請已提交，請等待系統管理員審核'
    });

  } catch (error) {
    console.error('註冊過程中發生錯誤:', error);
    return res.status(500).json({
      status: 'error',
      message: '註冊過程中發生錯誤',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 驗證 token
export const verifyAdminToken = async (req, res) => {
  try {
    const { username, token } = req.body;

    const admin = await Admin.findOne({
      username,
      verificationToken: token,
      tokenExpires: { $gt: new Date() }
    });

    if (!admin) {
      return res.status(400).json({
        status: 'error',
        message: '無效的驗證碼或已過期'
      });
    }

    // 更新管理員狀態
    admin.isVerified = true;
    admin.status = 'active';
    admin.firstLogin = false;  // 添加這行
    admin.verificationToken = undefined;
    admin.tokenExpires = undefined;
    await admin.save();

    res.json({
      status: 'success',
      message: '帳號驗證成功'
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      status: 'error',
      message: '驗證過程中發生錯誤'
    });
  }
};

// src/controllers/adminController.js

// 請求重設密碼
export const requestAdminPasswordReset = async (req, res) => {
  try {
    const { username } = req.body;
    
    // 找尋管理員
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: '找不到該用戶'
      });
    }

    // 生成重設 token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 分鐘有效

    // 更新管理員資料
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = tokenExpires;
    await admin.save();

    // 發送重設密碼郵件
    await EmailService.sendAdminResetPasswordEmail(admin.email, {
      name: admin.name || admin.username,
      token: resetToken
    });

    res.json({
      status: 'success',
      message: '重設密碼連結已發送至您的信箱'
    });

  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({
      status: 'error',
      message: '處理重設密碼請求時發生錯誤'
    });
  }
};

// 重設密碼
export const resetAdminPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({
        status: 'error',
        message: '重設密碼連結無效或已過期'
      });
    }

    // 更新密碼
    admin.password = newPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({
      status: 'success',
      message: '密碼已成功重設'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: '重設密碼時發生錯誤'
    });
  }
};

// 獲取管理員列表
export const listAdmins = async (req, res) => {
  try {
    // 確保請求者是超級管理員
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: '沒有權限執行此操作'
      });
    }

// 檢查緩存是否有效
if (
  cache.adminList.data && 
  cache.adminList.timestamp && 
  (Date.now() - cache.adminList.timestamp) < CACHE_TTL
) {
  console.log('返回緩存的管理員列表');
  return res.json({
    status: 'success',
    data: cache.adminList.data,
    fromCache: true
  });
}

    // 如果緩存無效，從數據庫獲取數據
    const admins = await Admin.find(
      {}, 
      { password: 0, verificationToken: 0 }
    ).sort({ createdAt: -1 });

    // 更新緩存
    cache.adminList = {
      data: admins,
      timestamp: Date.now()
    };

    console.log('返回新獲取的管理員列表');
    res.json({
      status: 'success',
      data: admins,
      fromCache: false
    });

  } catch (error) {
    console.error('獲取管理員列表錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '獲取管理員列表失敗'
    });
  }
};

// 更新管理員資料
export const updateAdmin = async (req, res) => {
  try {
    // 確保請求者是超級管理員
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: '沒有權限執行此操作'
      });
    }

    const { id, name, organization, phone, email, status } = req.body;

    // 驗證電話格式
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        status: 'error',
        message: '請輸入有效的手機號碼（格式：09xxxxxxxx）'
      });
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: '請輸入有效的電子郵件地址'
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此管理員'
      });
    }

    // 防止修改超級管理員
    if (admin.role === 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: '不能修改超級管理員資料'
      });
    }

    // 更新管理員資料
    admin.name = name;
    admin.organization = organization;
    admin.phone = phone;
    admin.email = email;
    admin.status = status;

    await admin.save();
    clearAdminListCache(); // 清除緩存

    res.json({
      status: 'success',
      message: '管理員資料已更新',
      data: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        organization: admin.organization,
        phone: admin.phone,
        email: admin.email,
        status: admin.status
      }
    });

  } catch (error) {
    console.error('更新管理員資料錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '更新管理員資料失敗'
    });
  }
};

// 刪除管理員
export const deleteAdmin = async (req, res) => {
  try {
    // 確保請求者是超級管理員
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: '沒有權限執行此操作'
      });
    }

    const { id } = req.params;
    
    // 檢查是否試圖刪除超級管理員
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此管理員'
      });
    }

    if (admin.role === 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: '不能刪除超級管理員帳號'
      });
    }

    await Admin.findByIdAndDelete(id);
    clearAdminListCache(); // 清除緩存

    res.json({
      status: 'success',
      message: '管理員已刪除'
    });

  } catch (error) {
    console.error('刪除管理員錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '刪除管理員失敗'
    });
  }
};

// 把這個函數加到 adminController.js 的最後
export const clearCache = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'error',
        message: '沒有權限執行此操作'
      });
    }
    clearAdminListCache();
    
    res.json({
      status: 'success',
      message: '緩存已清除'
    });
  } catch (error) {
    console.error('清除緩存錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '清除緩存失敗'
    });
  }
};