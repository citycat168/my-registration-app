import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

// 設置 __dirname（在 ES modules 中需要這樣設置）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入環境變數
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// 從環境變數獲取 MongoDB 連接字符串
const MONGODB_URI = process.env.MONGODB_URI;

// 中間件配置
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB 連接
try {
  await mongoose.connect(MONGODB_URI);
  console.log('Successfully connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error);
}

// 路由配置
app.use('/api', routes);

// 錯誤處理中間件
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something broke!' 
  });
});

// 從環境變數獲取端口
const PORT = process.env.PORT || 3001;

// 啟動服務器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});