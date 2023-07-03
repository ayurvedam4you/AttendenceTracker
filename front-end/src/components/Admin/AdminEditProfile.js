import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSideNav from "./AdminSideNav";
import "../../styles/dashboard.css";
import "../../styles/form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AdminEditProfile() {
  const [companyName, setCompanyName] = useState("");
  const [img, setImg] = useState(null);

  const navigate = useNavigate();
  const logo = localStorage.getItem("logo");
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": adminToken,
      };

      axios
        .get("/api/admin/protected", { headers })
        .then((res) => {
          if (res.status !== 200) {
            navigate("/admin/login");
          }
        })
        .catch(() => localStorage.removeItem("adminToken"));
    }else{
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!img || !companyName){
      toast.error("Complete the Fields")
    }else{
      const formData = new FormData();
      formData.append("logo", img);
      formData.append("companyName", companyName);
  
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        const headers = {
          "x-access-token": adminToken,
        };
  
        axios
          .post("/api/admin/add-company-details", formData, { headers })
          .then((res) => {
            if (res.status===200){
              localStorage.setItem('logo',res.data.logo)
              navigate("/admin/dashboard")
            }
          })
          .catch((error) => {
            // Handle error
            console.error(error);
          });
      }
    }
  
  };

  return (
    <>
      <AdminNavbar logo={logo} />
      <div className="dashboard">
        <AdminSideNav logo={logo} />
        <div className="form-container edit">
          <h1>Edit Profile</h1>

          <form className="form edit" onSubmit={handleSubmit}>
            <label>Company Name:</label>
            <input
              type="text"
              className="input"
              placeholder="Enter your Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <input
              className="custom-file-input"
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            />

            <div className="button">
              <input type="submit" className="button" value="Submit" />
            </div>
          </form>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
}

export default AdminEditProfile;
