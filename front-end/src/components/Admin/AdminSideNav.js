import React from "react";
import "../../styles/sidenav.css";
import { useLocation, Link } from "react-router-dom";

function AdminSideNav({ logo }) {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");
  const navClass = isDashboard ? "side-dash" : "";

  return (
    <>
      <div className={"sidebar " + navClass}>
        <div className="logo-container">
          <img src={logo} alt="logo-img" />
        </div>
        <div className="sidebar-content">
          <ul>
            <li>
              <Link to="/admin/dashboard">Staff List</Link>
            </li>
            <li>
              <Link to="/admin/edit-profile">Edit Profile</Link>
            </li>
            <li>
              <Link to="/admin/add-member">Add Staff</Link>
            </li>
            <li>
              <Link to="/admin/export-data">Export Data</Link>
            </li>
            <li>
              <Link to="/admin/leave-applications">Leave Applications</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminSideNav;
