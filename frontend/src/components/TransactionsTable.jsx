export default function TransactionsTable({ transactions = [] }) {
  const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">📅 Recent Transactions</h2>
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Type</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <tr key={idx} className="border-b border-gray-200">
               <td className="py-2 px-4">{formatDate(tx.date)}</td>
                <td className="py-2 px-4">{tx.type}</td>
                <td className="py-2 px-4">{tx.category}</td>
                <td className="py-2 px-4">₹{tx.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-3">
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
