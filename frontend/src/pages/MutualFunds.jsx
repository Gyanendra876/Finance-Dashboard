import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddMutualFund from "../components/AddMutualFund";
import PortfolioTable from "../components/PortfolioTable";
import PortfolioSummary from "../components/PortfolioSummary";
import PortfolioChart from "../components/PortfolioChart";
import MutualFundList from "../components/MutualFundList";
import { getPortfolioWithCurrentNav } from "../services/api"; // updated import
import useAuth from "../hooks/useAuth";

export default function MutualFunds() {
  useAuth();

  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPortfolio = async () => {
    setLoading(true);
    const data = await getPortfolioWithCurrentNav();
    setPortfolio(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-10">
        {/* ===== PORTFOLIO SUMMARY ===== */}
        <PortfolioSummary portfolio={portfolio} />

        {/* ===== ADD MUTUAL FUND ===== */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">➕ Add Investment</h2>
          <AddMutualFund onAdded={loadPortfolio} />
        </section>

        {/* ===== PORTFOLIO TABLE ===== */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Your Portfolio</h2>
          {loading ? (
            <p className="text-gray-500">Loading portfolio...</p>
          ) : portfolio.length === 0 ? (
            <p className="text-gray-500">No investments yet</p>
          ) : (
            <PortfolioTable data={portfolio} />
          )}
        </section>

        {/* ===== PORTFOLIO CHART ===== */}
        {portfolio.length > 0 && (
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              📈 Portfolio Growth (Date-wise)
            </h2>
            <PortfolioChart portfolio={portfolio} />
          </section>
        )}

        {/* ===== EXPLORE FUNDS ===== */}
        <section className="bg-white rounded-2xl shadow p-6">
          <MutualFundList />
        </section>
      </main>
    </>
  );
}
