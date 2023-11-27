// this file takes care of handling requests related to answers
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

module.exports = {getAnswers, postAnswers};