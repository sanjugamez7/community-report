import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, authHeader, fileUrl, getAdminToken } from "../services/api";

function VerifyCitizen() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin-login");
      return;
    }

    API
      .get(`/admin/citizen/${id}`, authHeader(token))
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setError("Citizen not found.");
      });

  }, [id, navigate]);

  const approve = async () => {
    const token = getAdminToken();
    if (!token) return navigate("/admin-login");

    await API.put(`/admin/approve-citizen/${id}`, {}, authHeader(token));

    alert("Citizen Approved");

  };

  const reject = async () => {
    const token = getAdminToken();
    if (!token) return navigate("/admin-login");

    await API.put(`/admin/reject-citizen/${id}`, {}, authHeader(token));

    alert("Citizen Rejected");

  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (

    <div>

      <h2>CITIZEN VERIFICATION</h2>

      <button onClick={() => navigate("/admin/citizens")}>BACK</button>

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>ID Type: {user.verificationIdType}</p>
      <p>Status: {user.status}</p>

      <img
        src={fileUrl(user.verificationIdImage)}
        alt="Citizen ID"
        width="300"
      />

      <br /><br />

      {user.status === "pending" && (
        <>
          <button onClick={approve}>
            APPROVE
          </button>

          <button onClick={reject}>
            REJECT
          </button>
        </>
      )}

    </div>

  );

}

export default VerifyCitizen;
