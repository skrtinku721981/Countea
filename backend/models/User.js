const mongoose = require('mongoose');
const { Schema } = mongoose;

const SnackSchema = new Schema({
  snack: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const UserSchema = new Schema({
  ename: { type: String, required: true },
  eid: { type: Number, required: true },
  department: { type: String, required: true },
  date: { type: Date, default: Date.now },
  snacks: { type: [SnackSchema], required: true }, // <-- updated
  purpose: { type: String, required: true },
  otherSnack: { type: String }
});

module.exports = mongoose.model('user', UserSchema);