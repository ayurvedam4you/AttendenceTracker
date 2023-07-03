import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSideNav from "./AdminSideNav";
import AdminMembers from "./AdminMembers";
import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function AdminDashboard() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(localStorage.getItem("logo"));
  const [data,setData] = useState([])
  
  useEffect(() => {
    console.log("hello");
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": adminToken,
      };

      axios
        .get("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status === 200) {
            if (!logo) {
              axios.get("/api/admin/admin-details", { headers }).then((res) => {
                if (res.status === 200) {
                  localStorage.setItem("logo", res.data.logo);
                  setLogo(res.data.logo);
                }
              });
            }
          } else {
            navigate("/admin/login");
          }
        })
        .catch(() => localStorage.removeItem("adminToken"));
    } else {
      navigate("/admin/login");
    }
  }, [logo, navigate]);


  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("adminToken"),
    };
    axios
      .get("/api/admin/all-users-data", { headers })
      .then((res) => {
        setData(res.data)
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <AdminNavbar logo={logo} />
      <div className="dashboard">
        <AdminSideNav logo={logo} />
        <AdminMembers data={data}/>
      </div>
    </>
  );
}

export default AdminDashboard;
