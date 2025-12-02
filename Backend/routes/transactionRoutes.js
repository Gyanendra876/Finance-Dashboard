const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const ensureAuth = require('../middleware/auth');

// List all transactions
router.get('/', ensureAuth, transactionController.listTransactions);

// Add a transaction
router.post('/add', ensureAuth, transactionController.addTransaction);

// Get a single transaction (for edit)
router.get('/edit/:id', ensureAuth, transactionController.getTransaction);

// Update transaction
router.post('/edit/:id', ensureAuth, transactionController.updateTransaction);

// Delete transaction
router.post('/delete/:id', ensureAuth, transactionController.deleteTransaction);

module.exports = router;
