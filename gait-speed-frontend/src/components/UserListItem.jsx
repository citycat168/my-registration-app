import PropTypes from 'prop-types';

const UserListItem = ({ user, isSelected, isLoading, onClick, onEdit, onDelete }) => (
  <div className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
    <div
      onClick={() => onClick(user.username)}
      className={`flex items-center space-x-3 flex-grow ${
        isSelected ? 'text-blue-600' : ''
    }`}
    >
      {/* 頭像部分 */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-gray-200">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={`${user.name}的頭像`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">
              {user.name ? user.name.charAt(0) : user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* 用戶信息部分 */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{user.name|| user.username}</p>
        <p className="text-sm text-gray-500 truncate">{user.organization|| user.username}</p>
      </div>
    
     {/* 載入指示器 */}
     {isLoading && isSelected && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
      )}
    </div>

     {/* 編輯和刪除按鈕 */}
     <div className={`flex space-x-2 ml-2 transition-opacity duration-200 ${
  isSelected ? 'opacity-100' : 'opacity-30'
}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(user);
        }}     
        className={`p-2 rounded-full transition-colors ${
          isSelected 
            ? 'text-blue-600 hover:bg-blue-50' 
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
        }`}
        title="編輯"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('確定要刪除此用戶嗎？此操作無法復原。')) {
            onDelete(user.username);
          }
        }}
        className={`p-2 rounded-full transition-colors ${
          isSelected 
            ? 'text-blue-600 hover:bg-blue-50' 
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
        }`}
        title="刪除"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      </div>
  </div>
);

UserListItem.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    organization: PropTypes.string,
    avatar: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default UserListItem;