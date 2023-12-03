// Answer Document Schema
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var answerSchema = new Schema({
    text: {type: String, required:true},
    ans_by: {type: Schema.Types.ObjectId, ref: 'User'},
    ans_date_time: {type:Date, default: Date.now},
    votes: {type:Number, default: 0},
    comment: [{type: Schema.type.ObjectId, ref : 'Comment'}]
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
