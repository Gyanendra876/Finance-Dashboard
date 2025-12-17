const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');
require('dotenv').config();

/* ============================================================
   📌 MAIN REPORTS API (JSON response for frontend charts)
============================================================ */
exports.getReportsAPI = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED

    const { from, to, category, type } = req.query;

    let filter = { userId };

    if (from && to) {
      filter.date = { $gte: new Date(from), $lte: new Date(to) };
    }
    if (category) filter.category = category;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .lean();

    const categories = await Transaction.distinct('category', { userId });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    const savings = totalIncome - totalExpense;

    const biggestExpense =
      transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount)[0] || { category: 'N/A', amount: 0 };

    const monthMap = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });

      if (!monthMap[key]) {
        monthMap[key] = { income: 0, expense: 0, label };
      }
      monthMap[key][t.type] += t.amount;
    });

    const sortedKeys = Object.keys(monthMap).sort();

    const monthlyData = {
      labels: sortedKeys.map(k => monthMap[k].label),
      income: sortedKeys.map(k => monthMap[k].income),
      expense: sortedKeys.map(k => monthMap[k].expense)
    };

    const categoryTotals = {};
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });

    return res.json({
      transactions,
      categories,
      totalIncome,
      totalExpense,
      savings,
      biggestExpense,
      monthlyData,
      categoryTotals,
      aiReport: "AI insights unavailable."
    });

  } catch (err) {
    console.error("❌ Reports Error:", err);
    res.status(500).json({ msg: "Server error in reports" });
  }
};

/* ============================================================
   📌 CSV EXPORT (Download detailed report)
============================================================ */
exports.getDetailedReports = async (req, res) => {
  try {
    const userId = req.user;

    const transactions = await Transaction.find({ userId }).lean();

    const fields = ["category", "type", "amount", "date"];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transaction_summary.csv");

    return res.send(csv);

  } catch (err) {
    console.error("❌ CSV Error:", err);
    res.status(500).json({ msg: "Error generating CSV" });
  }
};
