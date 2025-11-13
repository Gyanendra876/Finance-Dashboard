// controllers/reportController.js
const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getDetailedReports = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).lean();

    const fields = ['category', 'type', 'amount', 'date'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transaction_summary.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating CSV');
  }
};

exports.getReports = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.redirect('/');

    const { from, to, category, type } = req.query;

    // 🧾 Filter setup
    let filter = { userId };
    if (from && to) filter.date = { $gte: new Date(from), $lte: new Date(to) };
    if (category) filter.category = category;
    if (type) filter.type = type;

    // 📊 Fetch transactions
    const transactions = await Transaction.find(filter).sort({ date: -1 }).lean();
    const categories = await Transaction.distinct('category', { userId });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpense;

    const biggestExpense = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0] || { category: 'N/A', amount: 0 };

    // 📅 Monthly data
    const monthMap = {};
    transactions.forEach(t => {
      const d = new Date(t.date); // ensure Date object
      const month = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0 };
      monthMap[month][t.type] += t.amount;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthMap).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateA - dateB;
    });

    const monthlyData = {
      labels: sortedMonths,
      income: sortedMonths.map(m => monthMap[m].income),
      expense: sortedMonths.map(m => monthMap[m].expense),
    };

    // 📂 Category totals for doughnut chart
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    // 🧠 AI-powered insights
    let aiInsights = "AI insights unavailable (no Gemini API key or request failed).";
    try {
      const prompt = `
      You are a friendly financial assistant analyzing this user's finances.

      User Summary:
      - Total Income: ₹${totalIncome}
      - Total Expenses: ₹${totalExpense}
      - Savings: ₹${savings}
      - Biggest Expense: ${biggestExpense.category} (₹${biggestExpense.amount})
      - Category Breakdown: ${JSON.stringify(categoryTotals, null, 2)}

      Please provide:
      1️⃣ A short summary of their financial health (positive/neutral/warning tone)
      2️⃣ 3 specific insights or advice (for savings, budgeting, or expense control)
      3️⃣ Mention one area they could improve in plain language.
      Format clearly with emojis and line breaks.
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      aiInsights = result.response.text();
    } catch (err) {
      console.error("⚠️ AI Insight generation failed:", err.message);
    }

    // ✅ Render the report page
    res.render("reports", {
      user: req.user,
      transactions,
      categories,
      from,
      to,
      category,
      type,
      totalIncome,
      totalExpense,
      savings,
      biggestExpense,
      monthlyData,
      categoryTotals,
      aiReport: aiInsights,
    });

  } catch (err) {
    console.error("🚨 Report generation failed:", err.message);
    res.status(500).send("Server error");
  }
};
