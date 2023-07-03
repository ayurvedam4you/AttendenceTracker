import React from "react";
import "../../styles/navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

function AdminNavbar({ logo }) {
  const navigate = useNavigate();
  const location = useLocation();

  function signOut() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  const isDashboard = location.pathname.includes("/dashboard");
  const navClass = isDashboard ? "nav-dash" : "";

  return (
    <>
      <nav className={navClass}>
        <div>
          <img src={logo} alt="logo-img" />
        </div>
        <div>
          <button onClick={signOut}>Sign out</button>
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
