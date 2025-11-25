import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (temporary - we'll add Supabase next)
let users = [];
let surveys = [];

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'OpinionPay Backend is LIVE!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    usersCount: users.length,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  console.log('🔔 REGISTER REQUEST');
  
  try {
    const { email, password, fullName, country, age } = req.body;
    
    if (!email || !password || !fullName || !country || !age) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      email: email.trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      country: country,
      age: parseInt(age),
      balance: 0.0,
      totalEarned: 0.0,
      surveysCompleted: 0,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    console.log('✅ User registered:', user.email);

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        balance: user.balance,
        country: user.country,
        age: user.age
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  console.log('🔐 LOGIN ATTEMPT:', req.body?.email);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid password' 
      });
    }

    console.log('✅ Login successful:', user.email);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        balance: user.balance,
        totalEarned: user.totalEarned,
        surveysCompleted: user.surveysCompleted
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Survey completion
app.post('/api/survey/complete', (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users[userIndex].balance += parseFloat(amount);
    users[userIndex].totalEarned += parseFloat(amount);
    users[userIndex].surveysCompleted += 1;
    
    res.json({ 
      success: true, 
      newBalance: users[userIndex].balance 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdrawal
app.post('/api/withdraw', (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (users[userIndex].balance < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    users[userIndex].balance -= parseFloat(amount);
    
    res.json({ 
      success: true, 
      message: `Withdrawal of $${amount} processed`,
      newBalance: users[userIndex].balance 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OpinionPay Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Test: /api/test`);
  console.log(`❤️ Health: /api/health`);
});