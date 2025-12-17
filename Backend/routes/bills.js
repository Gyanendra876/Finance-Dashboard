
const router = require('express').Router();
const billsController = require('../controllers/billsController');
const auth = require('../middleware/auth');
router.get("/", auth, billsController.getBills);

router.post('/add', auth, billsController.addBill);
router.delete('/delete/:id', auth, billsController.deleteBill);

module.exports = router;
