import User from '../models/User.js';
import GaitSpeed from '../models/GaitSpeed.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import EmailService from '../components/EmailService/EmailService.js';

// 生成驗證 token 的輔助函數
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 註冊新用戶
export const registerUser = async (req, res) => {
  try {
    const { 
      username, 
      name, 
      birthdate, 
      gender,    
      phone, 
      email, 
      organization, 
      password 
    } = req.body;

     // 詳細的輸入驗證
     const validationErrors = [];

      // 用戶名驗證
      if (!username || username.length < 3) {
        validationErrors.push('用戶名至少需要3個字符');
      } else if (username.length > 20) {
        validationErrors.push('用戶名不能超過20個字符');
      }

      // 姓名驗證
      if (!name || name.length < 2) {
        validationErrors.push('姓名至少需要2個字符');
      } else if (name.length > 50) {
        validationErrors.push('姓名不能超過50個字符');
      }

      // 生日格式驗證 (改用 Date 物件驗證)
      if (!birthdate) {
        validationErrors.push('生日為必填欄位');
      }

          // 性別驗證（如果有值的話）
      if (gender && !['male', 'female', 'other'].includes(gender)) {
        validationErrors.push('無效的性別選項');
      }

      // 手機格式驗證
      if (!phone || !/^09\d{8}$/.test(phone)) {
        validationErrors.push('手機號碼格式不正確，請輸入09開頭的10位數字');
      }

      // 電子郵件驗證（如果提供）
      if (email && !validator.isEmail(email)) {
        validationErrors.push('電子郵件格式不正確');
      }

      // 密碼強度驗證
      if (!password || password.length < 6) {
        validationErrors.push('密碼至少需要6個字符');
      }

       // 如果有驗證錯誤
      if (validationErrors.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: '輸入資料有誤',
          errors: validationErrors
        });
    }

     // 檢查用戶名是否已存在
     const existingUser = await User.findOne({ username });
     if (existingUser) {
       return res.status(400).json({
         status: 'error',
         message: '用戶名已存在'
       });
     }

// 生成驗證 token 和過期時間
const verificationToken = generateVerificationToken();
const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小時後過期

// 密碼加密
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// 創建新用戶
const newUser = new User({
  username,
  name,
  birthdate,
  gender,      
  phone,
  email,
  organization,
  password: hashedPassword,
  emailVerificationToken: verificationToken,
  emailVerificationExpires: verificationExpires,
  isEmailVerified: false
});

await newUser.save();

// 使用新的 EmailService 發送驗證郵件
await EmailService.sendVerificationEmail(email, {
      name,
      token: verificationToken
    });

    res.json({
      status: 'success',
      message: '註冊成功，請查收驗證郵件以啟用帳號'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: '註冊過程中發生錯誤',
      error: error.message
    });
  }
};

// 驗證 Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: '驗證連結無效或已過期'
      });
    }
    
    // 更新用戶狀態
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // 發送歡迎郵件
    await EmailService.sendWelcomeEmail(user.email, {
      name: user.name
    });

    res.json({
      status: 'success',
      message: '帳號驗證成功'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      status: 'error',
      message: '驗證過程中發生錯誤'
    });
  }
};

// 用戶登入時檢查 Email 驗證狀態
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: '用戶名或密碼錯誤'
      });
    }

    // 檢查密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: '用戶名或密碼錯誤'
      });
    }

    // 檢查 Email 驗證狀態
    if (!user.isEmailVerified) {
      return res.status(403).json({
        status: 'error',
        message: '請先到註冊信箱收確認信啟用帳號'
      });
    }

     // 登入成功
     res.json({
      status: 'success',
      data: {
        username: user.username,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: '登入過程中發生錯誤'
    });
  }
};

// 獲取所有用戶
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, {
      username: 1,
      name: 1,
      organization: 1,
      phone: 1,
      email:1,
      birthdate:1,
      avatar: 1,
      _id: 0
    }).sort({ name: 1 });

    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// 獲取用戶配置
export const getUserProfile = async (req, res) => {
    try {
      const { username } = req.params;
      console.log('Getting profile for user:', username);
      
      const userProfile = await User.findOne({ username });
      console.log('Found user profile:', userProfile);
  
      if (!userProfile) {
        // 如果找不到用戶，創建一個新的用戶檔案
        const newUser = new User({ username });
        await newUser.save();
        
        return res.json({
          status: 'success',
          data: { username }
        });
      }
  
      res.json({
        status: 'success',
        data: {
          username: userProfile.username,
          avatar: userProfile.avatar
        }
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

// 更新用戶檔案
export const updateUserProfile = async (req, res) => {
    try {
      const { 
        username,
        name,
        birthdate,
        gender,
        phone,
        email,
        organization,
        avatar 
      } = req.body; 

      console.log('Updating profile for user:', username);
      
    // 驗證必填欄位
    if (!username) {
      return res.status(400).json({
        status: 'error',
        message: '缺少用戶名'
      });
    }

      // 更新用戶資料，使用 mongoose 的 findOneAndUpdate 方法
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { 
          $set: {
            name,
            birthdate,
            gender,
            phone,
            email,
            organization,
            avatar,
            lastUpdated: new Date()
          }
        },
        { 
          new: true,      // 返回更新後的文檔
          runValidators: true  // 運行 schema 驗證
        }
      );

      if (!updatedUser) {
        return res.status(404).json({
          status: 'error',
          message: '找不到用戶'
        });
      }
  
      // 返回更新後的用戶資料
      res.json({
        status: 'success',
        data: {
            username: updatedUser.username,
            name: updatedUser.name,
            birthdate: updatedUser.birthdate,
            gender: updatedUser.gender,
            phone: updatedUser.phone,
            email: updatedUser.email,
            organization: updatedUser.organization,
            avatar: updatedUser.avatar
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  // 添加步速數據
export const addGaitSpeed = async (req, res) => {
  try {
    const { username, date, speed } = req.body;
    const newRecord = new GaitSpeed({
      username,
      date: new Date(date),
      speed: Number(speed)
    });
    await newRecord.save();
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error adding gait speed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

// 獲取所有用戶的步速統計數據
export const getAllSpeedStats = async (req, res) => {
  try {
    // 獲取所有步速記錄，不做任何限制
    const allSpeeds = await GaitSpeed.find({}, { speed: 1, _id: 0 });
    const speeds = allSpeeds.map(record => record.speed);

    if (speeds.length === 0) {
      return res.json({
        status: 'success',
        data: {
          mean: 0,
          stdev: 0
        }
      });
    }

    // 計算平均值
    const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;

    // 計算所有數據的標準差
    const squareDiffs = speeds.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / speeds.length;
    const stdev = Math.sqrt(avgSquareDiff);

    res.json({
      status: 'success',
      data: {
        mean: Number(mean.toFixed(2)),
        stdev: Number(stdev.toFixed(2)),
        totalRecords: speeds.length  // 可以選擇是否返回總記錄數
      }
    });
  } catch (error) {
    console.error('Error getting speed stats:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// 獲取用戶數據
export const getUserData = async (req, res) => {
  try {
    const records = await GaitSpeed.find({ 
      username: req.params.username 
    })
      .sort({ date: 1 })
      .exec();
      
    res.json({ 
      status: 'success', 
      data: records 
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};