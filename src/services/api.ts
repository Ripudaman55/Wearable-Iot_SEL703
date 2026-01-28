import { HealthData } from '../types/health';

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict`;

export async function fetchHealthData(): Promise<HealthData> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch health data');
  }

  return response.json();
}
