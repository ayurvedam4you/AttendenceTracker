import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import moment from "moment"; // Add this import statement

import "../styles/dashboard.css";
import MonthSelector from "./Admin/MonthSelector";

function AllLeaves() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(localStorage.getItem("logo"));
  const [leaves, setLeaves] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

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

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };

    axios
      .get("/api/leaves", { headers })
      .then((res) => {
        if (res.status === 200) {
          setLeaves(res.data);
          console.log(res.data);
        }
      })
      .catch((e) => console.log(e));
  }, []); // Add an empty dependency array to run the effect only once

  const filteredData = leaves.filter((leave) => {
    const date = moment(leave.punchOut, "YYYY-MM-DD HH:mm:ss");
    return date.month() + 1 === month && date.year() === year;
  });

  return (
    <>
      <Navbar logo={logo} />

      <div className="action-container">
        <div className="table-container">
          <MonthSelector setMonth={setMonth} setYear={setYear} />
          <table className="styled-table">
            <thead>
              <tr>
          
                <th>Reason</th>
              
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index}>
                  <td className="center-align">{user.description}</td>
                  <td className="center-align">{user.punchOut}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllLeaves;
