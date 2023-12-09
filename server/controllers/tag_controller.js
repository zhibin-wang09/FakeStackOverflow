const questions = require('../models/questions');
const tag = require('../models/tags')
const users = require('../models/account')

const getTag = async (req,res) => { // used for the tag page where the frontend retrieve all tags and display in boxes
    const tags = await tag.find({});
    res.status(200).send(tags);
}

const getTagById = async (req,res) => {
    const t = await tag.findOne({_id: req.params.id});
    res.status(200).send(t);
}

const updateTagName = async (req,res) => {
    await tag.updateOne({_id: req.params.id}, {name: req.body.name});
    res.status(200).send("Success");
}

const deleteTag = async (req,res) => {
    const id = req.params.id;
    let t = await tag.findOne({_id : id});
    const q = await questions.find({});
    // first check if this tag is being used by different users
    if(t.users.length > 1){
        return res.status(400).send("There are other users holding this tag can not delete");
    }
    for(const i in q){
        if(q[i]['tags'].includes(t._id)){
            await questions.updateOne({_id: q[i]._id}, {tags: q[i]['tags'].filter(tt => tt._id !== t._id)});
        }
    }
    await tag.deleteOne({_id: id});
    const u = await users.findOne({email: req.body.email});
    t = await tag.find({users: u});
    return res.status(200).send(t);
}

module.exports = {getTag,deleteTag,getTagById,updateTagName}