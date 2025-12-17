import { useState } from "react";
import { postData } from "../services/api";

export default function AddMutualFund({ onAdded }) {
  const [form, setForm] = useState({
    fundName: "",
    schemeCode: "",
    units: "",
    buyNav: "",
    investmentDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    await postData("portfolio", {
      ...form,
      units: Number(form.units),
      buyNav: Number(form.buyNav),
      investmentDate: form.investmentDate,
    });

    setForm({
      fundName: "",
      schemeCode: "",
      units: "",
      buyNav: "",
      investmentDate: "",
    });

    onAdded(); 
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <input
        name="fundName"
        placeholder="Fund Name"
        value={form.fundName}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="schemeCode"
        placeholder="Scheme Code"
        value={form.schemeCode}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="units"
        type="number"
        placeholder="Units"
        value={form.units}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="buyNav"
        type="number"
        placeholder="Buy NAV"
        value={form.buyNav}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="investmentDate"
        type="date"
        value={form.investmentDate}
        onChange={handleChange}
        className="input"
        required
      />
      <button className="bg-indigo-600 text-white rounded-lg px-4 py-2">
        Add
      </button>
    </form>
  );
}
