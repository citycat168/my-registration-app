// src/components/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function AdminLogin() {
  const [adminLoginData, setAdminLoginData] = useState({
    username: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 這裡可以添加實際的管理員驗證邏輯
      if (adminLoginData.username === 'admin' && adminLoginData.password === 'admin123') {
        localStorage.setItem('isAdmin', 'true')
        localStorage.setItem('adminUsername', adminLoginData.username)
        navigate('/admin')
      } else {
        alert('管理員帳號或密碼錯誤')
      }
    } catch (error) {
      console.error('Admin login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            管理員登入
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAdminSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-medium text-gray-700 mb-1">
                管理員帳號
              </label>
              <input
                id="admin-username"
                type="text"
                required
                value={adminLoginData.username}
                onChange={(e) => setAdminLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                密碼
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={adminLoginData.password}
                onChange={(e) => setAdminLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isSubmitting ? '登入中...' : '登入'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              返回用戶登入
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin