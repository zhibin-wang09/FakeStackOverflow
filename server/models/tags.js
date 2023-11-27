// Tag Document Schema

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tagSchema = new Schema({
    name: {type:String, required:true},
}, {
    virtuals:{
        url:{
            get(){
                return `/posts/tag/${this._id}`
            }
        }
    }
})

module.exports = mongoose.model('Tag',tagSchema)
