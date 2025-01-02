import PropTypes from 'prop-types';

const UserListModal = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

    // 匯出 CSV 功能
    const exportToCSV = () => {
        // 定義 CSV 標頭
        const headers = ['姓名', '機關單位', '手機', 'EMAIL', '生日'];
        
        // 準備資料行
        const rows = users.map(user => [
          user.name || '',
          user.organization || '',
          user.phone || '',
          user.email || '',
          user.birthdate || ''
        ]);

    // 組合 CSV 內容
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

    // 加入 BOM 以確保 Excel 能正確顯示中文
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });

     // 建立下載連結
     const url = window.URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.setAttribute('download', '用戶資料清單.csv');
     
     // 觸發下載
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     window.URL.revokeObjectURL(url);
   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">用戶資料清單</h2>
          <div className="flex items-center gap-4">
            {/* 新增匯出按鈕 */}
            <button
              onClick={exportToCSV}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              匯出 CSV
            </button>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
    </div>     
        
        {/* 用戶資料表格 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">機關單位</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手機</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">生日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.username} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.organization || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.birthdate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

UserListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    organization: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    birthdate: PropTypes.string
  })).isRequired
};

export default UserListModal;