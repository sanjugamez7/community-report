import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, authHeader, getCitizenToken, multipartAuthHeader } from "../services/api";

function CitizenDashboard() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    panchayath: "Puthucode",
    wardNumber: "",
    streetArea: "",
    landmark: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const token = getCitizenToken();
    if (!token) return;

    try {
      const res = await API.get("/notifications", authHeader(token));
      const messages = (res.data || []).map((n) => n.message);
      setNotifications(messages);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    setShowProfileMenu(false);
    if (next) fetchNotifications();
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const onProfileSettings = () => {
    setShowProfileMenu(false);
    navigate("/citizen-profile");
  };

  const onMyComplaints = () => {
    setShowProfileMenu(false);
    navigate("/citizen-complaints");
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("citizenEmail");
    navigate("/citizen-login");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData({ ...formData, image: file });

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.wardNumber) newErrors.wardNumber = "Ward number is required";
    if (!formData.streetArea.trim()) newErrors.streetArea = "Street/Area is required";
    if (!formData.landmark.trim()) newErrors.landmark = "Landmark is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) return;

    const token = getCitizenToken();
    if (!token) {
      alert("Please login again.");
      navigate("/citizen-login");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("department", formData.department);
    data.append("panchayath", formData.panchayath);
    data.append("wardNumber", formData.wardNumber);
    data.append("streetArea", formData.streetArea);
    data.append("landmark", formData.landmark);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    API
      .post("/complaints", data, multipartAuthHeader(token))
      .then((res) => {
        setComplaints([res.data, ...complaints]);
        setFormData({
          title: "",
          department: "",
          panchayath: "Puthucode",
          wardNumber: "",
          streetArea: "",
          landmark: "",
          description: "",
          image: null,
        });
        setImagePreview("");
        setErrors({});
        setLoading(false);
        const msg = "Complaint submitted successfully.";
        setSuccessMessage(msg);
        alert(msg);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.response?.data?.message || "Complaint submission failed");
      });
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Citizen Dashboard</h2>

        <div style={{ display: "flex", gap: "16px", position: "relative" }}>
          <div ref={notificationRef} style={{ position: "relative" }}>
            <button onClick={toggleNotifications} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>

            {showNotifications && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "10px",
                  width: "200px",
                  zIndex: 10,
                }}
              >
                {notifications.length === 0 ? (
                  <p>No new notifications</p>
                ) : (
                  <ul>
                    {notifications.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div ref={profileRef} style={{ position: "relative" }}>
            <button onClick={toggleProfileMenu} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "10px",
                  width: "180px",
                  zIndex: 100,
                }}
              >
                <button
                  type="button"
                  onClick={onMyComplaints}
                  style={{ display: "block", width: "100%", textAlign: "left" }}
                >
                  My Complaints
                </button>
                <button
                  type="button"
                  onClick={onProfileSettings}
                  style={{ display: "block", width: "100%", textAlign: "left" }}
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  style={{ display: "block", width: "100%", textAlign: "left" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ marginTop: "20px" }}>
          <h3>Register Complaint</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Complaint Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
            <br /><br />

            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Waste Management / Sanitation">Waste Management / Sanitation</option>
              <option value="Road Maintenance">Road Maintenance</option>
              <option value="KSEB">KSEB</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Public Health">Public Health</option>
              <option value="Public Property Maintenance">Public Property Maintenance</option>
            </select>
            {errors.department && <p style={{ color: "red" }}>{errors.department}</p>}
            <br /><br />

            <div>
              <h4>Location Details</h4>

              <label>
                Panchayath
                <br />
                <select
                  name="panchayath"
                  value={formData.panchayath}
                  onChange={handleInputChange}
                  disabled
                >
                  <option value="Puthucode">Puthucode</option>
                </select>
              </label>
              <br /><br />

              <label>
                Choose Ward
                <br />
                <select
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Ward</option>
                  <option value="THIRUVADI">Ward 1 - THIRUVADI</option>
                  <option value="KANAKKANNUR">Ward 2 - KANAKKANNUR</option>
                  <option value="MANAPPADAM">Ward 3 - MANAPPADAM</option>
                  <option value="ALINCHUVADU">Ward 4 - ALINCHUVADU</option>
                  <option value="CHANDHAPURA">Ward 5 - CHANDHAPURA</option>
                  <option value="THERUVU">Ward 6 - THERUVU</option>
                  <option value="THACHANADI">Ward 7 - THACHANADI</option>
                  <option value="ANJUMURI">Ward 8 - ANJUMURI</option>
                  <option value="GRAMAM">Ward 9 - GRAMAM</option>
                  <option value="APPAKKAD">Ward 10 - APPAKKAD</option>
                  <option value="KEEZHA">Ward 11 - KEEZHA</option>
                  <option value="VALAMKODE">Ward 12 - VALAMKODE</option>
                  <option value="KOTTARASSERY">Ward 13 - KOTTARASSERY</option>
                  <option value="THEKKEPOTTA">Ward 14 - THEKKEPOTTA</option>
                  <option value="PATTOLA">Ward 15 - PATTOLA</option>
                  <option value="AYYAPPANKUNNU">Ward 16 - AYYAPPANKUNNU</option>
                  <option value="Ward 17 - KARAPOTTA">Ward 17 - KARAPOTTA</option>
                  <option value="Ward 18 - MAATTUVAZHI">Ward 18 - MAATTUVAZHI</option>
                  <option value="Ward 19 - POORATHARA">Ward 19 - POORATHARA</option>
                </select>
              </label>
              {errors.wardNumber && <p style={{ color: "red" }}>{errors.wardNumber}</p>}
              <br /><br />

              <label>
                Street / Area Name
                <br />
                <input
                  type="text"
                  name="streetArea"
                  placeholder="Enter street or area name"
                  value={formData.streetArea}
                  onChange={handleInputChange}
                  required
                />
              </label>
              {errors.streetArea && <p style={{ color: "red" }}>{errors.streetArea}</p>}
              <br /><br />

              <label>
                Landmark
                <br />
                <input
                  type="text"
                  name="landmark"
                  placeholder="Enter nearby landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  required
                />
              </label>
              {errors.landmark && <p style={{ color: "red" }}>{errors.landmark}</p>}
              <br /><br />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
            <br /><br />

            <input type="file" accept="image/*" onChange={handleImageChange} />
            {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img src={imagePreview} alt="Preview" width="120" />
              </div>
            )}
            <br /><br />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>

        <div />
      </div>
    </div>
  );
}

export default CitizenDashboard;
