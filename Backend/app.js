const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const path = require('path'); 
require('dotenv').config(); 
const app = express(); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // CORS setup 
const FRONTEND_URL = process.env.FRONTEND_URL; 

// ✅ Put this BEFORE routes
app.use(cors({
  origin: "https://finance-dashboard-frontend-e8um.onrender.com",
  credentials: true
}));

// ✅ VERY IMPORTANT: handle preflight manually
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://finance-dashboard-frontend-e8um.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});// MongoDB 
mongoose.connect(process.env.MONGO_URI) .then(() => console.log('MongoDB connected')) .catch(err => console.log(err)); 
// API routes 
try{ 
  const portfolioRoutes = require('./routes/portfolioRoutes'); 
  app.use('/api/portfolio', portfolioRoutes); 
} 
catch (err) { 
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
app.use(express.static(buildPath, { setHeaders: (res, filePath) => { if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript'); 
  else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css'); 
  else if (filePath.endsWith('.wasm')) res.setHeader('Content-Type', 'application/wasm'); 
  else if (filePath.endsWith('.ico')) res.setHeader('Content-Type', 'image/x-icon'); 
  else if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json'); } })); 
  app.get('/ping', (req, res) => { res.send("ok"); }); // React Router fallback 
  app.get(/^(?!\/api).*/, (req, res) => { res.sendFile(path.join(buildPath, 'index.html')); }); 
  app.get('/api', (req, res) => res.json({ msg: 'API Running (JWT)' })); 
  const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});