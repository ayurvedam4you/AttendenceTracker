import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminOTP() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { email } = params;

  useEffect(() => {
    console.log(email)
    axios
      .post("/api/admin/admin-exist" ,{email:email})
      .then((res) => {
        if (res.status === 200) {
          // Admin exists, do nothing
        } else {
          navigate("/admin/login");
        }
      })
      .catch(() => navigate("/admin/login"));
  }, [email, navigate]);
  

  function handleSubmit(e) {
    e.preventDefault();
 
    axios
      .post("/api/admin/verify-otp", { email: email, otp: password })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("adminToken", res.data.token);

          navigate("/admin/reset-password");
        } else {
          toast.error("Invalid OTP");
        }
      })
      .catch(() => toast.error("Invalid OTP"));
    setPassword("");
  }
  function sendOTP() {
    toast.promise(
      axios.post("/api/admin/send-otp", { email: email }),
      {
        pending: "Sending OTP...",
        success: "OTP sent to your email successfully",
        error: "Failed to send OTP",
      }
    )
      
    setPassword("");
  }
  return (
    <>
      <div className="form-container">
        <h1>Verify Account</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label>Password:</label>
          <input
            type="text"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your OTP"
          />

          <div className="button">
            <input type="submit" className="button" value="Submit" />
          </div>
          <div className="button">
            <input
              type="button"
              onClick={sendOTP}
              className="button"
              value="Send OTP"
            />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default AdminOTP;
