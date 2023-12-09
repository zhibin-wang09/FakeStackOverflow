// Comment schema: stores relevant information about an account
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const comment = new Schema({
    posted_by : {type:Schema.Types.ObjectId, ref: 'User'},
    votes: {type: Number, default: 0},
    text: {type:String, required: true},
    date: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Comment', comment);
