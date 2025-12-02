const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const Budget = require('../models/Budget');
const Bill = require('../models/Bill');
const Quote = require('../models/Quotes');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Recent transactions
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Income & Expense totals
    const [totalIncomeRes, totalExpenseRes] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: userObjectId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: userObjectId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalIncome = totalIncomeRes[0]?.total || 0;
    const totalExpense = totalExpenseRes[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // Goals, budgets, bills
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
    const upcomingBills = await Bill.find({ userId, isPaid: false }).sort({ dueDate: 1 }).limit(5).lean();

    // Motivation Quote
    const randomQuote = (await Quote.aggregate([{ $sample: { size: 1 } }]))[0] 
      || { text: "Keep pushing!", author: "AI" };

    // Alerts
    const alerts = [];
    if (totalExpense > totalIncome * 0.8) alerts.push("You're spending more than 80% of your income!");
    if (balance < 0) alerts.push("Your expenses exceed your income!");
    if (goals.some(g => g.progress >= 100)) alerts.push("You achieved a goal!");

    // Weekly Spending (Last 7 Days)
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - 6);

    const weeklyExpensesRaw = await Transaction.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          type: 'expense', 
          date: { $gte: startOfWeek } 
        } 
      },
      { $group: { _id: { $dayOfWeek: "$date" }, total: { $sum: "$amount" } } }
    ]);

    const weeklyData = Array(7).fill(0);
    weeklyExpensesRaw.forEach(e => {
      weeklyData[e._id - 1] = e.total;
    });

    // Forecast (Year)
    const currentYear = new Date().getFullYear();

    const monthlyIncome = await Transaction.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          type: 'income', 
          date: { $gte: new Date(`${currentYear}-01-01`) }
        } 
      },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);

    const monthlyExpense = await Transaction.aggregate([
      { 
        $match: { 
          userId: userObjectId, 
          type: 'expense', 
          date: { $gte: new Date(`${currentYear}-01-01`) }
        } 
      },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);

    const forecastData = Array(12).fill(0);
    for (let m = 1; m <= 12; m++) {
      const income = monthlyIncome.find(i => i._id === m)?.total || 0;
      const expense = monthlyExpense.find(i => i._id === m)?.total || 0;
      forecastData[m - 1] = (m === 1 ? 0 : forecastData[m - 2]) + (income - expense);
    }

    return res.json({
      userId,
      transactions,
      totalIncome,
      totalExpense,
      savings: balance,
      goals,
      budgets,
      alerts,
      upcomingBills,
      motivation: randomQuote,
      weeklyData,
      forecastData
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// ADD GOAL
exports.addGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount = 0, deadline } = req.body;
    if (!title || !targetAmount) {
      return res.status(400).json({ msg: 'Title and TargetAmount required' });
    }

    const goal = await Goal.create({
      userId: req.user,
      title,
      targetAmount,
      savedAmount,
      deadline
    });

    return res.status(201).json({ msg: 'Goal added', goal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// ADD BUDGET
exports.addBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    if (!category || !limit)
      return res.status(400).json({ msg: 'Category and limit required' });

    const budget = await Budget.create({
      userId: req.user,
      category,
      limit
    });

    return res.status(201).json({ msg: 'Budget added', budget });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// DELETE GOAL
exports.deleteGoal = async (req, res) => {
  try {
    await Goal.deleteOne({ _id: req.params.id, userId: req.user });
    return res.json({ msg: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// DELETE BUDGET
exports.deleteBudget = async (req, res) => {
  try {
    await Budget.deleteOne({ _id: req.params.id, userId: req.user });
    return res.json({ msg: 'Budget deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
