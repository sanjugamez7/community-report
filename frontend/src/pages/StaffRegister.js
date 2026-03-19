import React, { useState } from "react";
import { API } from "../services/api";

import { Link, useNavigate } from "react-router-dom";

function StaffRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const EyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );

  const inputWrapperStyle = {
    position: "relative",
    width: "240px"
  };

  const passwordInputStyle = {
    paddingRight: "34px",
    width: "100%",
    boxSizing: "border-box"
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "6px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    color: "#333"
  };

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    email: "",
    phone: "",
    employeeId: "",
    password: "",
    confirmPassword: ""
  });

  const [certificate, setCertificate] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatStaffId = (value) => {
    const upper = value.toUpperCase();
    const digits = upper.replace(/[^0-9]/g, "").slice(0, 3);

    if (upper.length === 0) return "";
    if (upper === "P") return "P";
    if (upper === "PT") return "PT";

    // Once user types PTC, auto-add -STF- and only keep 3 digits
    if (upper.startsWith("PTC")) {
      return `PTC-STF-${digits}`;
    }

    // If user pastes digits or any other format, normalize to standard
    if (digits.length > 0) {
      return `PTC-STF-${digits}`;
    }

    return "";
  };

  const handleStaffIdChange = (e) => {
    const formatted = formatStaffId(e.target.value);
    setFormData((prev) => ({
      ...prev,
      employeeId: formatted
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!certificate) {
      alert("Please upload certificate");
      return;
    }

    try {
      const sendData = new FormData();

      sendData.append("name", formData.name);
      sendData.append("department", formData.department);
      sendData.append("email", formData.email);
      sendData.append("phone", formData.phone);
      sendData.append("employeeId", formData.employeeId);
      sendData.append("password", formData.password);
      sendData.append("certificate", certificate);

      await API.post(
        "/authority/register",
        sendData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Registration submitted. Waiting for admin approval.");
      navigate("/staff-login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div>
      <h2>Staff Registration</h2>

      <form onSubmit={handleRegister} encType="multipart/form-data">

        <input
          type="text"
          name="name"
          placeholder="Staff Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option value="Waste Management / Sanitation">
            Waste Management / Sanitation
          </option>
          <option value="Road Maintenance">
            Road Maintenance
          </option>
          <option value="KSEB">
            KSEB
          </option>
          <option value="Water Supply">
            Water Supply
          </option>
          <option value="Public Health">
            Public Health
          </option>
          <option value="Public Property Maintenance">
            Public Property Maintenance
          </option>
        </select>
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="employeeId"
          placeholder="PTC-STF-001"
          value={formData.employeeId}
          onChange={handleStaffIdChange}
          maxLength={11}
          required
        />
        <br /><br />

        <div style={inputWrapperStyle}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="password-input"
            style={passwordInputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButtonStyle}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {EyeIcon}
          </button>
        </div>
        <div style={{ fontSize: "12px", marginTop: "6px" }}>
          <p>Choose a strong password:</p>
          <ul>
            <li>
              At least 8 characters:{" "}
              {formData.password.length >= 8 ? "OK" : "Missing"}
            </li>
            <li>
              Uppercase letter:{" "}
              {/[A-Z]/.test(formData.password) ? "OK" : "Missing"}
            </li>
            <li>
              Lowercase letter:{" "}
              {/[a-z]/.test(formData.password) ? "OK" : "Missing"}
            </li>
            <li>
              Number:{" "}
              {/[0-9]/.test(formData.password) ? "OK" : "Missing"}
            </li>
            <li>
              Special character:{" "}
              {/[^A-Za-z0-9]/.test(formData.password) ? "OK" : "Missing"}
            </li>
            <li>
              Not allowed: spaces{" "}
              {/\s/.test(formData.password) ? "(Found)" : "(OK)"}
            </li>
          </ul>
        </div>
        <br /><br />

        <div style={inputWrapperStyle}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={passwordInputStyle}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={eyeButtonStyle}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {EyeIcon}
          </button>
        </div>
        <p style={{ fontSize: "12px", marginTop: "6px" }}>
          {formData.confirmPassword.length === 0
            ? ""
            : formData.password === formData.confirmPassword
              ? "Password match"
              : "Password mismatch"}
        </p>
        <br /><br />

        <label htmlFor="departmentLicense">Upload Department License</label>
        <br />
        <input
          id="departmentLicense"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setCertificate(e.target.files[0])}
          required
        />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      <br />

      <p>
        Already Registered?{" "}
        <Link to="/staff-login">Login Here</Link>
      </p>
    </div>
  );
}

export default StaffRegister;
