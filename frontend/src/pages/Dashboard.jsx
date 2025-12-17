import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import Alerts from "../components/Alerts";
import Motivation from "../components/Motivation";
import Bills from "../components/Bills";
import TransactionsTable from "../components/TransactionsTable";
import { getData } from "../services/api";
import useAuth from "../hooks/useAuth";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function Dashboard() {
  useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await getData("dashboard");
        if (!res || res.msg) throw new Error(res?.msg || "Failed to load dashboard");
        setData(res);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!data) return;

  
    const weeklyCanvas = document.getElementById("weeklySpendingChart");
    if (weeklyCanvas && !weeklyCanvas.chartInstance) {
      const ctx = weeklyCanvas.getContext("2d");
      weeklyCanvas.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              label: "Expenses",
              data: data.weeklyData || [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: "#6366f1",
            },
          ],
        },
        options: { responsive: true, plugins: { legend: { display: true } } },
      });
    }

    const savingsCanvas = document.getElementById("savingsForecastChart");
    if (savingsCanvas && !savingsCanvas.chartInstance) {
      const ctx = savingsCanvas.getContext("2d");
      savingsCanvas.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          datasets: [
            {
              label: "Projected Savings",
              data: data.forecastData || Array(12).fill(0),
              borderColor: "green",
              backgroundColor: "rgba(16,185,129,0.2)",
              fill: true,
            },
          ],
        },
        options: { responsive: true },
      });
    }
  }, [data]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!data) return <p className="p-6">Loading dashboard...</p>;

  return (
    <>
      <Navbar />

      <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Income" value={`₹${data.totalIncome || 0}`} color="text-green-600" />
          <SummaryCard title="Total Expense" value={`₹${data.totalExpense || 0}`} color="text-red-600" />
          <SummaryCard title="Savings" value={`₹${data.savings || 0}`} color="text-blue-600" />
          <SummaryCard title="Transactions" value={data.transactions?.length || 0} color="text-gray-800" />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">📅 Weekly Spending</h2>
            <canvas id="weeklySpendingChart" height="140"></canvas>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">💰 Savings Forecast</h2>
            <canvas id="savingsForecastChart" height="140"></canvas>
          </div>
        </section>

        {/* Alerts & Motivation */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Alerts alerts={data.alerts} />
          <Motivation quote={data.quote} author={data.author} />
        </section>

        {/* Bills & Transactions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Bills bills={data.bills} />
          <TransactionsTable transactions={data.transactions} />
        </section>
      </main>
    </>
  );
}
