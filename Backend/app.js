const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup (safe)
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ].filter(Boolean), // removes undefined
  credentials: true
}));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error("Mongo Error:", err));

// ✅ API routes
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

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Server Running...');
});

app.get('/ping', (req, res) => {
  res.send("ok");
});

app.get('/api', (req, res) => {
  res.json({ msg: 'API Running (JWT)' });
});

// ✅ IMPORTANT: Use Railway port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});