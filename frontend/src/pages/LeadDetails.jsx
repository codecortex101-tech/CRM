import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function LeadDetails() {
  const { id } = useParams();
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
        <div className="main">Loading lead...</div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>CRM X</h2>
        <a href="/">Dashboard</a>
        <a href="/leads">Leads</a>
        <a className="active">Lead Details</a>
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
