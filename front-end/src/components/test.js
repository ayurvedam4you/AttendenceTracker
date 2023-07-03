import React, { useEffect } from "react";

function Test() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Cancel the default unload behavior
      event.preventDefault();
      // Chrome requires assigning a return value to the event
      event.returnValue = "";

      // Show a confirmation message to the user
      const confirmationMessage = "Are you sure you want to leave this page?";
      event.returnValue = confirmationMessage; // For older browsers
   
      // Make a request to the server's /close endpoint
      fetch("/close", {
        method: "POST",
      })
        .then((response) => {
          console.log("Server notified about browser closing");
          // Handle the server's response if needed
          // For example, you can show a confirmation message to the user
          // based on the response from the server
        })
        .catch((error) => {
          console.error(
            "Failed to notify server about browser closing:",
            error
          );
        });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <div>hello</div>;
}


export default Test;
