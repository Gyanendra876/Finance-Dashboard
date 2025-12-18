const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const FRONTEND_URL = process.env.FRONTEND_URL;
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

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API routes
try {
  const portfolioRoutes = require('./routes/portfolioRoutes');
  app.use('/api/portfolio', portfolioRoutes);
} catch (err) {
  console.error("FAILED to load portfolio route:", err);
}
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/nav', require('./routes/navRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/bills', require('./routes/bills'));

// Serve React build folder (all files) with correct MIME types
const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    else if (filePath.endsWith('.wasm')) res.setHeader('Content-Type', 'application/wasm');
    else if (filePath.endsWith('.ico')) res.setHeader('Content-Type', 'image/x-icon');
    else if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
  }
}));

// React Router fallback
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.get('/api', (req, res) => res.json({ msg: 'API Running (JWT)' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
