// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 text-center">
        <img
          className="h-20 w-auto mb-6 mx-auto transform hover:scale-105 transition-transform duration-200"
          src="/logo.png"
          alt="KneeHow健康"
        />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold text-gray-900">
            KneeHow健康
          </h2>
          <h1 className="text-2xl font-semibold text-gray-700 mt-4">
            404 - 頁面未找到
          </h1>
          <p className="text-gray-600 mt-2 mb-8">
            抱歉，您訪問的頁面不存在。
          </p>
        </div>
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}

export default NotFound;