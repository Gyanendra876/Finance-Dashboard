import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function PortfolioGrowthChart({ portfolio }) {
  if (!portfolio || portfolio.length === 0) {
    return <p className="text-gray-500">No portfolio data</p>;
  }

  const sorted = [...portfolio].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let cumulative = 0;

  const labels = sorted.map((f) =>
    new Date(f.createdAt).toLocaleDateString()
  );

  const values = sorted.map((f) => {
    const invested = f.investedAmount || f.units * f.buyNav;
    cumulative += invested;
    return cumulative;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Portfolio Value (₹)",
        data: values,
        fill: true,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `₹${v}`,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
