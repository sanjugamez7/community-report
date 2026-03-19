import { useState } from "react";
import "./AdminDashboard.css";
// Layout components
import Sidebar from "../components/admin/Sidebar";
import Topbar  from "../components/admin/Topbar";

// Page components
import ComplaintManagement from "../components/admin/ComplaintManagement";
import StaffManagement     from "../components/admin/StaffManagement";
import CitizenManagement   from "../components/admin/CitizenManagement";
import Notifications       from "../components/admin/Notifications";
import Profile             from "../components/admin/Profile";

// AdminDashboard is the root layout for the admin panel.
// It holds the active page in state and renders the correct component.
function AdminDashboard() {
  const [activePage, setActivePage] = useState("complaints");

  // Render the correct page based on sidebar selection
  const renderPage = () => {
    switch (activePage) {
      case "complaints":    return <ComplaintManagement />;
      case "staff":         return <StaffManagement />;
      case "citizens":       return <CitizenManagement />;
      case "notifications": return <Notifications />;
      case "profile":       return <Profile />;
      default:              return <ComplaintManagement />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Fixed left sidebar — passes activePage and setter */}
      <Sidebar active={activePage} setActive={setActivePage} />

      {/* Right side: topbar + page content */}
      <div className="admin-main">
        <Topbar activePage={activePage} />
        <main className="admin-body">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;