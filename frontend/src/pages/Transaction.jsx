import { useState } from "react";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { postData } from "../services/api";

export default function Transaction() {
  useAuth(); 

  const [form, setForm] = useState({
    type: "income",
    category: "",
    description: "",
    amount: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await postData("transactions/add", form);
      if (data.msg) {
        setMessage(data.msg);
      } else {
        setMessage("Transaction added successfully!");
        setForm({ type: "income", category: "", description: "", amount: "", date: "" });
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto">

        {/* Add Transaction Form */}
        <section className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">➕ Add Transaction</h2>

          {message && (
            <p className={`mb-4 ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              required
              className="border p-2 rounded w-full"
            />

            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded w-full"
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
              className="border p-2 rounded w-full"
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </form>
        </section>

      </main>
    </>
  );
}
