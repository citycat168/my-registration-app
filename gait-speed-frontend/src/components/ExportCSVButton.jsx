import PropTypes from 'prop-types';

const ExportCSVButton = ({ 
  data, 
  headers, 
  filename = 'export.csv',
  buttonText = '匯出 CSV',
  className = "px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
}) => {
  const handleExport = () => {
    try {
      // 檢查數據
      if (!Array.isArray(data) || !Array.isArray(headers)) {
        throw new Error('數據格式不正確');
      }

      // 組合 CSV 內容
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
      ].join('\n');

      // 加入 BOM 以確保 Excel 能正確顯示中文
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
      
      // 建立下載連結
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      // 觸發下載
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export CSV error:', error);
      alert('匯出失敗：' + error.message);
    }
  };

  return (
    <button
      onClick={handleExport}
      className={className}
    >
      {buttonText}
    </button>
  );
};

ExportCSVButton.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  filename: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string
};

export default ExportCSVButton;