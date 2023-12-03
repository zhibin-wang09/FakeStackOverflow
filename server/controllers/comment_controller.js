const comment = require('../models/comment');
const question = require('../models/questions');
const user = require('../models/account')

const postcomment = async (req,res) => { // a post method to create a new comment for the question
    const q = await question.findOne({_id: req.params.id}); // get the corresponding question to add comment to
    const u = await user.findOne({email : req.body.email}); // get the user who is making the comment
    const c = await comment.create({text: req.body.text, user: u}); // create the new comment
    await question.updateOne({_id : req.params.id}, {comment : [...q[0].comment, c]}); // add the comment to the question
    res.status(200).send(c);
}

module.exports = {postcomment};