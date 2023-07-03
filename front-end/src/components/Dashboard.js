import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Actions from "./Actions";
import "../styles/dashboard.css";
function Dashboard() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(localStorage.getItem("logo"));
  const [email, setEmail] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };

      axios
        .get("/api/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            setEmail(res.data.email);

            if (!logo) {
              axios.get("/api/admin/admin-details", { headers }).then((res) => {
                if (res.status === 200) {
                  localStorage.setItem("logo", res.data.logo);
                  setLogo(res.data.logo);
                }
              });
            }
          } else {
            navigate("/");
          }
        })
        .catch(() => localStorage.removeItem("token"));
    } else {
      navigate("/");
    }
  }, [logo, navigate]);
  return (
    <>
      <Navbar logo={logo}  />

      <div className="action-container">
        <Actions email={email}/>
      </div>
    </>
  );
}

export default Dashboard;
