import { useEffect, useState } from "react";

export default function AIInsights({ transactions }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setInsights(["No transactions available to analyze."]);
      return;
    }

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const savings = totalIncome - totalExpense;

    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0]?.[0] || "None";

    const monthlyTotals = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short", year: "numeric" });
      if (!monthlyTotals[month]) monthlyTotals[month] = { income: 0, expense: 0 };
      monthlyTotals[month][t.type] += t.amount;
    });

    const insightsArr = [];

    insightsArr.push(`📌 Total Income: ₹${totalIncome}`);
    insightsArr.push(`📌 Total Expenses: ₹${totalExpense}`);
    insightsArr.push(`📌 Savings: ₹${savings}`);

    if (savings < 0) {
      insightsArr.push(
        "⚠ You are spending more than you earn. Immediate action needed to reduce expenses."
      );
    } else if (savings < totalIncome * 0.2) {
      insightsArr.push(
        "💡 Your savings are less than 20% of your income. Try to reduce unnecessary expenses."
      );
    } else {
      insightsArr.push("✅ Your savings are healthy. Keep up the good budgeting!");
    }

    if (topCategory) {
      insightsArr.push(
        `💸 You spent the most on "${topCategory}". Consider reviewing this category to save more.`
      );
    }

    const months = Object.keys(monthlyTotals);
    const highExpenseMonth = months.reduce((prev, curr) => {
      return monthlyTotals[curr].expense > monthlyTotals[prev]?.expense ? curr : prev;
    }, months[0]);

    const lowSavingsMonth = months.reduce((prev, curr) => {
      const prevSavings = monthlyTotals[prev].income - monthlyTotals[prev].expense;
      const currSavings = monthlyTotals[curr].income - monthlyTotals[curr].expense;
      return currSavings < prevSavings ? curr : prev;
    }, months[0]);

    insightsArr.push(`📅 Highest spending month: ${highExpenseMonth}`);
    insightsArr.push(`📅 Lowest savings month: ${lowSavingsMonth}`);

    sortedCategories.slice(0, 3).forEach(([cat, amt], i) => {
      insightsArr.push(
        `💡 Recommendation ${i + 1}: Reduce spending on "${cat}" by ₹${Math.floor(amt * 0.1)} to save more.`
      );
    });

    if (transactions.length > 20) {
      insightsArr.push(
        "📌 Tip: You have many transactions. Consider tracking recurring expenses separately for better budgeting."
      );
    }

    setInsights(insightsArr);
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-2">
      <h2 className="text-2xl font-bold mb-4">🧠 AI Financial Insights</h2>
      {insights.map((line, idx) => (
        <p key={idx} className="text-gray-700">
          {line}
        </p>
      ))}
    </div>
  );
}
