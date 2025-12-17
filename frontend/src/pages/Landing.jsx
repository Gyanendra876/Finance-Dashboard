import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/api";

export default function Landing() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false); // <-- fixed
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "auth/login" : "auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await postData(endpoint, payload);

      if (!res.success) {
        setError(res.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", res.token);
      navigate("/dashboard");

    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start relative overflow-x-hidden">

      {/* Navbar */}
      <header className="w-full py-5 px-10 flex justify-between items-center bg-white shadow z-20 relative">
        <h1 className="text-2xl font-bold text-indigo-700">FinanceDash</h1>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-10 md:px-20 mt-14 w-full z-10">
        {/* Left Text */}
        <div className="md:w-1/2 flex flex-col justify-center z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Manage Your <span className="text-indigo-600">Finances</span> Effortlessly & Smartly
          </h2>
          <p className="mt-5 text-gray-600 text-lg">
            Track expenses, monitor savings, and make smarter financial decisions. Your finances — simplified, visual, and secure.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-base font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
        </div>

        {/* Right Hero Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 relative">
          <img
            src="https://img.freepik.com/free-vector/personal-finance-concept-illustration_114360-1530.jpg"
            alt="Finance Dashboard Illustration"
            className="w-full relative z-10"
          />
        </div>

        {/* Decorative Floating Icons */}
        <img src="https://img.icons8.com/color/96/000000/money.png" className="absolute top-10 right-10 w-12 h-12 animate-bounce opacity-80 z-0" />
        <img src="https://img.icons8.com/color/96/000000/line-chart.png" className="absolute top-32 left-10 w-14 h-14 animate-bounce opacity-70 z-0" />
        <img src="https://img.icons8.com/color/96/000000/safe-box.png" className="absolute bottom-10 right-20 w-16 h-16 animate-bounce opacity-60 z-0" />
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h1 className="text-2xl font-bold text-center mb-6">💸 Finance App</h1>

            {/* Tabs */}
            <div className="flex justify-around mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`font-semibold pb-1 ${isLogin ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400"}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`font-semibold pb-1 ${!isLogin ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400"}`}
              >
                Sign Up
              </button>
            </div>

            {/* Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                disabled={loading}
                type="submit"
                className={`${isLogin ? "bg-indigo-600 hover:bg-indigo-700" : "bg-green-600 hover:bg-green-700"} w-full py-2 rounded-lg text-white transition`}
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
