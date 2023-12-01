// the account schema

const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// a session model that stores the informations about users
var userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    reputation: {type: Number, default: 0},
    role: {type: String, default: 'normal'}
});

module.exports = mongoose.model('User',userSchema);