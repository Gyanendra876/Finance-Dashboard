const express = require("express");
const router = express.Router();
const { getReports,getDetailedReports} = require("../controllers/reportController");
const { ensureAuth } = require('../middleware/auth');



router.get("/", ensureAuth, getReports);
router.get('/download-transactions',ensureAuth, getDetailedReports);

module.exports = router;
