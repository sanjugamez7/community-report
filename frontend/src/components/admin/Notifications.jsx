import { useState } from "react";
import "./shared/common.css";
import "./Notifications.css";

const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
);

function Notifications() {
  const [to, setTo]           = useState("All Citizens");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);

  // UI-ready send handler
  // TODO: connect to POST /api/notifications/admin when backend route is added
  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Notifications</h2>

      {/* Send Notification Form */}
      <div className="form-card">
        <h3 className="form-card__title">Send Notification</h3>

        <div className="info-note">
          ℹ️ Notifications are sent automatically when complaints are created or
          updated. Use this form to send a manual announcement.
        </div>

        <div className="form-group">
          <label className="form-label">Send To</label>
          <select className="form-input" value={to} onChange={(e) => setTo(e.target.value)}>
            <option>All Citizens</option>
            <option>Staff</option>
            <option>All Users</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea
            className="form-input form-textarea"
            placeholder="Type your announcement..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {sent && <p className="success-msg">✓ Notification sent!</p>}

        <button className="btn btn-primary" onClick={handleSend}>
          <SendIcon /> Send
        </button>
      </div>

      {/* How notifications work in this system */}
      <div className="form-card">
        <h3 className="form-card__title">How Notifications Work</h3>
        <div className="notif-info-grid">
          <div className="notif-info-item">
            <span className="badge badge-inprogress">Citizens</span>
            <p>Receive a notification when their complaint is marked as fake by staff.</p>
          </div>
          <div className="notif-info-item">
            <span className="badge badge-pending">Staff</span>
            <p>Receive a notification when a new complaint is submitted in their department.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;