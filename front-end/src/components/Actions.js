import React, { useState, useEffect, useRef } from "react";
import "../styles/actions.css";
import axios from "axios";
import moment from "moment-timezone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Actions({ email }) {
  const [punchIn, setPunchIn] = useState(false);
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const requestIdRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      cancelAnimationFrame(requestIdRef.current);
    }
  }, [isRunning]);

  const startTimer = () => {
    let startTime = Date.now();
    const updateTimer = () => {
      const elapsedTime = Date.now() - startTime;
      setTimer(Math.floor(elapsedTime / 1000));
      requestIdRef.current = requestAnimationFrame(updateTimer);
    };
    requestIdRef.current = requestAnimationFrame(updateTimer);
  };

  const handlePunchOut = (e) => {
    e.preventDefault();
    if (!description) {
      toast.error("Enter the Description");
    } else {
      setPunchIn(false);
      setIsRunning(false);

      const headers = {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      };
      axios
        .post(
          "/api/punch-out",
          {
            punchIn: currentTime,
            jobType: selectedOption,
            description: description,
          },
          { headers }
        )
        .then((res) => {
          console.log(res);
        });

      setTimer(0);
      setSelectedOption("");
      setDescription("");
    }
  };

  const handlePunchIn = (e) => {
    e.preventDefault();
    const currentTime = moment().tz("Asia/Kolkata");
    setCurrentTime(currentTime.format("YYYY-MM-DD HH:mm:ss"));
    if (selectedOption === "") {
      toast.error("Select any option");
    } else if (selectedOption === "leave") {
      if (!description) {
        toast.error("Enter the Description");
      } else {
        const headers = {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        };

        axios
          .post(
            "/api/punch-out",
            {
              jobType: selectedOption,
              description: description,
            },
            { headers }
          )
          .then((res) => {
   
            if (res.status === 200) {
              setSelectedOption(""); // Clear the selected option
              setDescription("");
              toast.success("Leave Marked");
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something Went Wrong");
          });
      }
    } else {
      setPunchIn(true);
      setIsRunning(true);
    }
  };

  return (
    <>
      <div className="actions">
        <div className="actions-items">
          <div className="actions-user">
            <p>User : {email.split("@")[0]}</p>
          </div>
          {punchIn ? (
            <>
              {" "}
              <div className="timer">
                <h1>{new Date(timer * 1000).toISOString().substr(11, 8)}</h1>
              </div>
              <div className="actions-form">
                <form onSubmit={handlePunchOut}>
                  <label>Description:</label>
                  <textarea
                    type="text"
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your Description"
                  ></textarea>

                  <div className="button">
                    <button type="submit" className="punch-out">
                      Punch Out
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="actions-form">
              <form onSubmit={handlePunchIn}>
                <label>JobType :</label>
                <div className="select">
                  <select
                    name="format"
                    id="format"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option disabled value="">
                      Select Job Type
                    </option>
                    <option value="work-from-home">Work From Home</option>
                    <option value="work-from-office">Work From Office</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                {selectedOption === "leave" && (
                  <>
                    <label>Description:</label>
                    <textarea
                      type="text"
                      className="input leave"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter your Description"
                    ></textarea>
                  </>
                )}
                <div className="button">
                  <button
                    type="submit"
                    className={
                      selectedOption === "leave" ? "punch-in leave" : "punch-in"
                    }
                  >
                    {selectedOption === "leave" ? <>Submit</> : <>Punch In</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Actions;
