const mongoose = require('mongoose');
const moment = require('moment-timezone');
const { Schema } = mongoose;

const SnackSchema = new Schema({
  snack: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const UserSchema = new Schema({
  ename: { type: String, required: true },
  eid: { type: Number, required: true },
  department: { type: String, required: true },
  // Save date in IST
  date: { type: Date, default: () => moment().tz("Asia/Kolkata").toDate() },
  snacks: { type: [SnackSchema], required: true },
  remarks: { type: String, required: true },
  otherSnack: { type: String }
});

module.exports = mongoose.model('user', UserSchema);