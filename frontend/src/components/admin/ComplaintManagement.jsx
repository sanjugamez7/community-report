import { useState, useEffect } from "react";
import StatusBadge from "./shared/StatusBadge";
import Spinner from "./shared/Spinner";
import API, { adminAuth } from "./shared/authHeaders";
import "./shared/common.css";
import "./ComplaintManagement.css";
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search)       params.q      = search;
      if (filterStatus) params.status = filterStatus;

      const res = await API.get("/admin/complaints", { ...adminAuth(), params });
      setComplaints(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  useEffect(() => { fetchComplaints(); }, [filterStatus]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/admin/complaints/${id}/status`, { status: newStatus }, adminAuth());
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Complaint Management</h2>

      <div className="filter-bar">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, department, ward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchComplaints()}
          />
        </div>
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
          <option value="Reported as Fake">Reported as Fake</option>
        </select>
        <button className="btn btn-primary" onClick={fetchComplaints}>Search</button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="table-card">
        <div className="table-wrapper">
          {loading ? <Spinner /> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Citizen</th>
                  <th>Ward</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 && (
                  <tr><td colSpan="7" className="empty-row">No complaints found.</td></tr>
                )}
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.title}</td>
                    <td>{c.citizenId?.name || "N/A"}</td>
                    <td>{c.wardNumber}</td>
                    <td>{c.department}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="inline-select"
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintManagement;