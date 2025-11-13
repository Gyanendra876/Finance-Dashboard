const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

const { ensureAuth } = require('../middleware/auth');


// 🟩 Add Transaction Page
router.get('/', ensureAuth, transactionController.Transaction);

// 🟩 Add Transaction Logic
router.post('/add', ensureAuth, transactionController.addTransaction);

// 🟨 Edit Transaction Page
router.get('/edit/:id', ensureAuth, transactionController.getEditTransaction);

// 🟨 Update Transaction Logic
router.post('/edit/:id', ensureAuth, transactionController.updateTransaction);

// 🟥 Delete Transaction Logic
router.post('/delete/:id', ensureAuth, transactionController.deleteTransaction);

module.exports = router;
