// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const verifyJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: '未提供訪問令牌'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // 將解碼後的用戶信息添加到請求對象

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: '無效的訪問令牌'
    });
  }
};