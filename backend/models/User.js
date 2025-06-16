const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    ename: {
        type: String,
        required: true
    },
    eid: {
        type: Number,
        required: true

    },

    department: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    snacks: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    remarks: {

        type: String,
        required: true
    },

    otherSnack: {

        type: String,
       
    },

});
module.exports = mongoose.model('user', UserSchema);