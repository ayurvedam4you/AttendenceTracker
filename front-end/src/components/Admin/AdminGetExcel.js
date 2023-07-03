import axios from "axios";
import React, { useState } from "react";
import "../../styles/excel.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AdminGetExcel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleClick() {
    if (!startDate || !endDate) {
      toast.error("Select the Date");
    } else {
      axios
        .get(
          `/api/admin/export-data?startDate=${startDate}&endDate=${endDate}`,
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "data.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch((e)=>{toast.error(e.message)})
    }
  }

  return (
    <div>
      <div className="excel-container">
        <div className="form excel">
          <h3>Export Data</h3>
         
            <label>From: </label>
            <input
              type="date"
              id="startDate"
              className="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              />
       
         
              <label>To: </label>
            <input
              type="date"
              id="endDate"
              className="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
         
          <div>
            <button className="download-btn" onClick={handleClick}>
              Download Excel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminGetExcel;
