import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API, authHeader, fileUrl, getStaffToken } from "../services/api";

function StaffComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [fakeReason, setFakeReason] = useState("");

  useEffect(() => {
    const token = getStaffToken();
    if (!token) {
      navigate("/staff-login");
      return;
    }

    const fetchComplaint = async () => {
      try {
        const res = await API.get(`/complaints/${id}`, authHeader(token));
        setComplaint(res.data);

        // When staff opens a pending complaint, mark it "In Progress"
        if (res.data.status === "Pending") {
          const updated = await API.put(
            `/complaints/${id}/status`,
            { status: "In Progress" },
            authHeader(token)
          );
          setComplaint(updated.data);
        }
      } catch {
        setComplaint(null);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const markResolved = () => {
    const token = getStaffToken();
    if (!token || !complaint) return;

    API
      .put(`/complaints/${id}/status`, { status: "Resolved" }, authHeader(token))
      .then(() => {
        navigate("/staff-dashboard");
      });
  };

  const reportAsFake = () => {
    const token = getStaffToken();
    if (!token || !complaint) return;

    API
      .put(`/complaints/${id}/report-fake`, { reason: fakeReason }, authHeader(token))
      .then((res) => {
        setComplaint(res.data);
        navigate("/staff-dashboard");
      });
  };

  const printComplaint = () => {
    // Browser print dialog (user can "Save as PDF")
    window.print();
  };

  if (!complaint) return <p>Complaint not found.</p>;

  const citizenName = complaint.citizenId?.name || "";
  const citizenEmail = complaint.citizenId?.email || "";
  const citizenAddress = complaint.citizenId?.address || "";

  return (
    <div style={{ padding: "20px" }}>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <h2>Complaint Details</h2>

      <h3>Citizen Registered Details</h3>
      {citizenName && <p><b>Name:</b> {citizenName}</p>}
      {citizenEmail && <p><b>Email:</b> {citizenEmail}</p>}
      <p><b>Registered Address:</b> {citizenAddress || "Not provided"}</p>

      <hr />

      <h3>Submitted Complaint</h3>
      <p><b>Title:</b> {complaint.title}</p>
      <p><b>Description:</b> {complaint.description}</p>
      <p><b>Department:</b> {complaint.department}</p>
      {complaint.panchayath && <p><b>Panchayath:</b> {complaint.panchayath}</p>}
      <p><b>Ward Number:</b> {complaint.wardNumber}</p>
      <p><b>Street / Area:</b> {complaint.streetArea}</p>
      <p><b>Landmark:</b> {complaint.landmark}</p>
      <p><b>Status:</b> {complaint.status}</p>
      <p><b>Date:</b> {new Date(complaint.createdAt).toLocaleDateString()}</p>
      {complaint.fakeReason && (
        <p><b>Fake Report Reason:</b> {complaint.fakeReason}</p>
      )}

      {complaint.image && (
        <img src={fileUrl(complaint.image)} alt="Complaint" width="300" />
      )}

      <br /><br />

      <div className="no-print">
        <button onClick={markResolved}>Resolved</button>
        <button onClick={printComplaint} style={{ marginLeft: "10px" }}>
          Print Complaint
        </button>
        <br /><br />
        <textarea
          placeholder="Reason for reporting as fake (optional)"
          rows="3"
          value={fakeReason}
          onChange={(e) => setFakeReason(e.target.value)}
        />
        <br />
        <button onClick={reportAsFake}>Report as Fake</button>
      </div>
    </div>
  );
}

export default StaffComplaintDetails;
