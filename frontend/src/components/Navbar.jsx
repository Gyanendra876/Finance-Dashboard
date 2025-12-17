import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token"); 

    const res = await fetch("https://finance-dashboard-3juc.onrender.com/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, 
      },
      credentials: "include", 
    });

    if (res.ok) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/"); 
    } else {
      console.error("Logout failed", res.statusText);
    }
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  
  if (location.pathname === "/") return null;

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-indigo-600">
        💸 Finance Dashboard
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 font-medium">
        <Link to="/dashboard" className="hover:text-indigo-600">
          Dashboard
        </Link>
        <Link to="/mutual" className="hover:text-indigo-600">
          My Portfolio
        </Link>
        <Link to="/transactions" className="hover:text-indigo-600">
          Add Transactions
        </Link>
        <Link to="/reports" className="hover:text-indigo-600">
          Reports
        </Link>
        <button
          onClick={handleLogout}
          className="hover:text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Hamburger (Mobile only) */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-lg rounded-xl flex flex-col p-4 space-y-3 md:hidden w-48">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            to="/mutual"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            My Portfolio
          </Link>
          <Link
            to="/transactions"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Add Transactions
          </Link>
          <Link
            to="/reports"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600"
          >
            Reports
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-left hover:text-red-600 font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
