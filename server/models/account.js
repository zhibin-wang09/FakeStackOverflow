// the account schema

const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// a session model that stores the informations about users
var userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    reputation: {type: Number, default: 0},
    role: {type: String, default: 'normal'},
    memberSince: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User',userSchema);