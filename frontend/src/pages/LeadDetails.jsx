import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { getUserRole } from "../utils/auth";

export default function LeadDetails() {
  const { id } = useParams();
  const role = getUserRole();
  const [lead, setLead] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLead = async () => {
    const res = await api.get(`/leads/${id}`);
    setLead(res.data);
    setStatus(res.data.status);
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const updateStatus = async () => {
    await api.put(`/leads/${id}`, { status });
    fetchLead();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setLoading(true);
    await api.post(`/leads/${id}/notes`, { content: note });
    setNote("");
    await fetchLead();
    setLoading(false);
  };

  if (!lead) {
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

          {/* LEAD DETAILS SKELETON */}
          <div className="lead-details-card skeleton-card">
            <div className="skeleton skeleton-title-small" style={{ marginBottom: "20px" }}></div>
            <div className="info-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="info-box">
                  <div className="skeleton skeleton-label" style={{ marginBottom: "8px" }}></div>
                  <div className="skeleton" style={{ height: "24px", width: "60%" }}></div>
                </div>
              ))}
            </div>
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
        <a href="/analytics">Analytics</a>
        <a href="/settings">Settings</a>
        <div style={{ marginTop: "40px", opacity: 0.7, fontSize: "13px" }}>
          Role: <span className="role-badge">{role}</span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="lead-details">
          {/* INFO */}
          <div className="lead-info-card">
            <h2>{lead.name}</h2>
            <div className="sub">{lead.email}</div>

            <div className="info-grid">
              <div className="info-box">
                <span>Phone</span>
                <p>{lead.phone}</p>
              </div>
              <div className="info-box">
                <span>Company</span>
                <p>{lead.company || "—"}</p>
              </div>
              <div className="info-box">
                <span>Priority</span>
                <p>{lead.priority}</p>
              </div>
              <div className="info-box">
                <span>Status</span>
                <p>{lead.status}</p>
              </div>
            </div>
          </div>

          {/* STATUS UPDATE */}
          <div className="status-update">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Closed</option>
            </select>

            <button onClick={updateStatus}>Update Status</button>
          </div>

          {/* NOTES (NO DELETE) */}
          <div className="notes-card">
            <h3>Notes</h3>

            <textarea
              rows="4"
              placeholder="Write a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button onClick={addNote} disabled={loading}>
              {loading ? "Adding..." : "Add Note"}
            </button>

            {lead.notes.length === 0 ? (
              <div className="empty">No notes yet</div>
            ) : (
              lead.notes.map((n) => (
                <div key={n._id} className="note-item">
                  <small style={{ color: "#9CA3AF" }}>
                    {n.createdBy?.name || "User"} •{" "}
                    {new Date(n.createdAt).toLocaleString()}
                  </small>

                  <p>{n.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
