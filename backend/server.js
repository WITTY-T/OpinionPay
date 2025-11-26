import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🚀 OpinionPay Backend is LIVE!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working perfectly!',
    data: {
      users: 0,
      surveys: 0,
      status: 'operational'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'opinionpay-backend',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 OpinionPay Backend running on port ${PORT}`);
  console.log(`📍 Access it at: http://0.0.0.0:${PORT}`);
});