// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import adminRoutes from './routes/adminRoutes.js';
import config from './config/index.js';
import Admin from './models/Admin.js';
import { initializeSuperAdmin } from './controllers/adminController.js';

// 設置 __dirname（在 ES modules 中需要這樣設置）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入環境變數
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// 中間件配置 - 順序很重要
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // 先解析請求體

// 請求日誌中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// 路由配置
app.use('/api/admin', adminRoutes); // 配置管理員路由
app.use('/api', routes);

// MongoDB 連接
try {
  await mongoose.connect(config.mongoUri);
  console.log('Successfully connected to MongoDB');

  // 初始化 Admin model 和超級管理員
  await Admin.initialize();
  console.log('Admin model initialized successfully');
  
  await initializeSuperAdmin(); // 初始化超級管理員
  console.log('Super admin initialization checked');
} catch (error) {
  console.error('MongoDB connection error:', error);
}

// 錯誤處理中間件
app.use((err, req, res, next) => {  // 添加 next 參數
  console.error('Error:', err);      // 更詳細的錯誤日誌
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 從環境變數獲取端口
const PORT = process.env.PORT || 3001;

// 啟動服務器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});