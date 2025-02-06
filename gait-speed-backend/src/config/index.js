// src/config/index.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 設置 __dirname（在 ES modules 中需要這樣設置）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入環境變數
dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  // 服務器配置
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // 數據庫配置
  mongoUri: process.env.MONGODB_URI,

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },

  // 郵件配置
  email: {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.EMAIL_FROM,
    superAdmin: process.env.SUPER_ADMIN_EMAIL || 'james@fujicare.com.tw'  // 添加這行
  },
    
  // 前端 URL
    frontendUrl: process.env.FRONTEND_URL,

     // 超級管理員配置
  superAdmin: {
    username: process.env.SUPER_ADMIN_USERNAME || 'admin',
    password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
    email: process.env.SUPER_ADMIN_EMAIL || 'james@fujicare.com.tw'
  }
};