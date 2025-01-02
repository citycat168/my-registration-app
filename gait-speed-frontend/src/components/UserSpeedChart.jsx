// components/UserListItem.jsx
import PropTypes from 'prop-types';

const UserListItem = ({ user, isSelected, isLoading, onClick }) => {
  return (
    <button
      onClick={() => onClick(user.username)}
      disabled={isLoading}
      className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${
        isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
        {user.avatar ? (
          <img 
            src={user.avatar}
            alt={`${user.name} 的頭像`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 text-left">
        <div>{user.name}</div>
        <div className="text-sm text-gray-500">{user.organization}</div>
      </div>
    </button>
  );
};

UserListItem.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default UserListItem;