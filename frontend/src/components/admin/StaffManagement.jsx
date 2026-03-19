import { useState, useEffect } from "react";
import StatusBadge from "./shared/StatusBadge";
import Spinner from "./shared/Spinner";
import API, { adminAuth } from "./shared/authHeaders";
import "./shared/common.css";
import "./StaffManagement.css";

function StaffManagement() {
  const [staff, setStaff]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("all");

  const endpointMap = {
    all:      "/admin/staff",
    pending:  "/admin/pending-authorities",
    approved: "/admin/approved-authorities",
    rejected: "/admin/rejected-authorities",
  };

  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(endpointMap[filter], adminAuth());
      setStaff(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  useEffect(() => { fetchStaff(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve-authority/${id}`, {}, adminAuth());
      fetchStaff();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/reject-authority/${id}`, {}, adminAuth());
      fetchStaff();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Staff Management</h2>

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
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Employee ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr><td colSpan="7" className="empty-row">No staff found.</td></tr>
                )}
                {staff.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="avatar-cell">
                        <div className="avatar">{s.name?.[0] || "S"}</div>
                        {s.name}
                      </div>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>{s.phone}</td>
                    <td>{s.employeeId}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="actions-cell">
                      {s.status === "pending" && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(s._id)}>Approve</button>
                          <button className="btn btn-sm btn-danger"  onClick={() => handleReject(s._id)}>Reject</button>
                        </>
                      )}
                      {s.status === "approved" && (
                        <button className="btn btn-sm btn-warning" onClick={() => handleReject(s._id)}>Revoke</button>
                      )}
                      {s.status === "rejected" && (
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(s._id)}>Re-approve</button>
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

export default StaffManagement;