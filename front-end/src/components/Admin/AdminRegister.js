import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/form.css"
import { useNavigate } from "react-router-dom";
function AdminRegister() {
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
          if (res.status !== 200) {
            navigate("/admin/login");
          }
        })
        .catch(() => localStorage.removeItem("adminToken"));
    }else{
      navigate("/admin/login");
    }
  }, [navigate]);
  function handleSubmit(e) {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("adminToken"),
    };
    axios.post("/api/admin/register",{email:email,password:password},{headers}).then((res)=>{
     if(res.status===200){
      navigate("/admin/dashboard")
     }
      }).catch((e)=>console.log(e))
    setEmail("");
    setPassword("");
  }
  return (
    <>
      <div className="form-container">
        <h1>Admin Register</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label>Email : </label>
          <input
            type="text"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
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
      </div>
    </>
  );
}

export default AdminRegister;
