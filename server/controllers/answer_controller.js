// this file takes care of handling requests related to answers
const answers = require('../models/answers');
const answer = require('../models/answers'); // obtain the answer collection
const question = require('../models/questions');
const user = require('../models/account');

const getAnswers = async (req, res) => { // a get method that handles retrieval of answers related to a question    
    const q = await question.find({_id : req.params.id}).orFail(new Error("No document found!")); // find the answers to a specific question located by using _id. NOTE: q is an array
    const answers = [];
    for(const i in q[0]["answers"]){
        answers.push(await answer.findById(q[0]["answers"][i]).orFail(new Error("No document found!"))); // get all the answers
    }
    res.status(200).send(answers);
}

const postAnswers = async (req, res) => { // a post method that handles new answers
    // a new answer must be related to a question
    const q = await question.find({_id: req.params.id});
    const u = await user.findOne({email: req.body.email}); // find the user who answered the question
    const ans = await answer.create({text: req.body.text, ans_by :u});
    await question.updateOne({_id : req.params.id}, {answers : [...q[0].answers, ans]});
    res.status(200).send(ans);
}

// require the request to have a parameter of the id of the data in the database. Client side should have this id that was initially sent when fetching answers
const increaseAnswerVote = async (req,res) => {
    const id = req.params.id; // use the id to identify the question
    let a = await answer.findOne({_id: id}); // find the answer and its associated information
    let u = a.ans_by;
    u = await user.find({_id : u});
    if(u[0].reputation < 50){
        res.status(400).send("You can not vote yet. Reputation is less than 50. Please get more votes from other people.")
        return;
    }
    await answer.updateOne({_id: id}, {votes : a.votes + 1}); // increase the reputation by 1
    a = await answer.findOne({_id: id}).populate("ans_by"); // find the answer and its associated information
    await user.updateOne({_id: u}, {reputation: u[0].reputation + 5});
    a.ans_by.password = null;
    a.ans_by.email = null;
    res.status(200).send(a)
}

// require the request to have a parameter of the id of the data in the database. Client side should have this id that was initially sent when fetching answers
const decreaseAnswerVote = async (req,res) => {
    const id = req.params.id;
    let a = await answer.findOne({_id: id});
    let u = a.ans_by;
    u = await user.find({_id : u});
    if(u[0].reputation < 50){
        res.status(400).send("You can not vote yet. Reputation is less than 50. Please get more votes from other people.")
        return;
    }
    await answer.updateOne({_id: id}, {votes: a.votes - 1});
    a = await answer.findOne({_id: id}).populate("ans_by");
    await user.updateOne({_id: u}, {reputation: u[0].reputation - 10});
    a.ans_by.password = null;
    a.ans_by.email = null;
    res.status(200).send(a)
}

const deleteAnswer = async (req,res) => { // deleting an answer will delete all of its associated comment
    const id = req.params.id;
    let a = await answer.findOne({_id: id}).populate("comment");
    for(const i in a["comment"]){ // go through the comments and delete each one
        await comment.deleteOne({_id : a['comment'][i]._id});
    }
    await answers.deleteOne({_id : id});
    const u = await user.findOne({email: req.body.email});
    a = await answer.find({ans_by: u});
    res.status(200).send(a);
}

const modifyAnswer = async (req, res) => {
    const id = req.params.id;
    await answer.updateOne({_id: id}, {text: req.body.text});
    res.status(200).send("Sucess");
}

const getAnswer = async (req,res) => {
    const id = req.params.id;
    let a = await answer.findOne({_id: id});
    res.status(200).send(a);
}

module.exports = {getAnswers, postAnswers, increaseAnswerVote, decreaseAnswerVote, deleteAnswer,modifyAnswer, getAnswer};