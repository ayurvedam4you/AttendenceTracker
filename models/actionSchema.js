const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  PunchIn: {
    type: String,
    required: true,
  },
  punchOut: { type: String, required: true },
  month: { type: String, required: true },
  jobType: { type: String, required: true },
  description: { type: String, required: true },
  time:{ type: String, required: true }
});

module.exports = actionSchema;
