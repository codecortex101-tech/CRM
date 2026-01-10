import { useEffect, useState } from "react";
import { fetchStats } from "../api/stats";
import { fetchLeads } from "../api/leads";
import { getUserRole, getUserName } from "../utils/auth";

/* =====================
   FORMAT LAST LOGIN TIME
===================== */
function formatLastLoginTime(date) {
  const now = new Date();
  const loginTime = new Date(date);
  const diffMs = now - loginTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Today same day
  if (diffDays === 0) {
    if (diffMins < 1) {
      return "Just now";
    } else {
      return `Today at ${loginTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    }
  }
  // Yesterday
  else if (diffDays === 1) {
    return `Yesterday at ${loginTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  }
  // Within a week
  else if (diffDays < 7) {
    return `${loginTime.toLocaleDateString("en-US", { weekday: "short" })} at ${loginTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  }
  // Older
  else {
    return loginTime.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: loginTime.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      hour: "numeric", 
      minute: "2-digit", 
      hour12: true 
    });
  }
}

export default function Dashboard() {
  const role = getUserRole();
  const userName = getUserName();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const [showHelloMessage, setShowHelloMessage] = useState(true);
  const [formattedLastLogin, setFormattedLastLogin] = useState("");

  // Get greeting and handle last login time updates
  useEffect(() => {
    // Get last login time from localStorage
    const savedLoginTime = localStorage.getItem("lastLoginTime");
    if (savedLoginTime) {
      const loginTime = new Date(savedLoginTime);
      setLastLoginTime(loginTime);
      // Initial format - check if it's within 1 minute (just now)
      const now = new Date();
      const diffMs = now - loginTime;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setFormattedLastLogin("Just now");
      } else {
        setFormattedLastLogin(formatLastLoginTime(loginTime));
      }
    } else {
      // If no saved login time, set initial state
      setFormattedLastLogin("");
    }

    // Hide hello message after 3 seconds
    const helloTimer = setTimeout(() => {
      setShowHelloMessage(false);
    }, 3000);

    // Update last login time every 5 seconds (to change from "Just now" to actual time)
    const updateTimer = setInterval(() => {
      if (savedLoginTime) {
        const loginTime = new Date(savedLoginTime);
        const now = new Date();
        const diffMs = now - loginTime;
        const diffMins = Math.floor(diffMs / 60000);
        
        // If less than 1 minute, show "Just now", otherwise format properly
        if (diffMins < 1) {
          setFormattedLastLogin("Just now");
        } else {
          setFormattedLastLogin(formatLastLoginTime(loginTime));
        }
      }
    }, 5000);

    return () => {
      clearTimeout(helloTimer);
      clearInterval(updateTimer);
    };
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
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate stats for charts
  const totalLeads = leads.length;
  const statusData = {
    new: stats?.new || 0,
    contacted: stats?.contacted || 0,
    qualified: stats?.qualified || 0,
    closed: stats?.closed || 0,
  };

  // Source distribution
  const sourceData = leads.reduce((acc, lead) => {
    acc[lead.source || "Other"] = (acc[lead.source || "Other"] || 0) + 1;
    return acc;
  }, {});

  // Recent leads (last 5)
  const recentLeads = [...leads]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  // Pipeline data
  const pipelineData = [
    { stage: "New", count: statusData.new, color: "#3b82f6" },
    { stage: "Contacted", count: statusData.contacted, color: "#f59e0b" },
    { stage: "Qualified", count: statusData.qualified, color: "#10b981" },
    { stage: "Closed", count: statusData.closed, color: "#6b7280" },
  ];


  if (loading || !stats) {
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
              {/* Book - Left page (solid black) */}
              <path d="M6 10L10 8V24L6 22V10Z" fill="#000000"/>
              {/* Book - Right page (bright blue) */}
              <path d="M10 8H22V24H10V8Z" fill="url(#blueGradient)"/>
              {/* Book spine */}
              <path d="M10 8L6 10L6 22L10 24V8Z" fill="#1a1a1a"/>
              {/* Left hand (solid black, smooth rounded) */}
              <path d="M4 22C4 22 3 23 3 25C3 27 4.5 28 6 28C7.5 28 9 27 9 25C9 23 8 22 7 22H4Z" fill="#000000"/>
              {/* Right hand (solid black, smooth rounded) */}
              <path d="M24 22C24 22 25 23 25 25C25 27 23.5 28 22 28C20.5 28 19 27 19 25C19 23 20 22 21 22H24Z" fill="#000000"/>
            </svg>
            <span>CRM</span>
          </h2>
          <a className="active">Dashboard</a>
          <a href="/leads">Leads</a>
          <a href="/analytics">Analytics</a>
          <a href="/settings">Settings</a>
          <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
            Role: <span className="role-badge">{role || "..."}</span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="stat skeleton-card">
                <div className="skeleton skeleton-label"></div>
                <div className="skeleton skeleton-value"></div>
              </div>
            ))}
          </div>

          {/* DASHBOARD GRID SKELETON */}
          <div className="dashboard-grid">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="dashboard-card skeleton-card">
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
        <h2 className="logo-header">
            <svg className="logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="blueGradient" x1="8" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#60a5fa"/>
                  <stop offset="50%" stopColor="#3b82f6"/>
                  <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
              </defs>
              {/* Book - Left page (solid black) */}
              <path d="M6 10L10 8V24L6 22V10Z" fill="#000000"/>
              {/* Book - Right page (bright blue gradient) */}
              <path d="M10 8H22V24H10V8Z" fill="url(#blueGradient)"/>
              {/* Book spine */}
              <path d="M10 8L6 10L6 22L10 24V8Z" fill="#1a1a1a"/>
              {/* Left hand (solid black, smooth rounded) */}
              <path d="M4 22C4 22 3 23 3 25C3 27 4.5 28 6 28C7.5 28 9 27 9 25C9 23 8 22 7 22H4Z" fill="#000000"/>
              {/* Right hand (solid black, smooth rounded) */}
              <path d="M24 22C24 22 25 23 25 25C25 27 23.5 28 22 28C20.5 28 19 27 19 25C19 23 20 22 21 22H24Z" fill="#000000"/>
            </svg>
          <span>CRM</span>
        </h2>

        <a className="active">Dashboard</a>
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
            <div className="welcome-section">
              {showHelloMessage ? (
                <>
                  <h1 className="welcome-message hello-animation">
                    Hello{userName ? `, ${userName}` : ""} 👋
                  </h1>
                  {lastLoginTime && (
                    <p className="last-login">
                      Last login: {formattedLastLogin || "Just now"}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h1 className="welcome-message">
                    Dashboard Overview
                  </h1>
                  {lastLoginTime && formattedLastLogin && (
                    <p className="last-login">
                      Last login: {formattedLastLogin}
                    </p>
                  )}
                  {!lastLoginTime && (
                    <p className="dashboard-subtitle">High-level insights & performance summary</p>
                  )}
                </>
              )}
            </div>
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

        {/* STATS CARDS */}
        <div className="stats">
          <StatCard title="Total Leads" value={stats.total} />
          <StatCard title="New Leads" value={stats.new} />
          <StatCard title="Contacted" value={stats.contacted} />
          <StatCard title="Qualified" value={stats.qualified} />
          <StatCard title="Closed Deals" value={stats.closed} />
          <StatCard title="High Priority" value={stats.high || 0} />
        </div>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">
          {/* LEAD PIPELINE - VISUAL BAR CHART */}
          <div className="dashboard-card compact-card">
            <h3>Lead Pipeline</h3>
            <div className="chart-container" style={{ height: "220px", width: "100%" }}>
              {totalLeads > 0 ? (
                <div className="visual-bar-chart">
                  {pipelineData.map((item, index) => {
                    const percentage = totalLeads > 0 ? (item.count / totalLeads) * 100 : 0;
                    const maxHeight = Math.max(...pipelineData.map(d => d.count));
                    const barHeight = maxHeight > 0 ? (item.count / maxHeight) * 100 : 0;
                    return (
                      <div key={item.stage} className="bar-chart-item">
                        <div className="bar-wrapper">
                          <div 
                            className="bar-fill"
                            style={{
                              height: `${barHeight}%`,
                              backgroundColor: item.color,
                              minHeight: item.count > 0 ? "20px" : "0",
                            }}
                            title={`${item.stage}: ${item.count} leads`}
                          >
                            <span className="bar-value">{item.count}</span>
                          </div>
                        </div>
                        <div className="bar-label">{item.stage}</div>
                        <div className="bar-percentage">{percentage.toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">No pipeline data available</div>
              )}
            </div>
          </div>

          {/* RECENT LEADS */}
          <div className="dashboard-card compact-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>Recent Leads</h3>
              <a href="/leads" style={{ fontSize: "13px", color: "#60a5fa", textDecoration: "none" }}>
                View All →
              </a>
            </div>
            {recentLeads.length === 0 ? (
              <div className="empty-state">No recent leads</div>
            ) : (
              <div className="recent-leads-list scrollable-list">
                {recentLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="recent-lead-item"
                    onClick={() => (window.location.href = `/leads/${lead._id}`)}
                  >
                    <div className="recent-lead-info">
                      <h4>{lead.name}</h4>
                      <p>{lead.email}</p>
                    </div>
                    <div className="recent-lead-meta">
                      <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                        {lead.status}
                      </span>
                      <span className="recent-lead-date">
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : lead.updatedAt
                          ? new Date(lead.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STATUS DISTRIBUTION - VISUAL PIE CHART */}
          <div className="dashboard-card">
            <h3>Status Distribution</h3>
            <div className="chart-container" style={{ height: "300px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              {totalLeads > 0 ? (
                <div className="visual-pie-chart-wrapper">
                  <VisualPieChart 
                    data={[
                      { name: "New", value: statusData.new, color: "#3b82f6" },
                      { name: "Contacted", value: statusData.contacted, color: "#f59e0b" },
                      { name: "Qualified", value: statusData.qualified, color: "#10b981" },
                      { name: "Closed", value: statusData.closed, color: "#6b7280" },
                    ]}
                    total={totalLeads}
                  />
                </div>
              ) : (
                <div className="empty-state">No status data available</div>
              )}
            </div>
          </div>

          {/* LEAD SOURCES - VISUAL PIE CHART */}
          <div className="dashboard-card">
            <h3>Lead Sources</h3>
            <div className="chart-container" style={{ height: "300px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              {Object.keys(sourceData).length > 0 ? (
                <div className="visual-pie-chart-wrapper">
                  <VisualPieChart 
                    data={Object.entries(sourceData).map(([name, value]) => {
                      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
                      const index = Object.keys(sourceData).indexOf(name);
                      return { name, value, color: colors[index % colors.length] };
                    })}
                    total={totalLeads}
                  />
                </div>
              ) : (
                <div className="empty-state">No source data available</div>
              )}
            </div>
          </div>

          {/* TASKS & FOLLOW-UPS */}
          <div className="dashboard-card">
            <h3>Tasks & Follow-ups</h3>
            <div className="tasks-container">
              <div className="task-item">
                <div className="task-icon">📞</div>
                <div className="task-content">
                  <p className="task-title">Follow up with high priority leads</p>
                  <span className="task-count">{stats.high || 0} leads pending</span>
                </div>
              </div>
              <div className="task-item">
                <div className="task-icon">📧</div>
                <div className="task-content">
                  <p className="task-title">Contact new leads</p>
                  <span className="task-count">{statusData.new} new leads</span>
                </div>
              </div>
              <div className="task-item">
                <div className="task-icon">✅</div>
                <div className="task-content">
                  <p className="task-title">Qualify contacted leads</p>
                  <span className="task-count">{statusData.contacted} contacted</span>
                </div>
              </div>
              <div className="task-item">
                <div className="task-icon">🎯</div>
                <div className="task-content">
                  <p className="task-title">Close qualified deals</p>
                  <span className="task-count">{statusData.qualified} qualified</span>
                </div>
              </div>
            </div>
          </div>
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

/* =====================
   VISUAL PIE CHART COMPONENT (SVG-based)
===================== */
function VisualPieChart({ data, total }) {
  let cumulativePercentage = 0;
  
  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);
  
  if (filteredData.length === 0) {
    return <div className="empty-state">No data available</div>;
  }
  
  return (
    <div className="visual-pie-chart">
      <svg viewBox="0 0 200 200" className="pie-svg">
        {filteredData.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          
          // Convert percentage to angles (starting from -90 degrees for top)
          const startAngle = (cumulativePercentage / 100) * 360 - 90;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360 - 90;
          
          const largeArcFlag = percentage > 50 ? 1 : 0;
          
          // Calculate coordinates
          const x1 = 100 + 80 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 100 + 80 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 100 + 80 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 100 + 80 * Math.sin((Math.PI * endAngle) / 180);
          
          // Create path for pie slice
          const pathData = [
            `M 100 100`,
            `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
            `A 80 80 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
            `Z`
          ].join(' ');
          
          cumulativePercentage += percentage;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="#1e293b"
              strokeWidth="2"
              className="pie-segment"
              title={`${item.name}: ${item.value} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
        <circle cx="100" cy="100" r="50" fill="#1e293b" />
        <text x="100" y="98" textAnchor="middle" dominantBaseline="middle" fill="#bfdbfe" fontSize="16" fontWeight="700">
          {total}
        </text>
        <text x="100" y="115" textAnchor="middle" dominantBaseline="middle" fill="#93c5fd" fontSize="11" fontWeight="600">
          Total
        </text>
      </svg>
      <div className="pie-legend">
        {filteredData.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={index} className="pie-legend-item">
              <div className="pie-legend-color" style={{ backgroundColor: item.color }}></div>
              <span className="pie-legend-label">{item.name}</span>
              <span className="pie-legend-value">{item.value} ({percentage.toFixed(1)}%)</span>
            </div>
          );
        })}
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


