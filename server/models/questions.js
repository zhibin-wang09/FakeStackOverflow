// Question Document Schema

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema({ // create collection
    title: {type: String, required: true, maxLength: 100},
    text: {type:String, required: true},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag', require:true}],
    answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
    asked_by : {type: Schema.Types.ObjectId, ref: 'User'},
    ask_date_time: {type:Date, default: Date.now},
    views: {type: Number, default: 0},
    votes: {type: Number, default: 0},
    comment: [{type: Schema.Types.ObjectId, ref : 'Comment'}],
    summary: {type:String, required:true}
}, {
    virtuals:{
        url:{
            get(){
                return `/posts/question/${this._id}`
            }
        }
    }
})

module.exports = mongoose.model('Question', questionSchema) // export the compiled collection
