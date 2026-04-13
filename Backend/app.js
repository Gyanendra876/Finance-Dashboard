const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= CORS FIX =================
const allowedOrigin = "https://finance-dashboard-frontend-e8um.onrender.com";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error("Mongo Error:", err));

// ================= ROUTES =================
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

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.send('Server Running...');
});

app.get('/ping', (req, res) => {
  res.send('ok');
});

app.get('/api', (req, res) => {
  res.json({ msg: 'API Running (JWT)' });
});

// ================= SERVER =================
const PORT = process.env.PORT;

if (!PORT) {
  console.error("PORT not defined ❌");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});