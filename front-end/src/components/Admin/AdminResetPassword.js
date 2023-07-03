import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [logo, setLogo] = useState(localStorage.getItem("logo"));

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!password) {
      toast.error("Enter the Password");
    } else {
      const adminToken = localStorage.getItem("adminToken");
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": adminToken,
      };
      axios
        .post("/api/admin/reset-password", { password: password }, { headers })
        .then((res) => {
          if (res.status === 200) {
            navigate("/admin/dashboard");
          } else {
            console.log("Something Went Wrong");
          }
        })
        .catch((e) => console.log(e));

      setPassword("");
    }
  }
  return (
    <>
      <div className="form-container">
        <h1>Reset Password</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label>Password : </label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
          />
          <div className="button">
            <input type="submit" className="button" value="Submit" />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default AdminResetPassword;
