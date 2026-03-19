import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, authHeader, getAdminToken } from "../services/api";

function CitizenManagement() {

  const navigate = useNavigate();

  const [tab, setTab] = useState("pending");
  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const token = getAdminToken();
        if (!token) {
          navigate("/admin-login");
          return;
        }

        let path = "/admin/pending-citizens";
        if (tab === "approved") path = "/admin/approved-citizens";
        if (tab === "rejected") path = "/admin/rejected-citizens";

        const res = await API.get(path, authHeader(token));
        setCitizens(res.data);
      } catch {
        setCitizens([]);
      }
    };

    fetchCitizens();
  }, [tab, navigate]);

  return (

    <div>

      <h3>CITIZEN MANAGEMENT</h3>

      <button onClick={() => navigate("/admin/dashboard")}>BACK</button>

      <div style={{ marginTop: "10px" }}>
      <button onClick={() => setTab("pending")}>PENDING</button>
      <button onClick={() => setTab("approved")}>APPROVED</button>
      <button onClick={() => setTab("rejected")}>REJECTED</button>
      </div>


      <table border="1" style={{ marginTop: "10px" }}>

        <thead>

          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>VIEW ID</th>
          </tr>

        </thead>

        <tbody>

          {citizens.map((user) => (

            <tr key={user._id}>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>

                <a href={`/verify-citizen/${user._id}`}>
                  VIEW
                </a>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default CitizenManagement;
