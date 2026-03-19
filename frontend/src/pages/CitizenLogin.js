import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../services/api";

function CitizenLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("citizenEmail", email);
      navigate("/citizen-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Citizen Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="citizenEmail"
          autoComplete="off"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          name="citizenPassword"
          autoComplete="new-password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      {/* Signup Option */}
      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <Link to="/register">Sign Up</Link>
      </p>

    </div>
  );
}

export default CitizenLogin;
