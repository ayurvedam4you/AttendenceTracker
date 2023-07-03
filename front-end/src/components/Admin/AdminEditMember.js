import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSideNav from "./AdminSideNav";
import "../../styles/dashboard.css";
import "../../styles/form.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AdminEditMember(props) {
    const params = useParams()

  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState(params.designation);
  const navigate = useNavigate();

  const logo = localStorage.getItem("logo")

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
    if(!params.email || !password || !designation){
      toast.error("Enter the required Fields")
    }else{
        const headers = {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("adminToken"),
          };
      axios
        .post("/api/admin/edit-member", {
          email:params.email,
          password: password,
          designation: designation,
        },{headers})
        .then((res) => {
          if (res.status === 200) {
            toast.success("Staff Updated Successfully");
          }else{
            toast.error("Staff Not Found")
          }
        })
        .catch((error) => console.log(error));
  
  
      setPassword("");
      setDesignation("");
    }
  }
  function handleDelete(){
    const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("adminToken"),
      };
    axios.delete('/api/admin/delete-member/'+params.email,{headers}).then((res)=>{
        if(res.status===200){
            navigate("/admin/dashboard")
        }
    }).catch((e)=>console.log(e))
  }
  return (
    <>
      <AdminNavbar logo={logo} />
      <div className="dashboard">
        <AdminSideNav logo={logo} />
        <div className="form-container edit">
          <h1>Add Staff</h1>

          <form className="form" onSubmit={handleSubmit}>
           

            <label>Password:</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter member Password"
            />

            <label>Designation:</label>
            <input
              type="text"
              className="input"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter member Designation"
            />

            <div className="button">
              <input type="submit" className="button" value="Update" />
            </div>
            <div className="button">
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete Staff
                  </button>
                </div>
          </form>

          <ToastContainer/>
        </div>
      </div>
    </>
  );
}

export default AdminEditMember;
