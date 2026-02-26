import { HealthData } from '../types/health';

const API_URL = 'http://192.168.1.177:5000/api/sensor';

export async function fetchHealthData(): Promise<HealthData> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch health data');
  }

  return response.json();
}
