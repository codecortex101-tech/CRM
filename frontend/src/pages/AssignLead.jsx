import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function AssignLead() {
  const { id } = useParams(); // lead id
  const navigate = useNavigate();

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
        <h2>CRM X</h2>
        <a href="/">Dashboard</a>
        <a href="/leads">Leads</a>
        <a className="active">Assign Lead</a>
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
                background: "#0B0F1A",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#E5E7EB",
                padding: "14px",
                borderRadius: "14px",
                marginBottom: "20px",
                fontSize: "14px",
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
