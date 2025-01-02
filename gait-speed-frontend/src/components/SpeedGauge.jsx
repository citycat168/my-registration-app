import PropTypes from 'prop-types'

const SpeedGauge = ({ speed, deviation }) => {
  const MIN_SPEED = 0.5;
  const MAX_SPEED = 2.0;
  const COLORS = [
    { pos: "0%", color: "#ef4444" },    // 紅色
    { pos: "25%", color: "#f97316" },   // 橙色
    { pos: "50%", color: "#eab308" },   // 黃色
    { pos: "75%", color: "#84cc16" },   // 淺綠色
    { pos: "100%", color: "#22c55e" }   // 綠色
  ];

  // 計算位置的函數
  const calculatePercentage = (value) => {
    const percentage = ((value - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  // 計算中心點和標準差範圍
  const centerPosition = calculatePercentage(speed);
  const leftPosition = calculatePercentage(speed - deviation);
  const rightPosition = calculatePercentage(speed + deviation);
  const deviationWidth = rightPosition - leftPosition;

  const gradientId = "speedGradient";
  
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="mb-6 text-center">
        <p className="text-xl text-gray-900">
          {speed.toFixed(2)} ± {deviation.toFixed(2)} m/s
        </p>
      </div>
      
      <div className="relative">
        {/* 主要色條 */}
        <div className="relative h-8 rounded-full overflow-hidden">
          <svg width="100%" height="100%">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%">
                {COLORS.map(({ pos, color }) => (
                  <stop key={pos} offset={pos} stopColor={color} />
                ))}
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#${gradientId})`}
            />
          </svg>

          {/* 標準差白線 */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-white rounded-full"
            style={{
              left: `${leftPosition}%`,
              width: `${deviationWidth}%`
            }}
          />

          {/* 中心指標點 */}
          <div 
            className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-500"
            style={{
              left: `${centerPosition}%`
            }}
          />
        </div>

        {/* 刻度值 */}
        <div className="flex justify-between text-sm text-gray-600 mt-2 px-1">
          <span>0.5</span>
          <span>0.75</span>
          <span>1</span>
          <span>1.25</span>
          <span>1.5</span>
          <span>1.75</span>
          <span>2</span>
        </div>
      </div>
    </div>
  );
};

SpeedGauge.propTypes = {
  speed: PropTypes.number.isRequired,
  deviation: PropTypes.number.isRequired
};

export default SpeedGauge;