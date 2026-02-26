import { HealthData } from '../types/health';

//
const API_URL =  'http://192.168.1.177:5000/api/sensor';

export async function fetchHealthData(): Promise<HealthData> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as HealthData;
  } catch (err) {
    console.warn('fetchHealthData failed, returning mock data:', err);

    // return a plausible dummy so UI stays visible
    // const now = new Date().toISOString();
    // return {
    //   predicted_activity: 'idle',
    //   heart_rate: Math.floor(Math.random() * 40) + 60,
    //   temperature: 36 + Math.random(),
    //   health_status: 'Normal',
    //   timestamp: now,
    // };    for debugging
  }
}
