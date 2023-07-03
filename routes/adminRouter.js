const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const adminCheck = require("../middlewares/adminCheck");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const { sendMail } = require("./userAction");
const { generateOTP } = require("./userAction");
const xlsx = require("xlsx");

router.post("/register", adminCheck, async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await Admin.create({ email, password: hashedPassword });
    res.status(200).json("Admin Created");
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });

    if (user) {
      const storedHashedPassword = user.password; // Assuming the hashed password is stored in the "password" field of the user document

      const passwordMatch = await bcrypt.compare(
        password,
        storedHashedPassword
      );

      if (passwordMatch) {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_ADMIN_SECRET,
          { expiresIn: "1h" }
        );
        // Replace 'your_secret_key' with your own secret key and adjust the expiration time as needed

        res.status(200).json({ token });
      } else {
        res.status(401).send("Authentication failed!");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/protected", adminCheck, (req, res) => {
  Admin.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json("user found");
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/add-member", adminCheck, async (req, res) => {
  try {
    const { email, password, designation } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      designation,
    });
    res.status(200).json(newUser);
  } catch (e) {
   
    res.status(500).send("Internal Server Error");
  }
});

router.post("/edit-member", adminCheck, async (req, res) => {
  try {
    const { email, password, designation } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, designation },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json("User Not Found");
    }
  } catch (e) {
   
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-member/:email", adminCheck, async (req, res) => {
  try {
    const email = req.params.email;

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
   
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add-company-details", adminCheck, async (req, res) => {
  const logo = req.files?.logo;
  const companyName = req.body.companyName;

  try {
    const img = await cloudinary.uploader.upload(logo.tempFilePath);

    const updatedAdmin = await Admin.updateOne(
      { _id: req.user.id }, // Assuming req.user contains the admin ID
      {
        logo: img.url,
        companyName,
      }
    );

    res.status(200).json({
      message: "Company details updated",
      admin: updatedAdmin,
      logo: img.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/admin-details", adminCheck, (req, res) => {
  Admin.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ logo: user.logo, companyName: user.companyName });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP(6);
  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.otp = otp;
    const updatedUser = await user.save();

    sendMail(
      updatedUser.email,
      "OTP Verification",
      `Your One Time Password is ${otp}`,
      `Your One Time Password is ${otp}`
    )
      .then(() => {
        res
          .status(200)
          .json({ message: "OTP generated and sent for verification" });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        res
          .status(500)
          .json({ error: "An error occurred while sending the email" });
      });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});
router.post("/admin-exist", (req, res) => {
  const { email } = req.body;

  Admin.findOne({ email: email })
    .then((admin) => {
      if (admin) {
        res.status(200).json("Admin Exists");
      } else {
        res.status(401).json("Admin Doesn't Exist");
      }
    })
    .catch((error) => {
      res.status(500).json("Internal Server Error");
      console.error(error);
    });
});

router.post("/verify-otp", (req, res) => {
  const otp = req.body.otp; // Get the OTP from the client
  const email = req.body.email; // Get the email from the client

  Admin.findOne({ email, otp })
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_ADMIN_SECRET,
          { expiresIn: "1h" }
        );
        // Replace 'process.env.JWT_ADMIN_SECRET' with your own secret key and adjust the expiration time as needed

        res.status(200).json({ token });
      } else {
        res.status(400).json({ error: "OTP not found" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "An error occurred while verifying OTP" })
    );
});

router.post("/reset-password", adminCheck, async (req, res) => {
  try {
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await Admin.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json("Password reset successful");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while resetting the password" });
  }
});

router.get("/all-users-data", adminCheck, (req, res) => {
  User.find({})
    .then((users) => {
      const userData = users.map((user) => {
        return {
          email: user.email,
          actions: user.actions,
          designation: user.designation,
        };
      });

      res.status(200).json(userData);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.get("/export-data", (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  User.find({})
    .then((users) => {
      const data = [];

      users.forEach((user) => {
        user.actions.forEach((action) => {
          const splitDate = action.punchOut.split(" ")[0];
          const punchInDate = new Date(action.punchIn);
          const punchOutDate = new Date(action.punchOut);
          let totalHours = (punchOutDate.getTime() - punchInDate.getTime()) / (1000 * 60 * 60);
          totalHours = Number(totalHours.toFixed(3)); // Floor to 3 decimal places
          if(action.jobType==="leave"){
            totalHours= 0;
          }
          if (splitDate >= startDate && splitDate <= endDate) {
            // Check if the splitDate falls within the specified range
            const entry = {
              Email: user.email,
              punchIn: action.punchIn,
              punchOut: action.punchOut,
              jobType:action.jobType,
              TotalHours: totalHours,
              Description:action.description,
              Month: action.month,
            };

            data.push(entry);
          }
        });
      });

      const workbook = xlsx.utils.book_new();
      const sheet = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(workbook, sheet, "Sheet 1");

      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(excelBuffer);
    })
    .catch((err) => {
      console.error("Error retrieving data from MongoDB:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/all-leave-applications", (req, res) => {
  User.find({})
    .then((users) => {
      const leaveApplications = users.reduce((acc, user) => {
        const filteredLeaves = user.leaves.filter((leave) => !leave.accepted);
        const formattedLeaves = filteredLeaves.map((leave) => {
          return {
            ...leave,
            email: user.email,
            id:user._id
          };
        });
        return [...acc, ...formattedLeaves];
      }, []);

      res.status(200).json(leaveApplications);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while retrieving leave applications");
    });
});


module.exports = router;
