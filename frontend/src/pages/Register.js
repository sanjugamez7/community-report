import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    verificationIdType: "Aadhar",
  });

  const [verificationIdImage, setVerificationIdImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setVerificationIdImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("password", formData.password);
    data.append("verificationIdType", formData.verificationIdType);
    data.append("verificationIdImage", verificationIdImage);

    try {
      await API.post("/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Signup successful. Await admin approval.");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Citizen Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <select
          name="verificationIdType"
          value={formData.verificationIdType}
          onChange={handleChange}
          required
        >
          <option value="Aadhar">Aadhar</option>
          <option value="Passport">Passport</option>
          <option value="VoterID">Voter ID</option>
          <option value="PAN">PAN</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <button type="submit">Register</button>

      </form>
    </div>
  );
}

export default Register;
