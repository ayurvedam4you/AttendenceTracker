const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// Define the Admin schema
const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
   
  },
  logo: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,

    default: 0,
  },
  
});
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;