// src/pages/AdminManagementPage.jsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { api } from '../services/api';
import AdminEditModal from '../components/AdminEditModal';

function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await api.getAllAdmins();
      if (response.status === 'success') {
        setAdmins(response.data);
      }
    } catch (error) {
      setError('獲取管理員列表失敗');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleExportCSV = () => {
    const headers = ['帳號', '姓名', '機關單位', '電話', 'Email', '狀態', '註冊時間'];
    const data = admins.map(admin => [
      admin.username,
      admin.name,
      admin.organization,
      admin.phone,
      admin.email,
      admin.status,
      format(new Date(admin.createdAt), 'yyyy-MM-dd HH:mm:ss')
    ]);

    // CSV 匯出邏輯
    const csvContent = [headers, ...data]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `管理員列表_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setShowEditModal(true);
  };

  const handleDelete = async (adminId) => {
    if (window.confirm('確定要刪除此管理員嗎？')) {
      try {
        const response = await api.deleteAdmin(adminId);
        if (response.status === 'success') {
          alert('管理員已刪除');
          fetchAdmins();
        }
      } catch (error) {
        alert('刪除失敗：' + error.message);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">載入中...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">管理員列表</h1>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          匯出清單
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                帳號
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                姓名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                機關單位
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                聯絡資訊
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {admin.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.organization}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.phone}</div>
                  <div className="text-sm text-gray-500">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 
                      admin.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {admin.status === 'active' ? '已啟用' : 
                     admin.status === 'pending' ? '待審核' : '已停用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編輯 Modal */}
      {showEditModal && (
        <AdminEditModal
          admin={editingAdmin}
          onClose={() => setShowEditModal(false)}
          onSave={async (updatedData) => {
            try {
              const response = await api.updateAdmin(updatedData);
              if (response.status === 'success') {
                alert('更新成功');
                fetchAdmins();
                setShowEditModal(false);
              }
            } catch (error) {
              alert('更新失敗：' + error.message);
            }
          }}
        />
      )}
    </div>
  );
}

export default AdminManagementPage;