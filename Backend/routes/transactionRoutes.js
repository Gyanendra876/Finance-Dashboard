const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const ensureAuth = require('../middleware/auth');


router.get('/', ensureAuth, transactionController.listTransactions);


router.post('/add', ensureAuth, transactionController.addTransaction);


router.get('/edit/:id', ensureAuth, transactionController.getTransaction);


router.post('/edit/:id', ensureAuth, transactionController.updateTransaction);

router.post('/delete/:id', ensureAuth, transactionController.deleteTransaction);

module.exports = router;
