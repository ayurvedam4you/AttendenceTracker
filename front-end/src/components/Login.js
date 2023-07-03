import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
            navigate("/dashboard");
          }
        })
        .catch(() => localStorage.removeItem("token"));
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password");
    } else {
      axios
        .post("/api/login", { email: email, password: password })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("logo", res.data.logo);

            navigate("/dashboard");
          } else {
            toast.error("Invalid Email or Password");
          }
        })
        .catch(() => toast.error("Invalid Email or Password"));

      setEmail("");
      setPassword("");
    }
  }
  return (
    <>
    <p onClick={()=>navigate("/admin/login")}>Admin</p>
      <div className="form-container">
        <h1>Login</h1>

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

          <div className="button">
            <input type="submit" className="button" value="Submit" />
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default Login;
