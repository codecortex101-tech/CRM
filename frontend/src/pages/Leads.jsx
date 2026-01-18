import { useEffect, useState } from "react";
import { fetchLeads } from "../api/leads";
import { getUserRole } from "../utils/auth";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const role = getUserRole();

  useEffect(() => {
    fetchLeads().then((data) => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  /* ===============================
     CSV EXPORT HANDLER
  ================================ */
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");

      // status filter backend ko bhejna
      let url = "http://localhost:5000/api/leads/export/csv";

      if (statusFilter !== "All") {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("CSV export failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "leads.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Failed to download CSV");
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || l.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (loading) {
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
          <a className="active">Leads</a>
          <a href="/analytics">Analytics</a>
          <a href="/settings">Settings</a>
          <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
            Role: <span className="role-badge">{role || "..."}</span>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOP BAR SKELETON */}
          <div className="topbar">
            <div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div className="skeleton skeleton-button"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          </div>

          {/* FILTER SKELETON */}
          <div className="leads-filter">
            <div className="skeleton" style={{ height: "44px", flex: "1" }}></div>
            <div className="skeleton" style={{ height: "44px", width: "150px" }}></div>
          </div>

          {/* LEADS LIST SKELETON */}
          <div className="leads-list">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="lead-card skeleton-card">
                <div className="skeleton" style={{ height: "20px", width: "60%", marginBottom: "8px" }}></div>
                <div className="skeleton" style={{ height: "16px", width: "80%", marginBottom: "12px" }}></div>
                <div className="skeleton" style={{ height: "24px", width: "100px" }}></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>CRM</h2>
        <a href="/">Dashboard</a>
        <a className="active">Leads</a>
        <a href="/analytics">Analytics</a>
        <a href="/settings">Settings</a>
        <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
          Role: <span className="role-badge">{role}</span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Leads</h1>
            <p>Manage and track all customer leads</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* ADD LEAD BUTTON */}
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/add-lead")}
              style={{ fontSize: "14px", padding: "10px 18px" }}
            >
              ➕ Add Lead
            </button>
            {/* EXPORT CSV BUTTON */}
            <button
              className="btn btn-success"
              onClick={handleExportCSV}
              style={{ fontSize: "14px", padding: "10px 18px" }}
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="leads-filter">
          <input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Closed</option>
          </select>
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <div className="empty-state">No leads found</div>
        ) : (
          <div className="leads-list">
            {filtered.map((lead) => (
              <div key={lead._id} className="lead-card">
                <div className="lead-info">
                  <h3>{lead.name}</h3>
                  <p>{lead.email}</p>
                  <span className={`status ${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="lead-actions">
                  <span
                    className={`priority ${lead.priority.toLowerCase()}`}
                  >
                    {lead.priority}
                  </span>

                  <button
                    className="btn-view"
                    onClick={() =>
                      (window.location.href = `/leads/${lead._id}`)
                    }
                  >
                    View
                  </button>

                  {role === "admin" && (
                    <button
                      className="btn-assign"
                      onClick={() =>
                        (window.location.href = `/assign-lead/${lead._id}`)
                      }
                    >
                      Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
