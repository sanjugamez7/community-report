import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CitizenLogin from "./pages/CitizenLogin";
import Register from "./pages/Register";
import IssueList from "./components/IssueList";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StaffLogin from "./pages/StaffLogin";
import StaffRegister from "./pages/StaffRegister";
import VerifyCitizen from "./pages/VerifyCitizen";
import VerifyStaff from "./pages/VerifyStaff";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenComplaints from "./pages/CitizenComplaints";
import CitizenProfileSettings from "./pages/CitizenProfileSettings";
import StaffDashboard from "./pages/StaffDashboard";
import StaffComplaintDetails from "./pages/StaffComplaintDetails";
import StaffNotifications from "./pages/StaffNotifications";

function App() {
  return (
    <Router>
      <Routes>

        {/* ── General ── */}
        <Route path="/"        element={<Login />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/issues"  element={<IssueList />} />

        {/* ── Citizen ── */}
        <Route path="/citizen-login"     element={<CitizenLogin />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen-complaints"element={<CitizenComplaints />} />
        <Route path="/citizen-profile"   element={<CitizenProfileSettings />} />
        <Route path="/verify-citizen/:id"element={<VerifyCitizen />} />

        {/* ── Staff ── */}
        <Route path="/staff-login"            element={<StaffLogin />} />
        <Route path="/authority-register"     element={<StaffRegister />} />
        <Route path="/staff-dashboard"        element={<StaffDashboard />} />
        <Route path="/staff-complaints/:id"   element={<StaffComplaintDetails />} />
        <Route path="/staff-notifications"    element={<StaffNotifications />} />
        <Route path="/verify-staff/:id"       element={<VerifyStaff />} />

        {/* ── Admin ── */}
        {/* AdminDashboard contains all admin sections inside it (sidebar navigation) */}
        <Route path="/admin-login"      element={<AdminLogin />} />
        <Route path="/admin/dashboard"  element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;