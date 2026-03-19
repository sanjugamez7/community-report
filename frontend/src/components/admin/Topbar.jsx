import { useNavigate } from "react-router-dom";
import { menuItems } from "./Sidebar";
import "./Topbar.css";
// Props: activePage (string) — used to show the current section title
function Topbar({ activePage }) {
  const navigate = useNavigate();
  const label    = menuItems.find((m) => m.key === activePage)?.label || "";

  // Remove admin token from localStorage and go back to login
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <header className="topbar">
      <h1 className="topbar__title">{label}</h1>

      <div className="topbar__right">
        {/* Admin info */}
        <div className="topbar__profile">
          <div className="topbar__avatar">A</div>
          <div>
            <p className="topbar__name">Admin</p>
            <p className="topbar__role">Super Admin</p>
          </div>
        </div>

        {/* Logout button */}
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;