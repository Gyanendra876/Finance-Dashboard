// routes/dashboardRoutes.js
const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/', auth, dashboardController.getDashboard);
router.post('/add-goal', auth, dashboardController.addGoal);
router.post('/add-budget', auth, dashboardController.addBudget);
router.post('/delete-goal/:id', auth, dashboardController.deleteGoal);
router.post('/delete-budget/:id', auth, dashboardController.deleteBudget);

module.exports = router;
