const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const activities = ["resting", "walking", "running", "exercising"];
const healthStatuses = ["Normal", "Elevated", "High Risk"];

function generateMockData() {
  const baseHeartRate = 60 + Math.floor(Math.random() * 40);
  const heartRate = baseHeartRate + Math.floor(Math.random() * 20);
  const temperature = 36.5 + Math.random() * 1.5;

  let activity;
  let healthStatus;

  if (heartRate < 80) {
    activity = activities[0];
    healthStatus = healthStatuses[0];
  } else if (heartRate < 120) {
    activity = Math.random() > 0.5 ? activities[1] : activities[3];
    healthStatus = Math.random() > 0.7 ? healthStatuses[1] : healthStatuses[0];
  } else {
    activity = Math.random() > 0.5 ? activities[2] : activities[3];
    healthStatus = Math.random() > 0.5 ? healthStatuses[2] : healthStatuses[1];
  }

  if (temperature > 37.5) {
    healthStatus = healthStatuses[Math.random() > 0.5 ? 1 : 2];
  }

  return {
    predicted_activity: activity,
    heart_rate: heartRate,
    temperature: parseFloat(temperature.toFixed(1)),
    health_status: healthStatus,
    timestamp: new Date().toISOString()
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data = generateMockData();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
