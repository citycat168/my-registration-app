// scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加載環境變量
dotenv.config({ path: join(__dirname, '../.env') });

// 定義默認的管理員配置
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: '系統管理員',
  email: process.env.ADMIN_EMAIL || 'admin@example.com'
};

// 定義管理員模式
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用戶名為必填欄位'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, '密碼為必填欄位'],
    minlength: [6, '密碼至少需要6個字符']
  },
  name: {
    type: String,
    required: [true, '姓名為必填欄位'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '電子郵件為必填欄位'],
    unique: true,
    trim: true,
    lowercase: true
  },
  isAdmin: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  }
}, {
  timestamps: true // 添加 createdAt 和 updatedAt
});

// 在保存前加密密碼
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 添加密碼比對方法
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 創建模型
const Admin = mongoose.model('Admin', adminSchema);

// 連接數據庫並創建管理員
const initializeAdmin = async () => {
  try {
    console.log('正在連接到數據庫...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('數據庫連接成功');

    // 檢查是否已存在管理員
    const existingAdmin = await Admin.findOne({ username: DEFAULT_ADMIN.username });
    
    if (existingAdmin) {
      console.log('管理員帳號已存在');
      console.log('用戶名:', existingAdmin.username);
      console.log('姓名:', existingAdmin.name);
      console.log('電子郵件:', existingAdmin.email);
      console.log('狀態:', existingAdmin.status);
      console.log('創建時間:', existingAdmin.createdAt);
      return;
    }

    // 創建新管理員
    const admin = new Admin({
      ...DEFAULT_ADMIN,
      createdAt: new Date()
    });

    await admin.save();
    
    console.log('=== 管理員帳號創建成功 ===');
    console.log('用戶名:', DEFAULT_ADMIN.username);
    console.log('密碼:', DEFAULT_ADMIN.password);
    console.log('電子郵件:', DEFAULT_ADMIN.email);
    console.log('請儘快修改預設密碼！');

  } catch (error) {
    console.error('創建管理員過程中發生錯誤:', error);
  } finally {
    await mongoose.disconnect();
    console.log('數據庫連接已關閉');
    process.exit(0);
  }
};

// 執行初始化
initializeAdmin().catch(error => {
  console.error('程序執行失敗:', error);
  process.exit(1);
});