import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/form.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
            navigate("/admin/dashboard");
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
        });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please provide both email and password");
    } else {
      axios
        .post("/api/admin/login", { email, password })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("adminToken", res.data.token);
            navigate("/admin/dashboard");
          } else {
            toast.error("Invalid Email or Password");
          }
        })
        .catch(() => {
          toast.error("Invalid Email or Password");
        });

      setEmail("");
      setPassword("");
    }
  };
function sendOTP(){
  
  if(email){
      navigate("/admin/send-otp/"+email)
  }else{
    toast.error("Enter Your Email");
  }
}
  return (
    <div className="form-container">
      <h1>Admin Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="text"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label>Password:</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Password"
        />

        <p
          className="forgot-password"
          onClick={sendOTP}
        >
          Forgot Password
        </p>

        <div className="button">
          <input type="submit" className="button" value="Submit" />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
