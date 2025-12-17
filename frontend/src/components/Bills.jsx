import { useState } from "react";

export default function Bills({ bills = [] }) {
  const [billList, setBillList] = useState(bills);
  const [form, setForm] = useState({ title: "", amount: "", dueDate: "" });

  const handleAddBill = (e) => {
    e.preventDefault();
    setBillList([...billList, form]);
    setForm({ title: "", amount: "", dueDate: "" });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">🧾 Upcoming Bills & Due Dates</h2>
      <form onSubmit={handleAddBill} className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Bill name (e.g. Rent)"
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-300"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-indigo-300"
          required
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-indigo-300"
          required
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          ➕ Add
        </button>
      </form>

      <ul className="flex-1 max-h-72 overflow-y-auto pr-2">
        {billList.length > 0 ? (
          billList.map((bill, idx) => (
            <li key={idx} className="py-1 border-b border-gray-200">
              {bill.title} - ₹{bill.amount} - {bill.dueDate}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No bills added yet.</li>
        )}
      </ul>
    </div>
  );
}
