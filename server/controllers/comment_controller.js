const comment = require('../models/comment');
const question = require('../models/questions');
const answer = require('../models/answers')
const user = require('../models/account')

const postCommentToQuestion = async (req,res) => { // a post method to create a new comment for the question
    const q = await question.findOne({_id: req.params.id}); // get the corresponding question to add comment to
    const u = await user.findOne({email : req.body.email}); // get the user who is making the comment
    const c = await comment.create({text: req.body.text, user: u}); // create the new comment
    await question.updateOne({_id : req.params.id}, {comment : [...q[0].comment, c]}); // add the comment to the question
    res.status(200).send(c);
}

const postCommentToAnswer = async (req,res) => { // a post method to create a new comment for the answer
    const a = await answer.findOne({_id: req.params.id}); // get the corresponding answer to add comment to
    const u = await user.findOne({email : req.body.email}); // get the user who is making the comment
    const c = await comment.create({text: req.body.text, user: u}); // create the new comment
    await answer.updateOne({_id : req.params.id}, {comment : [...a[0].comment, c]}); // add the comment to the question
    res.status(200).send(c);
}

const increaseCommentVote = async (req,res) => {
    const c = await comment.findOne({_id : req.params.id});
    await comment.updateOne({_id: req.params.id}, {votes: c.votes + 1});
    res.status(200).send();
}

const decreaseCommentVote = async (req,res) => {
    const c = await comment.findOne({_id : req.params.id});
    await comment.updateOne({_id: req.params.id}, {votes: c.votes - 1});
    res.status(200).send();
}

const deleteComment = async (req,res) => {
    const id = req.params.id;
    await comment.deleteOne({_id: id});
    res.status(200).send();
}

module.exports = {postCommentToQuestion,postCommentToAnswer, increaseCommentVote, decreaseCommentVote};