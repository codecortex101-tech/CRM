import { useEffect, useState } from "react";
import { fetchStats } from "../api/stats";
import { getUserRole } from "../utils/auth";

export default function Dashboard() {
  const role = getUserRole();
  const [stats, setStats] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="layout">
        <div className="main">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>CRM X</h2>

        <a className="active">Dashboard</a>
        <a href="/leads">Leads</a>
        <a href="#">Analytics</a>
        <a href="#">Settings</a>

        <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
          Role: <b>{role}</b>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h1>Dashboard Overview</h1>
            <p>High-level insights & performance summary</p>
          </div>

          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="stats">
          <StatCard title="Total Leads" value={stats.total} />
          <StatCard title="New Leads" value={stats.new} />
          <StatCard title="Contacted" value={stats.contacted} />
          <StatCard title="Qualified" value={stats.qualified} />
          <StatCard title="Closed Deals" value={stats.closed} />
          <StatCard title="High Priority" value={stats.high || 0} />
        </div>
      </main>
    </div>
  );
}

/* =====================
   STAT CARD COMPONENT
===================== */
function StatCard({ title, value }) {
  return (
    <div className="stat">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

