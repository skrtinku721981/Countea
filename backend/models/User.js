const mongoose = require('mongoose');
const moment = require('moment-timezone'); // npm install moment-timezone
const { Schema } = mongoose;

const SnackSchema = new Schema({
  Snack: { type: String, required: true },
  Quantity: { type: Number, required: true }
}, { _id: false });

const UserSchema = new Schema({
  Ename: { type: String, required: true },
  Eid: { type: Number, required: true },
  Department: { type: String, required: true },
 
  Month: { 
    type: String,
    default: () => moment().tz("Asia/Kolkata").format('MMMM') // Full month name
  },
  Date_Time: { 
    type: String,
     default: () => moment().tz("Asia/Kolkata").format('DD/MM/YYYY HH:mm:ss') // dd/mm/yyyy hh:mm:ss IST
  },
  Snacks: { type: [SnackSchema], required: true },
  Remarks: { type: String, required: true },
  OtherSnack: { type: String }
});

module.exports = mongoose.model('user', UserSchema);