// this file takes care of handling requests related to answers
const answers = require('../models/answers');
const answer = require('../models/answers'); // obtain the answer collection
const question = require('../models/questions');

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
    const ans = await answer.create({text: req.body.text, ans_by : req.body.ans_by});
    await question.updateOne({_id : req.params.id}, {answers : [...q[0].answers, ans]});
    res.status(200).send(ans);
}

// require the request to have a parameter of the id of the data in the database. Client side should have this id that was initially sent when fetching answers
const increaseAnswerVote = async (req,res) => {
    const id = req.params.id; // use the id to identify the question
    let a = await answer.findOne({_id: id}); // find the answer and its associated information
    await answer.updateOne({_id: id}, {votes : a.votes + 1}); // increase the reputation by 1
    a = await answer.findOne({_id: id}).populate("ans_by"); // find the answer and its associated information
    a.ans_by.password = null;
    a.ans_by.email = null;
    res.status(200).send(a)
}

// require the request to have a parameter of the id of the data in the database. Client side should have this id that was initially sent when fetching answers
const decreaseAnswerVote = async (req,res) => {
    const id = req.params.id;
    let a = await answer.findOne({_id: id});
    await answer.updateOne({_id: id}, {votes: a.votes - 1});
    a = await answer.findOne({_id: id}).populate("ans_by");
    a.ans_by.password = null;
    a.ans_by.email = null;
    res.status(200).send(a)
}

const deleteAnswer = async (req,res) => { // deleting an answer will delete all of its associated comment
    const id = req.params.id;
    const a = await answers.findOne({_id: id}).populate("comment");
    for(const i in a["comment"]){ // go through the comments and delete each one
        await comment.deleteOne({_id : a['comment'][i]._id});
    }
    await answers.deleteOne({_id : id});
}

module.exports = {getAnswers, postAnswers, increaseAnswerVote, decreaseAnswerVote, deleteAnswer};