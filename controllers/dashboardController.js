// controllers/dashboardController.js
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const Budget = require('../models/Budget');
const Bill = require('../models/Bill');
const Quote = require('../models/Quotes');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Recent Transactions
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Total Income & Expense
    const [totalIncomeRes, totalExpenseRes] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    const totalIncome = totalIncomeRes[0]?.total || 0;
    const totalExpense = totalExpenseRes[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // Goals
    const goals = await Goal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    // Budgets
    const budgets = await Budget.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Upcoming Bills
    const upcomingBills = await Bill.find({ userId, isPaid: false })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean();

    // Random Quote
    const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
    const quote = randomQuote[0] || { text: "Keep pushing toward your financial goals!", author: "AI Insight" };

    // Alerts
    const alerts = [];
    if (totalExpense > totalIncome * 0.8) alerts.push("⚠️ You're spending more than 80% of your income!");
    if (balance < 0) alerts.push("🚨 Your expenses exceed your income this month!");
    if (goals.some(g => g.progress >= 100)) alerts.push("🎉 Congrats! You’ve achieved one of your goals!");

    // Weekly Spending (past 7 days)
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const weeklyExpensesRaw = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: startOfWeek } } },
      { $group: { _id: { $dayOfWeek: "$date" }, total: { $sum: "$amount" } } }
    ]);
    const weeklyData = Array(7).fill(0);
    weeklyExpensesRaw.forEach(e => {
      weeklyData[e._id - 1] = e.total;
    });

    // Yearly Cumulative Savings Forecast
    const currentYear = new Date().getFullYear();
    const monthlyIncome = await Transaction.aggregate([
      { $match: { userId, type: 'income', date: { $gte: new Date(`${currentYear}-01-01`) } } },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);
    const monthlyExpense = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: new Date(`${currentYear}-01-01`) } } },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);

    const forecastData = Array(12).fill(0);
    for (let m = 1; m <= 12; m++) {
      const income = monthlyIncome.find(i => i._id === m)?.total || 0;
      const expense = monthlyExpense.find(i => i._id === m)?.total || 0;
      forecastData[m - 1] = (m === 1 ? 0 : forecastData[m - 2]) + (income - expense);
    }

    // Render Dashboard
    res.render('dashboard', {
      user: req.user,
      transactions,
      totalIncome,
      totalExpense,
      balance,
      goals,
      budgets,
      alerts,
      upcomingBills,
      quote,
      weeklyData,
      forecastData
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Server error");
  }
};
