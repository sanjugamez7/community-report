import { useState } from "react";
import { API } from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">PTC</div>
          <div>
            <p className="login-logo-title">Puthucode Complaint Portal</p>
            <p className="login-logo-sub">Admin Panel</p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="login-heading">Admin Login</h2>
        <p className="login-subheading">Sign in to access the admin dashboard</p>

        {/* Error message */}
        {error && <p className="login-error">{error}</p>}

        {/* Form — same logic as original */}
        <form onSubmit={handleAdminLogin}>
          <div className="login-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

      </div>
    </div>
  );
}

export default AdminLogin;