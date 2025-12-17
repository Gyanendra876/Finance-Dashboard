const router = require('express').Router();
const { getReportsAPI, getDetailedReports } = require('../controllers/reportController');
const auth = require('../middleware/auth');


router.get('/', auth, getReportsAPI);


router.get('/download-transactions', auth, getDetailedReports);

module.exports = router;
