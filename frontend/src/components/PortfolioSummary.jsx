export default function PortfolioSummary({ portfolio }) {
  const totalInvested = portfolio.reduce(
    (sum, f) => sum + f.units * f.buyNav,
    0
  );

  const currentValue = portfolio.reduce(
    (sum, f) => sum + f.units * (f.currentNav || f.buyNav),
    0
  );

  const gain = currentValue - totalInvested;
  const gainPercent =
    totalInvested > 0
      ? ((gain / totalInvested) * 100).toFixed(2)
      : "0.00";

  const format = (n) =>
    `₹${Number(n).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Invested"
        value={format(totalInvested)}
      />
      <SummaryCard
        title="Current Value"
        value={format(currentValue)}
      />
      <SummaryCard
        title="Profit / Loss"
        value={`${format(gain)} (${gainPercent}%)`}
        positive={gain >= 0}
      />
    </section>
  );
}

function SummaryCard({ title, value, positive }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3
        className={`text-xl font-bold mt-2 ${
          positive === undefined
            ? "text-gray-800"
            : positive
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}
