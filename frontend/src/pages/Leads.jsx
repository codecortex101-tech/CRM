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
        <div className="main">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>CRM X</h2>
        <a href="/">Dashboard</a>
        <a className="active">Leads</a>
        <a>Analytics</a>
        <a>Settings</a>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Leads</h1>
            <p>Manage and track all customer leads</p>
          </div>

          {/* 🔥 EXPORT BUTTON */}
          <button
            onClick={handleExportCSV}
            style={{
              padding: "8px 14px",
              backgroundColor: "#16a34a",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              height: "fit-content",
            }}
          >
            Export CSV
          </button>
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
