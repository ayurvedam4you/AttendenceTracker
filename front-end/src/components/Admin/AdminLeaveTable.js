import { useState } from "react";
import MonthSelector from "./MonthSelector";
import moment from "moment";

function AdminLeaveTable({ data }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const filteredData = data.filter((leave) => {
    const date = moment(leave.date, "YYYY-MM-DD HH:mm:ss");
    return date.month() + 1 === month && date.year() === year;
  });

  return (
    <>
      <div className="table-container">
        <MonthSelector setMonth={setMonth} setYear={setYear} />
        <table className="styled-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((leave) => (
              <tr key={leave._id}>
                <td className="center-align">{leave.email}</td>
                <td className="center-align">{leave.reason}</td>
                <td className="center-align">{leave.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminLeaveTable;
