import React, { useEffect, useState } from "react";
import { API, authHeader, fileUrl, getCitizenToken } from "../services/api";

function CitizenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const token = getCitizenToken();
    if (!token) return;

    API
      .get("/complaints", authHeader(token))
      .then((res) => {
        setComplaints(res.data);
      })
      .catch(() => {
        setComplaints([]);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Complaints</h2>

      <table border="1" width="100%" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td>
              <td>{c.department}</td>
              <td>{c.status}</td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    const token = getCitizenToken();
                    if (!token) return;
                    setLoadingDetails(true);
                    API
                      .get(`/complaints/${c._id}`, authHeader(token))
                      .then((res) => {
                        setSelectedComplaint(res.data);
                      })
                      .finally(() => setLoadingDetails(false));
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
          {complaints.length === 0 && (
            <tr>
              <td colSpan="5">No complaints yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {loadingDetails && <p>Loading details...</p>}

      {selectedComplaint && !loadingDetails && (
        <div style={{ marginTop: "20px" }}>
          <h3>Complaint Details</h3>
          <p><b>Title:</b> {selectedComplaint.title}</p>
          <p><b>Department:</b> {selectedComplaint.department}</p>
          <p><b>Status:</b> {selectedComplaint.status}</p>
          {selectedComplaint.status === "Reported as Fake" && (
            <p><b>Notice:</b> This complaint was reported as fake by staff.</p>
          )}
          <p><b>Date:</b> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
          <p><b>Description:</b> {selectedComplaint.description}</p>
          <p><b>Ward Number:</b> {selectedComplaint.wardNumber}</p>
          <p><b>Street / Area:</b> {selectedComplaint.streetArea}</p>
          <p><b>Landmark:</b> {selectedComplaint.landmark}</p>
          {selectedComplaint.image && (
            <img
              src={fileUrl(selectedComplaint.image)}
              alt="Complaint"
              width="300"
            />
          )}
          {selectedComplaint.fakeReason && (
            <p><b>Reason:</b> {selectedComplaint.fakeReason}</p>
          )}
          {selectedComplaint.response && (
            <p><b>Staff Response:</b> {selectedComplaint.response}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CitizenComplaints;
