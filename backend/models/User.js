
const mongoose = require('mongoose');
const moment = require('moment-timezone'); // npm install moment-timezone
const { Schema } = mongoose;

const SnackSchema = new Schema({
  snack: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const UserSchema = new Schema({
  ename: { type: String, required: true },
  eid: { type: Number, required: true },
  department: { type: String, required: true },
  
  month: { 
    type: String,
    default: () => moment().tz("Asia/Kolkata").format('MMMM YYYY') // Full month name
  },
  date_time: { 
    type: String,
     default: () => moment().tz("Asia/Kolkata").format('DD/MM/YYYY HH:mm:ss') // dd/mm/yyyy hh:mm:ss IST
  },
  snacks: { type: [SnackSchema], required: true },
  remarks: { type: String, required: true },
  otherSnack: { type: String }
});

module.exports = mongoose.model('user', UserSchema);