const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const actionSchema = ("./actionSchema.js")
const leaveSchema = ("./leaveSchema.js")
// Define the Admin schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,

    default: 0,
  },
  actions:[actionSchema],
  leaves:[leaveSchema]
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
