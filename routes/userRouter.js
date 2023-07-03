const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userCheck = require("../middlewares/userCheck");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const Admin = require("../models/adminModel");
const moment = require("moment-timezone");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const storedHashedPassword = user.password; // Assuming the hashed password is stored in the "password" field of the user document

      const passwordMatch = await bcrypt.compare(
        password,
        storedHashedPassword
      );

      if (passwordMatch) {
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.JWT_USER_SECRET,
          { expiresIn: "1h" }
        );
        // Replace 'your_secret_key' with your own secret key and adjust the expiration time as needed
        const logo = await Admin.find({});
      
        res.status(200).json({ token, logo: logo[0].logo });
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
router.get("/protected", userCheck, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ email: user.email });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/punch-out", userCheck, (req, res) => {
  const { punchIn, jobType, description } = req.body;
  const currentTime = moment().tz("Asia/Kolkata");
  const formattedCurrentTime = currentTime.format("YYYY-MM-DD HH:mm:ss");
  const diff = moment(formattedCurrentTime, "YYYY-MM-DD HH:mm:ss").diff(
    moment(punchIn, "YYYY-MM-DD HH:mm:ss")
  );
  const duration = moment.utc(diff).format("HH:mm:ss");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Adjust to one-based index

  User.findById(req.user.id)
    .then((user) => {
     
      const newAction = {
        punchIn: punchIn,
        punchOut: formattedCurrentTime,
        month: currentMonth,
        jobType: jobType,
        description: description,
        time: duration,
      };

      user.actions.push(newAction); // Push newAction into the actions array

      // Save the updated user document
      return user.save();
    })
    .then(() => {
      res.status(200).send("Punch-out successful");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/apply-leave", userCheck, (req, res) => {
  const { reason, date } = req.body;

  User.findById(req.user.id)
    .then((user) => {
      if (user) {
        const newLeave = {
          reason: reason,
          date,
          accepted: false,
        };
        user.leaves.push(newLeave); // Push newLeave into the leaves array

        // Save the updated user document
        user
          .save()
          .then(() => {
            res.status(200).send("Leave applied successfully");
          })
          .catch((err) => {
            res.status(500).send("Error occurred while applying leave");
          });
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error occurred while applying leave");
    });
});

// router.get("/check-leave-applied", userCheck, (req, res) => {
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//   const day = currentDate.getDate().toString().padStart(2, '0');

//   const formattedDate = `${year}-${month}-${day}`;
//   let accepted = false;
//   User.findById(req.user.id)
//     .then((user) => {
//       if (user) {
//         user.leaves.forEach((leave) => {

//           if (leave.date === formattedDate && leave.accepted === true) {

//             accepted = true;
//           }
//         });

//         if (accepted) {
//           res.status(200).json("Your Leave is Confirmed");
//         } else {
//           res.status(201).json("Your Leave is not yet Confirmed");
//         }
//       } else {
//         res.status(404).send("User not found");
//       }
//     })
//     .catch((err) => {
//       res.status(500).send("An error occurred while checking the leave");
//     });
// });

router.get("/leaves", userCheck, (req, res) => {
  
  User.findById(req.user.id)
    .then((user) => {
      const leaves = user.actions.filter((item) => item.jobType === "leave");
      
      res.status(200).json(leaves);
    })
    .catch((error) => {
      // Handle the error appropriately
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
