import { useState } from "react";
import api from "../utils/api";
import { getUserRole } from "../utils/auth";

export default function AddLead() {
  const role = getUserRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.post("/leads", form);
      window.location.href = "/leads";
    } catch (err) {
      setError(err.response?.data?.message || "Error adding lead");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo-header">
          <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGradient" x1="8" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="50%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#2563eb"/>
              </linearGradient>
            </defs>
            <path d="M6 10L10 8V24L6 22V10Z" fill="#000000"/>
            <path d="M10 8H22V24H10V8Z" fill="url(#blueGradient)"/>
            <path d="M10 8L6 10L6 22L10 24V8Z" fill="#1a1a1a"/>
            <path d="M4 22C4 22 3 23 3 25C3 27 4.5 28 6 28C7.5 28 9 27 9 25C9 23 8 22 7 22H4Z" fill="#000000"/>
            <path d="M24 22C24 22 25 23 25 25C25 27 23.5 28 22 28C20.5 28 19 27 19 25C19 23 20 22 21 22H24Z" fill="#000000"/>
          </svg>
          <span>CRM</span>
        </h2>
        <a href="/">Dashboard</a>
        <a href="/leads">Leads</a>
        <a href="/analytics">Analytics</a>
        <a href="/settings">Settings</a>
        <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
          Role: <span className="role-badge">{role}</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h1>Add New Lead</h1>
            <p>Create a new lead entry in the system</p>
          </div>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>

        {/* CENTERED FORM */}
        <div className="add-lead-container">
          <div className="add-lead-card">
            <div className="add-lead-header">
              <h2>Lead Information</h2>
              <p>Fill in all the required details to add a new lead</p>
            </div>

            {error && (
              <div className="add-lead-error">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="add-lead-form">
              {/* PERSONAL INFORMATION */}
              <div className="form-section">
                <h3 className="form-section-title">👤 Personal Information</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-field">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Enter company name (optional)"
                      className="form-input"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* LEAD DETAILS */}
              <div className="form-section">
                <h3 className="form-section-title">📋 Lead Details</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>
                      Lead Source <span className="required">*</span>
                    </label>
                    <select
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled={loading}
                    >
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>
                      Priority <span className="required">*</span>
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled={loading}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>
                      Status <span className="required">*</span>
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled={loading}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FORM ACTIONS */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => (window.location.href = "/leads")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding Lead..." : "➕ Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
