import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../services/api";


function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/authority/login", { email, password });

      localStorage.setItem("authorityToken", res.data.token);
      if (res.data.authority?.department) {
        localStorage.setItem("staffDepartment", res.data.authority.department);
      }
      localStorage.setItem("staffEmail", email);
      alert("Login Successful");
      window.location.href = "/staff-dashboard";

    } catch (error) {
      const serverMessage = error.response?.data?.message;
      const finalMessage = serverMessage || "Login Failed";
      if (finalMessage === "Your account is pending admin approval.") {
        alert(finalMessage);
      } else {
        alert(finalMessage);
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Staff Login</h2>

      <input
        type="email"
        name="citizenEmail"
        autoComplete="off"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />

      <input
        type="password"
        name="citizenPassword"
        autoComplete="new-password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <p>
        New Authority? <Link to="/authority-register">Register Here</Link>
      </p>


      <button type="submit">Login</button>

    </form>


  );
}

export default StaffLogin;
