import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import useAuth from "../hooks/useAuth";
import { getData, postData } from "../services/api";
import Chart from "chart.js/auto";
import AIInsights from "../components/AIInsights";

export default function Reports() {
  useAuth(); // Protect route

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
  });

  const [aiInsights, setAiInsights] = useState("Loading...");
  const [transactions, setTransactions] = useState([]);
  const [editingTx, setEditingTx] = useState(null);
  const [error, setError] = useState("");

  // Canvas refs
  const categoryRef = useRef(null);
  const expenseIncomeRef = useRef(null);
  const monthlyRef = useRef(null);

  // Chart instances
  const categoryChart = useRef(null);
  const expenseIncomeChart = useRef(null);
  const monthlyChart = useRef(null);

  useEffect(() => {
    loadReports();

    return () => {
      categoryChart.current?.destroy();
      expenseIncomeChart.current?.destroy();
      monthlyChart.current?.destroy();
    };
  }, []);

  async function loadReports() {
    try {
      const data = await getData("reports");

      if (!data || data.msg) {
        throw new Error(data?.msg || "Invalid report data");
      }

      // Summary
      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        savings: data.savings || 0,
      });

      setAiInsights(data.aiReport || "No insights available");

      setTransactions(data.transactions || []);

      // Destroy old charts if reloading
      categoryChart.current?.destroy();
      expenseIncomeChart.current?.destroy();
      monthlyChart.current?.destroy();

      // Category Chart
      categoryChart.current = new Chart(categoryRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(data.categoryTotals || {}),
          datasets: [
            {
              label: "Amount (₹)",
              data: Object.values(data.categoryTotals || {}),
              backgroundColor: [
                "#60a5fa",
                "#f87171",
                "#34d399",
                "#fbbf24",
                "#a78bfa",
                "#f472b6",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          scales: { x: { beginAtZero: true } },
        },
      });

      // Expense vs Income Chart
      expenseIncomeChart.current = new Chart(expenseIncomeRef.current, {
        type: "bar",
        data: {
          labels: ["Income", "Expenses", "Savings"],
          datasets: [
            {
              data: [
                data.totalIncome || 0,
                data.totalExpense || 0,
                data.savings || 0,
              ],
              backgroundColor: ["#34d399", "#f87171", "#60a5fa"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });

      // Monthly Trend Chart
      monthlyChart.current = new Chart(monthlyRef.current, {
        type: "bar",
        data: {
          labels: data.monthlyData?.labels || [],
          datasets: [
            {
              label: "Income",
              data: data.monthlyData?.income || [],
              backgroundColor: "#34d399",
            },
            {
              label: "Expense",
              data: data.monthlyData?.expense || [],
              backgroundColor: "#f87171",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "top" } },
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
        },
      });
    } catch (err) {
      console.error("Reports error:", err);
      setError("Failed to load reports");
    }
  }

  async function saveEdit() {
    if (!editingTx) return;

    try {
      const { _id, type, category, description, amount } = editingTx;
      await postData(`transactions/edit/${_id}`, { type, category, description, amount });
      setEditingTx(null);
      loadReports();
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await postData(`transactions/delete/${id}`);
      loadReports();
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  }

  return (
    <>
      <Navbar />
      <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">📊 Financial Reports</h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard title="Total Income" value={`₹${summary.totalIncome}`} color="text-green-600" />
          <SummaryCard title="Total Expenses" value={`₹${summary.totalExpense}`} color="text-red-600" />
          <SummaryCard title="Savings" value={`₹${summary.savings}`} color="text-blue-600" />
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Category-wise Spending</h2>
            <div className="flex-1 min-h-[250px]">
              <canvas ref={categoryRef} className="w-full h-full" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Expense vs Income</h2>
            <div className="flex-1 min-h-[250px]">
              <canvas ref={expenseIncomeRef} className="w-full h-full" />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">📅 Monthly Income & Expense Trend</h2>
          <div className="flex-1 min-h-[300px]">
            <canvas ref={monthlyRef} className="w-full h-full" />
          </div>
        </section>

        {/* TRANSACTIONS TABLE */}
        <section className="bg-white p-6 rounded-xl shadow overflow-auto">
          <h2 className="text-xl font-semibold mb-4">📝 All Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Category</th>
                  <th className="border px-3 py-2">Description</th>
                  <th className="border px-3 py-2">Amount (₹)</th>
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="even:bg-gray-50">
                    <td className="border px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="border px-3 py-2 capitalize">{tx.type}</td>
                    <td className="border px-3 py-2">{tx.category}</td>
                    <td className="border px-3 py-2">{tx.description || "-"}</td>
                    <td className="border px-3 py-2">{tx.amount}</td>
                    <td className="border px-3 py-2 space-x-2">
                      <button
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        onClick={() => setEditingTx(tx)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => deleteTransaction(tx._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* EDIT MODAL */}
        {editingTx && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 space-y-4">
              <h2 className="text-xl font-semibold">Edit Transaction</h2>

              <input
                type="text"
                placeholder="Type"
                className="w-full border p-2 rounded"
                value={editingTx.type}
                onChange={(e) =>
                  setEditingTx({ ...editingTx, type: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={editingTx.category}
                onChange={(e) =>
                  setEditingTx({ ...editingTx, category: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={editingTx.description || ""}
                onChange={(e) =>
                  setEditingTx({ ...editingTx, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full border p-2 rounded"
                value={editingTx.amount}
                onChange={(e) =>
                  setEditingTx({ ...editingTx, amount: e.target.value })
                }
              />

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditingTx(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={saveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI INSIGHTS */}
           <AIInsights transactions={transactions} />
      </main>
    </>
  );
}
