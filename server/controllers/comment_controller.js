const comment = require('../models/comment');
const question = require('../models/questions');
const answer = require('../models/answers')
const user = require('../models/account')

const postCommentToQuestion = async (req,res) => { // a post method to create a new comment for the question
    const u = await user.findOne({email : req.body.email}); // get the user who is making the comment
    if(u.reputation < 50){
        return res.status(401).send("You have less than 50 reputation can not comment");
    }
    let q = await question.findOne({_id: req.params.id}); // get the corresponding question to add comment to
    const c = await comment.create({text: req.body.text, posted_by: u}); // create the new comment
    await question.updateOne({_id : req.params.id}, {comment : [...q.comment, c]}); // add the comment to the question
    q = await question.findOne({_id:req.params.id}).populate('comment').populate('asked_by');
    q.asked_by.password = null;
    q.asked_by.email = null;
    res.status(200).send(q);
}

const postCommentToAnswer = async (req,res) => { // a post method to create a new comment for the answer
    const u = await user.findOne({email : req.body.email}); // get the user who is making the comment
    if(u.reputation < 50){
        return res.status(401).send("You have less than 50 reputation can not comment");
    }
    let a = await answer.findOne({_id: req.params.id}); // get the corresponding answer to add comment to
    const c = await comment.create({text: req.body.text, posted_by: u}); // create the new comment
    await answer.updateOne({_id : req.params.id}, {comment : [...a.comment, c]}); // add the comment to the question
    a = await answer.findOne({_id: req.params.id}).populate('comment').populate('ans_by');
    a.ans_by.password = null;
    a.ans_by.email = null;
    res.status(200).send(a);
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