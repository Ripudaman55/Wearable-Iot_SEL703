import { HeartRateReading } from '../types/health';

interface HeartRateChartProps {
  readings: HeartRateReading[];
}

export default function HeartRateChart({ readings }: HeartRateChartProps) {
  if (readings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          Collecting data...
        </div>
      </div>
    );
  }

  const maxHR = Math.max(...readings.map(r => r.value), 100);
  const minHR = Math.min(...readings.map(r => r.value), 60);
  const range = maxHR - minHR + 20;

  const points = readings.map((reading, index) => {
    const x = (index / (readings.length - 1)) * 100;
    const y = 100 - (((reading.value - minHR + 10) / range) * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Heart Rate Trend</h3>
        <span className="text-sm text-gray-500">Last {readings.length} readings</span>
      </div>

      <div className="relative h-48 w-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <polyline
            points={`0,100 ${points} 100,100`}
            fill="url(#heartGradient)"
            stroke="none"
          />

          <polyline
            points={points}
            fill="none"
            stroke="rgb(239, 68, 68)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {readings.map((reading, index) => {
            const x = (index / (readings.length - 1)) * 100;
            const y = 100 - (((reading.value - minHR + 10) / range) * 100);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="rgb(220, 38, 38)"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        <div className="absolute top-0 left-0 text-xs text-gray-500 font-medium">
          {Math.round(maxHR)} bpm
        </div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-500 font-medium">
          {Math.round(minHR)} bpm
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-gray-600">Current: <span className="font-bold text-red-600">{readings[readings.length - 1]?.value} bpm</span></span>
        <span className="text-gray-500">
          {new Date(readings[readings.length - 1]?.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
