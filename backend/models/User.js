const mongoose = require('mongoose');
const { Schema } = mongoose;

const SnackSchema = new Schema({
  snack: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const UserSchema = new Schema({
  Ename: { type: String, required: true },
  Eid: { type: Number, required: true },
  department: { type: String, required: true },
  date: { type: Date, default: Date.now },
  snacks: { type: [SnackSchema], required: true }, // <-- updated
  remarks: { type: String, required: true },
  otherSnack: { type: String }
});

module.exports = mongoose.model('user', UserSchema);