// Importing required modules or libraries
require("dotenv").config();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser"); // for parsing application/json  (for form-data) and application/xml  (for files)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");

const path = require("path");
const cors = require("cors");

app.use(express.static(path.join(__dirname, "front-end", "build")));
app.use(express.urlencoded({ extended: false }));

// Create an instance of Express app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

// Connect to a database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/admin", adminRouter);
app.use("/api", userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "build", "index.html"));
});

app.post("/close", (req, res) => {
  console.log("Client is closing");
  // Perform any required actions on the server before closing

  res.sendStatus(200); // Send a success status code to the client
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
