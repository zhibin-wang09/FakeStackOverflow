// Answer Document Schema
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var answerSchema = new Schema({
    text: {type: String, required:true},
    ans_by: {type:String, required: true},
    ans_date_time: {type:Date, default: Date.now},
}, {
    virtuals:{
        url:{
            get(){
                return `/posts/answer/${this._id}`
            }
        }
    }
})

module.exports =  mongoose.model('Answer', answerSchema)
