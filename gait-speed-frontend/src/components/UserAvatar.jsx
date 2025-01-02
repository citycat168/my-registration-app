import PropTypes from 'prop-types';

const UserAvatar = ({ avatar, isUpdating, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-500"
    >
      {avatar ? (
        <img 
          src={avatar} 
          alt="用戶頭像" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-xl">
            {isUpdating ? '...' : '+'}
          </span>
        </div>
      )}
    </div>
  );
};

UserAvatar.propTypes = {
  avatar: PropTypes.string,
  isUpdating: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default UserAvatar;