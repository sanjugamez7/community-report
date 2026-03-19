import { useState, useEffect } from "react";
import StatusBadge from "./shared/StatusBadge";
import Spinner from "./shared/Spinner";
import API, { adminAuth } from "./shared/authHeaders";
import "./shared/common.css";
import "./CitizenManagement.css";

function CitizenManagement() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("all");

  const endpointMap = {
    all:      "/admin/citizens",
    pending:  "/admin/pending-citizens",
    approved: "/admin/approved-citizens",
    rejected: "/admin/rejected-citizens",
  };

  const fetchCitizens = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(endpointMap[filter], adminAuth());
      setCitizens(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch citizens");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  useEffect(() => { fetchCitizens(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve-citizen/${id}`, {}, adminAuth());
      fetchCitizens();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/reject-citizen/${id}`, {}, adminAuth());
      fetchCitizens();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBlock = async (id) => {
    try {
      await API.put(`/admin/deactivate-citizen/${id}`, {}, adminAuth());
      setCitizens((prev) => prev.map((c) => c._id === id ? { ...c, isActive: false } : c));
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUnblock = async (id) => {
    try {
      await API.put(`/admin/activate-citizen/${id}`, {}, adminAuth());
      setCitizens((prev) => prev.map((c) => c._id === id ? { ...c, isActive: true } : c));
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Citizen Management</h2>

      <div className="tab-bar">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${filter === tab ? "tab-btn--active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="table-card">
        <div className="table-wrapper">
          {loading ? <Spinner /> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Ward</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {citizens.length === 0 && (
                  <tr><td colSpan="7" className="empty-row">No citizens found.</td></tr>
                )}
                {citizens.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="avatar-cell">
                        <div className="avatar avatar--citizen">{c.name?.[0] || "C"}</div>
                        {c.name}
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone || "—"}</td>
                    <td>{c.wardNumber || "—"}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <span className={c.isActive === false ? "badge badge-rejected" : "badge badge-resolved"}>
                        {c.isActive === false ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {c.status === "pending" && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(c._id)}>Approve</button>
                          <button className="btn btn-sm btn-danger"  onClick={() => handleReject(c._id)}>Reject</button>
                        </>
                      )}
                      {c.status === "approved" && (
                        c.isActive === false
                          ? <button className="btn btn-sm btn-success" onClick={() => handleUnblock(c._id)}>Unblock</button>
                          : <button className="btn btn-sm btn-warning" onClick={() => handleBlock(c._id)}>Block</button>
                      )}
                      {c.status === "rejected" && (
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(c._id)}>Re-approve</button>
                      )}
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

export default CitizenManagement;