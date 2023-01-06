const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email :{
        type :String,
        required:true
    },
    contact :{
        type :Number,
        required:true
    },
    x_coordinate :{
        type :String,
        required:true
    },
    y_coordinate :{
        type :String,
        required:true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    payment_status: {
        paied: {
            type: String,
            default: "Unpaid"
        },
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);