// the session storage

const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// a session model that stores current sessions
var session = new Schema({
    sessionIds : {type: String}
});

module.exports = mongoose.model('Session', session);