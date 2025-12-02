const router = require('express').Router();
const { getReportsAPI, getDetailedReports } = require('../controllers/reportController');
const auth = require('../middleware/auth'); // JWT/session auth

// JSON API for frontend charts
router.get('/', auth, getReportsAPI);

// CSV download
router.get('/download-transactions', auth, getDetailedReports);

module.exports = router;
