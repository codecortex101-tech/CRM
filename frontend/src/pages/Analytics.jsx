import { useEffect, useState } from "react";
import { fetchStats } from "../api/stats";
import { fetchLeads } from "../api/leads";
import { getUserRole } from "../utils/auth";

export default function Analytics() {
  const role = getUserRole();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, leadsData] = await Promise.all([
          fetchStats(),
          fetchLeads(),
        ]);
        setStats(statsData);
        setLeads(leadsData);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("lastLoginTime");
    window.location.href = "/login";
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Calculate analytics
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? ((stats?.closed || 0) / totalLeads * 100).toFixed(1) : 0;
  const avgResponseTime = "2.4 hrs";
  const activeDeals = (stats?.qualified || 0) + (stats?.contacted || 0);
  const monthlyGrowth = "+24.5%";
  const revenue = (stats?.closed || 0) * 5000;

  // Status distribution
  const statusData = {
    new: stats?.new || 0,
    contacted: stats?.contacted || 0,
    qualified: stats?.qualified || 0,
    closed: stats?.closed || 0,
  };

  // Priority distribution
  const priorityData = leads.reduce((acc, lead) => {
    acc[lead.priority?.toLowerCase() || "medium"] = (acc[lead.priority?.toLowerCase() || "medium"] || 0) + 1;
    return acc;
  }, {});

  // Source distribution
  const sourceData = leads.reduce((acc, lead) => {
    acc[lead.source || "Other"] = (acc[lead.source || "Other"] || 0) + 1;
    return acc;
  }, {});

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
          <a href="/leads">Leads</a>
          <a className="active">Analytics</a>
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
            <div className="skeleton skeleton-button"></div>
          </div>

          {/* STATS SKELETON */}
          <div className="stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat skeleton-card">
                <div className="skeleton skeleton-label"></div>
                <div className="skeleton skeleton-value"></div>
              </div>
            ))}
          </div>

          {/* ANALYTICS GRID SKELETON */}
          <div className="analytics-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="analytics-card skeleton-card">
                <div className="skeleton skeleton-title-small"></div>
                <div className="skeleton skeleton-content"></div>
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
        <a href="/leads">Leads</a>
        <a className="active">Analytics</a>
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
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive insights and performance metrics</p>
          </div>
          <button className="btn btn-danger" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>

        {/* LOGOUT CONFIRMATION POPUP */}
        {showLogoutConfirm && (
          <LogoutConfirmation
            onConfirm={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
          />
        )}

        {/* KEY METRICS */}
        <div className="stats">
          <AnalyticsCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            trend={monthlyGrowth}
            icon="📈"
            color="gradient-purple"
          />
          <AnalyticsCard
            title="Active Deals"
            value={activeDeals}
            trend="+12"
            icon="🔥"
            color="gradient-orange"
          />
          <AnalyticsCard
            title="Avg Response"
            value={avgResponseTime}
            trend="-15%"
            icon="⚡"
            color="gradient-blue"
          />
          <AnalyticsCard
            title="Revenue"
            value={`$${(revenue / 1000).toFixed(1)}k`}
            trend={monthlyGrowth}
            icon="💰"
            color="gradient-green"
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="analytics-grid">
          {/* STATUS CHART */}
          <div className="analytics-card">
            <h3>Lead Status Distribution</h3>
            <div className="chart-container">
              <div className="status-chart">
                <StatusBar label="New" value={statusData.new} total={totalLeads} color="blue" />
                <StatusBar label="Contacted" value={statusData.contacted} total={totalLeads} color="yellow" />
                <StatusBar label="Qualified" value={statusData.qualified} total={totalLeads} color="green" />
                <StatusBar label="Closed" value={statusData.closed} total={totalLeads} color="gray" />
              </div>
            </div>
          </div>

          {/* PRIORITY CHART */}
          <div className="analytics-card">
            <h3>Priority Distribution</h3>
            <div className="chart-container">
              <div className="priority-chart">
                <PriorityItem label="High" value={priorityData.high || 0} total={totalLeads} color="red" />
                <PriorityItem label="Medium" value={priorityData.medium || 0} total={totalLeads} color="yellow" />
                <PriorityItem label="Low" value={priorityData.low || 0} total={totalLeads} color="blue" />
              </div>
            </div>
          </div>

          {/* SOURCE CHART */}
          <div className="analytics-card">
            <h3>Lead Sources</h3>
            <div className="chart-container">
              <div className="source-chart">
                {Object.entries(sourceData).map(([source, count]) => (
                  <SourceItem
                    key={source}
                    label={source}
                    value={count}
                    total={totalLeads}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PERFORMANCE TREND */}
          <div className="analytics-card full-width">
            <h3>Performance Overview</h3>
            <div className="performance-grid">
              <MetricBox label="Total Leads" value={totalLeads} icon="👥" />
              <MetricBox label="New This Month" value={stats?.new || 0} icon="🆕" />
              <MetricBox label="Qualified" value={stats?.qualified || 0} icon="✅" />
              <MetricBox label="Closed" value={stats?.closed || 0} icon="🎯" />
              <MetricBox label="High Priority" value={stats?.high || 0} icon="🔴" />
              <MetricBox label="Avg Deal Size" value="$5k" icon="💵" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalyticsCard({ title, value, trend, icon, color }) {
  return (
    <div className={`analytics-metric-card ${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <p className="metric-label">{title}</p>
        <h2 className="metric-value">{value}</h2>
        <span className="metric-trend">{trend}</span>
      </div>
    </div>
  );
}

function StatusBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total * 100) : 0;
  return (
    <div className="status-bar-item">
      <div className="status-bar-header">
        <span className="status-bar-label">{label}</span>
        <span className="status-bar-value">{value}</span>
      </div>
      <div className="status-bar-track">
        <div
          className={`status-bar-fill status-bar-${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="status-bar-percentage">{percentage.toFixed(1)}%</span>
    </div>
  );
}

function PriorityItem({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total * 100) : 0;
  return (
    <div className="priority-item">
      <div className="priority-info">
        <span className={`priority-dot priority-${color}`}></span>
        <span className="priority-label">{label}</span>
        <span className="priority-value">{value}</span>
      </div>
      <div className="priority-bar">
        <div
          className={`priority-fill priority-${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function SourceItem({ label, value, total }) {
  const percentage = total > 0 ? (value / total * 100) : 0;
  return (
    <div className="source-item">
      <div className="source-header">
        <span className="source-label">{label}</span>
        <span className="source-count">{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="source-bar">
        <div
          className="source-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon }) {
  return (
    <div className="metric-box">
      <div className="metric-box-icon">{icon}</div>
      <div className="metric-box-content">
        <p className="metric-box-label">{label}</p>
        <h3 className="metric-box-value">{value}</h3>
      </div>
    </div>
  );
}

/* =====================
   LOGOUT CONFIRMATION POPUP
===================== */
function LogoutConfirmation({ onConfirm, onCancel }) {
  return (
    <div className="logout-modal-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-header">
          <h3>Confirm Logout</h3>
        </div>
        <div className="logout-modal-body">
          <p>Are you sure you want to logout?</p>
        </div>
        <div className="logout-modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

