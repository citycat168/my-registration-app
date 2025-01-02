import PropTypes from 'prop-types';

const UserListItem = ({ user, isSelected, isLoading, onClick }) => (
  <div
    onClick={() => onClick(user.username)}
    className={`p-3 rounded-lg cursor-pointer transition-colors ${
      isSelected
        ? 'bg-blue-50 border-blue-500'
        : 'hover:bg-gray-50 border-transparent'
    } border-2`}
  >
    <div className="flex items-center space-x-3">
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
  onClick: PropTypes.func.isRequired
};

export default UserListItem;