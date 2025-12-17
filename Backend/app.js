// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FRONTEND_URL = process.env.FRONTEND_URL ;


app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1",
    "http://localhost",
    "http://localhost:5173",
     FRONTEND_URL

  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],

  
}));



// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  try {
  const portfolioRoutes = require('./routes/portfolioRoutes');
  app.use('/api/portfolio', portfolioRoutes);
  console.log("Portfolio route loaded successfully");
} catch (err) {
  console.error("FAILED to load portfolio route:", err);
}


// API routes (JWT based)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/nav',  require('./routes/navRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/bills', require('./routes/bills'));

// Health check
app.get('/', (req, res) => res.json({ msg: 'API Running (JWT)' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
