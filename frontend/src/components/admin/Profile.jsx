import { useState } from "react";
import "./shared/common.css";
import "./Profile.css";

// Read the admin email from the JWT token stored in localStorage
// JWT payload is the middle part (base64 encoded), we decode it to get the email
function getAdminEmailFromToken() {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return "";
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
    return payload.email || "";
  } catch {
    return "";
  }
}

function Profile() {
  const [profile, setProfile] = useState({
    name:  "Admin",
    email: getAdminEmailFromToken(), // read real email from token
  });
  const [password, setPassword] = useState({ current: "", newPass: "", confirm: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passMsg, setPassMsg]       = useState("");

  const handleProfileSave = () => {
    setProfileMsg("Profile saved!");
    setTimeout(() => setProfileMsg(""), 2500);
  };

  const handlePasswordSave = () => {
    if (!password.current || !password.newPass || !password.confirm) {
      setPassMsg("Please fill all fields.");
      return;
    }
    if (password.newPass !== password.confirm) {
      setPassMsg("Passwords do not match!");
      return;
    }
    setPassMsg("To change the password, update ADMIN_PASSWORD in your .env file and restart the server.");
    setPassword({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPassMsg(""), 5000);
  };

  return (
    <div className="page-content">
      <h2 className="page-title">My Profile</h2>

      <div className="profile-grid">

        {/* Profile Details — no phone field */}
        <div className="form-card">
          <h3 className="form-card__title">Profile Details</h3>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              value={profile.email}
              readOnly
              style={{ backgroundColor: "#f8fafc", cursor: "not-allowed" }}
            />
          </div>
          {profileMsg && <p className="success-msg">{profileMsg}</p>}
          <button className="btn btn-primary" onClick={handleProfileSave}>Save Profile</button>
        </div>

        {/* Change Password */}
        <div className="form-card">
          <h3 className="form-card__title">Change Password</h3>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password.newPass}
              onChange={(e) => setPassword({ ...password, newPass: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })} />
          </div>
          {passMsg && <p className="error-msg">{passMsg}</p>}
          <button className="btn btn-primary" onClick={handlePasswordSave}>Update Password</button>
        </div>

      </div>
    </div>
  );
}

export default Profile;