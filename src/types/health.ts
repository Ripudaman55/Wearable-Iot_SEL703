export interface HealthData {
  predicted_activity: string;
  heart_rate: number;
  temperature: number;
  health_status: string;
  timestamp: string;
}

export interface HeartRateReading {
  value: number;
  timestamp: string;
}
