import React, { useState } from "react";
import MonthSelector from "./MonthSelector";
import { useNavigate } from "react-router-dom";

function AdminMembers({ data }) {
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const getTotalPunchInDays = (actions, month, year) => {
    const uniqueDays = new Set();

    actions.forEach((action) => {
      const actionDate = new Date(action.punchIn);
      const actionMonth = actionDate.getMonth() + 1;
      const actionYear = actionDate.getFullYear();

      if (actionMonth === month && actionYear === year) {
        const date = actionDate.toISOString().split("T")[0];
        uniqueDays.add(date);
      }
    });

    return uniqueDays.size;
  };

  const getTotalHours = (actions, month, year) => {
    let totalSeconds = 0;

    actions.forEach((action) => {
      const actionDate = new Date(action.punchIn);
      const actionMonth = actionDate.getMonth() + 1;
      const actionYear = actionDate.getFullYear();

      if (actionMonth === month && actionYear === year) {
        const timeComponents = action.time.split(":");
        const hours = parseInt(timeComponents[0]);
        const minutes = parseInt(timeComponents[1]);
        const seconds = parseInt(timeComponents[2]);

        totalSeconds += hours * 3600 + minutes * 60 + seconds;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTotalLeaves = (actions, month, year) => {
    const uniqueDays = new Set();

    actions.forEach((action) => {
      if(action.jobType==="leave"){

        const actionDate = new Date(action.punchOut);
        const actionMonth = actionDate.getMonth() + 1;
        const actionYear = actionDate.getFullYear();
  
        if (actionMonth === month && actionYear === year) {
          const date = actionDate.toISOString().split("T")[0];
          uniqueDays.add(date);
        }
      }
    });

    return uniqueDays.size;
  };
  return (
    <>
      <div className="table-container">
        <MonthSelector setMonth={setMonth} setYear={setYear} />
        <table className="styled-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Total Days</th>
              <th>Total Hours</th>
          
              <th>Designation</th>
              <th>Total Leaves</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td className="center-align">{user.email}</td>
                <td className="center-align">
                  {getTotalPunchInDays(user.actions, month, year)}
                </td>
                <td className="center-align">
                  {getTotalHours(user.actions, month, year)}
                </td>
                <td className="center-align">{user.designation}</td>
                <td className="center-align">{getTotalLeaves(user.actions, month, year)}</td>
                <td className="center-align edit-btn" onClick={()=>navigate("/admin/edit-member/"+user.email+"/"+user.designation)}>Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminMembers;
