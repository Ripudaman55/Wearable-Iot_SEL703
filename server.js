// simple Node/Express replacement for the Python/Flask API
// run with: node server.js

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let latest = {
  predicted_activity: 'unknown',
  heart_rate: 0,
  temperature: 0,
  health_status: 'Normal',
  timestamp: ''
};

app.post('/api/sensor', (req, res) => {
  console.log('received POST data', req.body);
  const data = req.body || {};
  latest = {
    predicted_activity: data.activity || 'unknown',
    heart_rate: data.bpm || 0,
    temperature: data.temp || 0,
    health_status: 'Normal',
    timestamp: data.ts || ''
  };
  res.json(latest);
});

app.get('/api/sensor', (req, res) => {
     console.log('received get data', req.body);
  res.json(latest);
});

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
//   res.json(latest);
});
