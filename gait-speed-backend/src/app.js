import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import routes from './routes/index.js';

// 載入環境變量
dotenv.config();

const app = express();

// MongoDB 連接字符串
const MONGODB_URI = 'mongodb+srv://ironchen2000:0OIGJnbJGtPjaOik@cluster0.jkf1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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

// 啟動服務器
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});