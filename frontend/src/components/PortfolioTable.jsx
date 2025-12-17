import { postData } from "../services/api";

export default function PortfolioTable({ data, refresh }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Fund</th>
            <th className="p-3">Units</th>
            <th className="p-3">Buy NAV</th>
            <th className="p-3">Current NAV</th>
            <th className="p-3">Value</th>
            <th className="p-3">P/L</th>
          </tr>
        </thead>

        <tbody>
          {data.map((f) => {
            const invested = f.units * f.buyNav;
            const currentValue = f.units * (f.currentNav || f.buyNav);
            const profit = currentValue - invested;
            const percent = ((profit / invested) * 100).toFixed(2);

            return (
              <tr key={f._id} className="border-t">
                <td className="p-3">{f.fundName}</td>
                <td className="p-3 text-center">{f.units}</td>
                <td className="p-3 text-center">₹{f.buyNav}</td>
                <td className="p-3 text-center">
                  ₹{f.currentNav || f.buyNav}
                </td>
                <td className="p-3 text-center font-medium">
                  ₹{currentValue.toFixed(2)}
                </td>
                <td
                  className={`p-3 text-center font-semibold ${
                    profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {profit >= 0 ? "+" : ""}
                  ₹{profit.toFixed(2)} ({percent}%)
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

