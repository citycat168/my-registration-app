// src/models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用戶名為必填欄位'],
    unique: true,
    trim: true,
    minlength: [3, '用戶名至少需要3個字符']
  },
  name: {
    type: String,
    required: [true, '姓名為必填欄位'],
    trim: true
  },
  organization: {
    type: String,
    required: [true, '機關單位為必填欄位'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, '聯絡電話為必填欄位'],
    validate: {
      validator: function(v) {
        return /^09\d{8}$/.test(v);
      },
      message: '請輸入有效的手機號碼格式'
    }
  },
  email: {
    type: String,
    required: [true, '電子郵件為必填欄位'],
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, '密碼為必填欄位'],
    minlength: [6, '密碼至少需要6個字符']
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  firstLogin: {
    type: Boolean,
    default: true
  },
  verificationToken: String,
  tokenExpires: Date,
  status: {
    type: String,
    enum: ['pending', 'active', 'blocked'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  // 新增重設密碼相關欄位
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// 密碼加密
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

// 比對密碼方法
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing passwords:', {
      candidatePassword,
      hashedPassword: this.password
    });
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    throw error;
  }
};

// 新增：檢查重設密碼 token 是否有效
adminSchema.methods.isResetTokenValid = function() {
  return this.resetPasswordToken && 
         this.resetPasswordExpires && 
         this.resetPasswordExpires > new Date();
};

// 新增：清除重設密碼的 token
adminSchema.methods.clearResetToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

// 新增：生成重設密碼 token
adminSchema.methods.generateResetToken = function() {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30分鐘有效
};

// 可選：添加一個初始化方法來確保移除舊的索引
adminSchema.statics.initialize = async function() {
  try {
    const collection = this.collection;
    const indexes = await collection.getIndexes();
    if (indexes.email_1) {
      try {
        await collection.dropIndex('email_1');
        console.log('Email unique index removed successfully');
      } catch (error) {
        if (error.code === 27) {
          console.log('Email index already removed');
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    if (error.code !== 27) {
      console.error('Error initializing Admin model:', error);
    }
  }
};

const Admin = mongoose.model('Admin', adminSchema);

// 可以在導出前調用初始化方法
Admin.initialize().catch(console.error);

export default Admin;