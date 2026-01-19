import { useEffect, useState } from "react";
import api from "../utils/api";
import { getUserRole } from "../utils/auth";

export default function Leads() {
  const role = getUserRole();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await api.get("/leads");
        setLeads(res.data);
      } catch (err) {
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo-header">
          <span>CRM</span>
        </h2>
        <a href="/">Dashboard</a>
        <a href="/leads" className="active">Leads</a>
        <a href="/analytics">Analytics</a>
        <a href="/settings">Settings</a>

        <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
          Role: <span className="role-badge">{role}</span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h1>Leads</h1>
            <p>All customer leads</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <a href="/add-lead" className="btn btn-primary">
              ➕ Add Lead
            </a>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading && <p>Loading leads...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className="table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.company || "-"}</td>
                      <td>
                        <span className={`badge status-${lead.status.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge priority-${lead.priority.toLowerCase()}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
