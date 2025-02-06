import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, '用戶名為必填欄位'],
    unique: true,
    trim: true,
    minlength: [3, '用戶名至少需要3個字符'],
    maxlength: [20, '用戶名不能超過20個字符']
  },
  name: { 
    type: String, 
    required: [true, '姓名為必填欄位'],
    trim: true,
    minlength: [2, '姓名至少需要2個字符'],
    maxlength: [50, '姓名不能超過50個字符']
  },
  email: {
    type: String,
    required: [true, '電子郵件為必填欄位'],
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: '電子郵件格式不正確'
      }
  },
   isEmailVerified: {
     type: Boolean,
     default: false
  },
   emailVerificationToken: {
     type: String,
     select: false
  },
   emailVerificationExpires: {
     type: Date,
     select: false
  },
  // 添加密碼重設相關欄位
  resetPasswordToken: {
    type: String,
    select: false  // 在查詢時默認不返回這些欄位
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  birthdate: {
    type: String,
    required: [true, '生日為必填欄位'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    required: [true, '手機為必填欄位'],
    validate: {
      validator: function(v) {
        // 驗證台灣手機號碼格式
        return /^09\d{8}$/.test(v);
      },
      message: '手機號碼格式不正確'
    }
  },
  organization: {
    type: String,
    trim: true,
    maxlength: [100, '機關單位名稱不能超過100個字符']
  },
  password: {
    type: String,
    required: [true, '密碼為必填欄位'],
    minlength: [6, '密碼至少需要6個字符']
  },
  avatar: {
    type: String,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true // 添加索引以優化查詢
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
  },{
  timestamps: true // 自動添加和管理 updatedAt 字段
});

// 添加複合索引以優化查詢
userSchema.index({ username: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
// 添加重設密碼 token 的索引以提升查詢效率
userSchema.index({ resetPasswordToken: 1 });

export default mongoose.model('User', userSchema);