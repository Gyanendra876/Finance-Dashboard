import { useEffect, useState } from "react";

const MF_API = "https://api.mfapi.in/mf";
const LIMIT = 10;

export default function MutualFundList() {
  const [funds, setFunds] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchFunds = async (pageNo) => {
    setLoading(true);
    try {
      const res = await fetch(MF_API);
      const data = await res.json();

      const start = (pageNo - 1) * LIMIT;
      const end = start + LIMIT;

      setFunds(data.slice(start, end));
    } catch (err) {
      console.error("Failed to fetch funds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds(page);
  }, [page]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        🔍 Explore Mutual Funds
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading mutual funds...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funds.map((fund) => (
            <div
              key={fund.schemeCode}
              className="border rounded-xl p-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {fund.schemeName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Code: {fund.schemeCode}
                </p>
              </div>

              <button
                onClick={() =>
                  alert(`Use this Scheme Code in Add Fund: ${fund.schemeCode}`)
                }
                className="mt-4 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Use Fund
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center pt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          ⬅ Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
