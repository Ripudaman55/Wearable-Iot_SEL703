import { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { HealthData, HeartRateReading } from '../types/health';
import { fetchHealthData } from '../services/api';
import HealthCard from './HealthCard';
import HeartRateChart from './HeartRateChart';

const POLLING_INTERVAL = 5000;
const MAX_CHART_POINTS = 20;

export default function Dashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadHealthData = async () => {
    try {
      const data = await fetchHealthData();
      setHealthData(data);
      setError(null);
      setLastUpdate(new Date());

      setHeartRateHistory(prev => {
        const newHistory = [
          ...prev,
          { value: data.heart_rate, timestamp: data.timestamp }
        ];
        return newHistory.slice(-MAX_CHART_POINTS);
      });
    } catch (err) {
      setError('Unable to connect to the health monitoring system');
      console.error('Failed to fetch health data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getHealthStatusType = (status: string): 'normal' | 'elevated' | 'high' => {
    if (status === 'Normal') return 'normal';
    if (status === 'Elevated') return 'elevated';
    return 'high';
  };

  const getActivityIcon = () => {
    if (!healthData) return Activity;
    switch (healthData.predicted_activity.toLowerCase()) {
      case 'running':
      case 'exercising':
        return Activity;
      default:
        return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Connecting to wearable device...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Health Monitor
            </h1>
            {lastUpdate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            )}
          </div>
          <p className="text-gray-600">Real-time wearable IoT sensor data & ML predictions</p>
          {lastUpdate && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <WifiOff className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-900">Connection Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {healthData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              <HealthCard
                title="Heart Rate"
                value={healthData.heart_rate}
                unit="bpm"
                icon={Heart}
                status={healthData.heart_rate > 100 ? 'elevated' : 'normal'}
              />

              <HealthCard
                title="Temperature"
                value={healthData.temperature}
                unit="°C"
                icon={Thermometer}
                status={healthData.temperature > 37.5 ? 'elevated' : 'normal'}
              />

              <HealthCard
                title="Activity"
                value={healthData.predicted_activity.charAt(0).toUpperCase() + healthData.predicted_activity.slice(1)}
                icon={getActivityIcon()}
                status="normal"
              />

              <HealthCard
                title="Health Status"
                value={healthData.health_status}
                icon={AlertCircle}
                status={getHealthStatusType(healthData.health_status)}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HeartRateChart readings={heartRateHistory} />

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Wearable Device</span>
                    <span className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">ML Model</span>
                    <span className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Data Sync</span>
                    <span className="text-sm text-gray-600">Every 5 seconds</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Readings Collected</span>
                    <span className="text-sm text-gray-600">{heartRateHistory.length}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Academic Project:</strong> This dashboard demonstrates real-time integration
                    between wearable IoT sensors, machine learning prediction models, and modern web visualization
                    technologies for health monitoring applications.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
