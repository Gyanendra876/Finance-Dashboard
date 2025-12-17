import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Transaction from "./pages/Transaction";
import MutualFunds from "./pages/MutualFunds";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mutual" element={<MutualFunds/>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/transactions" element={<Transaction />} />
      </Routes>
    </BrowserRouter>
  );
}
