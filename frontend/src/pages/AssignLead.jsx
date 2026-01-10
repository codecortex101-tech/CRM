import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getUserRole } from "../utils/auth";

export default function AssignLead() {
  const { id } = useParams(); // lead id
  const navigate = useNavigate();
  const role = getUserRole();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch users (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const assignLead = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.put(`/leads/${id}`, {
        assignedTo: selectedUser,
      });

      setSuccess("Lead assigned successfully");
      setTimeout(() => navigate("/leads"), 1200);
    } catch (err) {
      console.error(err);
      setError("Failed to assign lead");
    } finally {
      setLoading(false);
    }
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

      {/* MAIN */}
      <main className="main">
        <div className="assign-container">
          <div className="assign-card">
            <h2>Assign Lead</h2>
            <p className="sub">
              Select a team member to assign this lead
            </p>

            {error && <div className="assign-error">{error}</div>}
            {success && <div className="assign-success">{success}</div>}

            {/* USER SELECT */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.25) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.5)",
                color: "#ffffff",
                padding: "14px",
                borderRadius: "14px",
                marginBottom: "20px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            {/* ACTION */}
            <button
              onClick={assignLead}
              disabled={loading}
              className="assign-btn"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "16px",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              {loading ? "Assigning..." : "Assign Lead"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
