import React from "react";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
function Navbar({ logo}) {
  const navigate = useNavigate();
  function signOut() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <>
      <nav>
        <div>
          <img src={logo} alt="logo-img" className="nav-logo" />
        </div>

        <div className="nav-section">
          <p onClick={()=>navigate("/dashboard")}>Home</p>
          <p onClick={()=>navigate("/apply-leave")}>Apply Leave</p>
          <p onClick={()=>navigate("/leaves")}>All Leaves</p>      
          <button onClick={signOut}>Sign out</button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
