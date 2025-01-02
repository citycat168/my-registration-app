import PropTypes from 'prop-types';

const SpeedInputForm = ({ gaitSpeed, isSubmitting, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-6">
      <div className="mb-6">
        <label htmlFor="gaitSpeed" className="block text-lg font-medium text-gray-700 mb-2">
          請輸入步速（公尺/秒）
        </label>
        <div className="relative">
          <input
            type="number"
            id="gaitSpeed"
            value={gaitSpeed}
            onChange={onChange}
            step="0.01"
            min="0"
            max="10"
            required
            placeholder="例如: 1.23"
            className="mt-1 block w-full px-4 py-3 text-xl rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          請輸入到小數點後第二位，例如：1.23 公尺/秒
        </p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {isSubmitting ? '提交中...' : '提交步速'}
      </button>
    </form>
  );
};

SpeedInputForm.propTypes = {
  gaitSpeed: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SpeedInputForm;