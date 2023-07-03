const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({

  reason: { type: String, required: true },
  date:{ type: String, required: true },
  accepted:{type:Boolean,default:false,required: true }

});

module.exports = leaveSchema;
