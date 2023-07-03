import React, { useEffect, useState } from "react";
import "../styles/actions.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ApplyLeave() {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [logo, setLogo] = useState(localStorage.getItem("logo"));
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
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
  function Apply(e) {
    e.preventDefault();
    if (!reason || !date) {
      toast.error("Please complete the fields");
    } else {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post("/api/apply-leave", { reason: reason,date:date }, { headers })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Applied Leave");
            setReason("");
          }
        });
    }
  }
  return (
    <>
      <Navbar logo={logo} email={email} />
      <div className="action-container apply-leave">
        <h1>Apply Leave</h1>
        <div className="actions apply-leave">
          <div className="actions-items">
            <div className="actions-form">
              <form onSubmit={Apply}>
                <label>Reason:</label>
                <textarea
                  type="text"
                  className="input apply-leave"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your Reason"
                ></textarea>
                <label>To: </label>
                <input
                  type="date"
                  id="endDate"
                  className="apply-leave"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="button">
                  <button type="submit" className="punch-out apply-leave">
                    Apply Leave
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ApplyLeave;
