import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API, authHeader, fileUrl, getAdminToken } from "../services/api";

function VerifyStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin-login");
      return;
    }

    API
      .get(`/admin/authority/${id}`, authHeader(token))
      .then((res) => {
        setStaff(res.data);
      })
      .catch(() => {
        setError("Staff not found.");
      });
  }, [id, navigate]);

  const approve = async () => {
    const token = getAdminToken();
    if (!token) return navigate("/admin-login");
    await API.put(`/admin/approve-authority/${id}`, {}, authHeader(token));
    alert("Staff Approved");
  };

  const reject = async () => {
    const token = getAdminToken();
    if (!token) return navigate("/admin-login");
    await API.put(`/admin/reject-authority/${id}`, {}, authHeader(token));
    alert("Staff Rejected");
  };

  if (error) return <p>{error}</p>;
  if (!staff) return <p>Loading...</p>;

  return (
    <div>
      <h2>STAFF VERIFICATION</h2>

      <button onClick={() => navigate("/admin/staff")}>BACK</button>

      <p>Name: {staff.name}</p>
      <p>Email: {staff.email}</p>
      <p>Phone: {staff.phone}</p>
      <p>Department: {staff.department}</p>
      <p>Employee ID: {staff.employeeId}</p>
      <p>Status: {staff.status}</p>

      {staff.certificate && (
        <>
          <img
            src={fileUrl(staff.certificate)}
            alt="Department License"
            width="300"
          />
          <br />
          <a
            href={fileUrl(staff.certificate)}
            target="_blank"
            rel="noreferrer"
          >
            OPEN CERTIFICATE
          </a>
        </>
      )}

      <br /><br />

      <button onClick={approve}>APPROVE</button>
      <button onClick={reject}>REJECT</button>
    </div>
  );
}

export default VerifyStaff;
