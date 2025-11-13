const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const Goal = require('../models/Goal');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Bill = require('../models/Bill');
const Quote = require('../models/Quotes');
// middleware/auth.js
const { ensureAuth } = require('../middleware/auth');


// 🏠 Dashboard - Main Page
router.get('/', ensureAuth, dashboardController.getDashboard);

// 🎯 Add a new financial goal
router.post('/add-goal', ensureAuth, async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline } = req.body;

    if (!title || !targetAmount) {
      req.flash('error', 'Title and Target Amount are required.');
      return res.redirect('/dashboard');
    }

    const goal = new Goal({
      userId: req.user._id,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
    });

    await goal.save();
    req.flash('success', 'Goal added successfully!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error adding goal:', err);
    req.flash('error', 'Something went wrong while adding the goal.');
    res.redirect('/dashboard');
  }
});

// 💰 Add a new budget limit
router.post('/add-budget', ensureAuth, async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      req.flash('error', 'Category and Limit are required.');
      return res.redirect('/dashboard');
    }

    const budget = new Budget({
      userId: req.user._id,
      category,
      limit,
    });

    await budget.save();
    req.flash('success', 'Budget added successfully!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error adding budget:', err);
    req.flash('error', 'Something went wrong while adding the budget.');
    res.redirect('/dashboard');
  }
});

// ❌ Delete goal
router.post('/delete-goal/:id', ensureAuth, async (req, res) => {
  try {
    await Goal.deleteOne({ _id: req.params.id, userId: req.user._id });
    req.flash('success', 'Goal deleted successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error deleting goal:', err);
    req.flash('error', 'Unable to delete goal.');
    res.redirect('/dashboard');
  }
});

// ❌ Delete budget
router.post('/delete-budget/:id', ensureAuth, async (req, res) => {
  try {
    await Budget.deleteOne({ _id: req.params.id, userId: req.user._id });
    req.flash('success', 'Budget deleted successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error deleting budget:', err);
    req.flash('error', 'Unable to delete budget.');
    res.redirect('/dashboard');
  }
});

module.exports = router;
