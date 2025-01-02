import PropTypes from 'prop-types';

const SpeedIndicator = ({ mean, stdev }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">平均步速數據</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">平均步速</p>
          <p className="text-2xl font-bold text-blue-600">{mean} m/s</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">標準差</p>
          <p className="text-2xl font-bold text-green-600">±{stdev}</p>
        </div>
      </div>
    </div>
  );
};

SpeedIndicator.propTypes = {
  mean: PropTypes.number.isRequired,
  stdev: PropTypes.number.isRequired
};

export default SpeedIndicator;