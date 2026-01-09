import { useState } from "react";
import api from "../utils/api";

export default function AddLead() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    priority: "Medium",
    status: "New",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", form);
      alert("Lead added successfully");
      window.location.href = "/leads";
    } catch (err) {
      alert(err.response?.data?.message || "Error adding lead");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Add Lead</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />

        <input
          name="company"
          placeholder="Company"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        />

        <select
          name="source"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option>Website</option>
          <option>Referral</option>
          <option>Social</option>
          <option>Other</option>
        </select>

        <select
          name="priority"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          name="status"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
        </select>

        <button className="w-full bg-green-600 py-2 rounded">
          Save Lead
        </button>
      </form>
    </div>
  );
}
