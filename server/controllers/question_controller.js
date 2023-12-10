// this file takes care of requests related to questions
const question = require('../models/questions') // obtain the question collection
const tag = require('../models/tags');
const answer = require('../models/answers');
const comment = require('../models/comment');
const answers = require('../models/answers');
const user = require('../models/account');
require('../models/account');


const postQuestion = async (req, res) => { // a post method to handle new questions added to the database
    // req will have a list of tag names
    const u = await user.findOne({email: req.body.email}); 
    const tags = [];
    for(const t in req.body.tags){
        const tagInDataBase = await tag.find({name: req.body.tags[t]}); // check if the tag already exist
        if(tagInDataBase.length == 0){
            if(u.reputation < 50){
                return res.status(400).send(`Your reputation is less than 50. You can not create new tag(s) (${req.body.tags[t]}). Please reuse existing tags.`);
            }
            const newTag = await tag.create({name : req.body.tags[t], users: [u]});
            tags.push(newTag);
        }else{
            tags.push(tagInDataBase[0]);
            let tt = await tag.findOne({name: req.body.tags[t]});
            if(tt.users.includes(u._id)){ // if already is the creator of tag
                continue;
            }
            await tag.updateOne({name: req.body.tags[t]}, {users: [...tagInDataBase[0].users, u]}); // add a new creator of tag
        }
    }
    const q = await question.create({title : req.body.title, text : req.body.text, tags : tags, asked_by : u});
    res.status(200).send(q);
}

const updateView = async (req,res) => {
    const q = await question.findOne({_id : req.params.id}).orFail(new Error("No document found!"));
    await question.updateOne({_id : req.params.id}, {views : q.views + 1}).orFail(new Error("Updating document view failed!")); // the first parameter is the filter to find the document and second parameter is the field to update
    res.sendStatus(200);
}

const getQuestionByKeyword = async (req,res) => { // a get method to retrieve relevant questions from the database
    const keyword = req.body.keywords; // this should be a string
    const keywords = scanKeyWords(keyword); // should have an array of keywords. Now find the questions in the database to match these keywords
    const tagsKeyword = keywords.filter(a => a[0] === true).map(a => a[1]); // separate tag keyword into one array and remove the boolean flag(a[0])
    const normalKeyword = keywords.filter(a => a[0] === false).map(a => a[1]); // separate normal keyword into one array and remove the boolean flag(a[0])

    const questions = await question.find({}).populate('answers').populate('asked_by').populate({
        path: 'answers',
        populate: {
            path: 'ans_by',
            model: 'User'
        }
    }).populate({
        path: 'comment',
        populate: {
            path: 'posted_by',
            model: 'User'
        }
    }); // get ready for filtering from all questions
    const tags = await tag.find({}); // get the tags to get ready for matching
    const tagIdToName = new Map(); // map of tag id -> tag name
    const matchingQuestions = new Set(); // stores all the matching questions

    for(const i in tags){ // create the tagIdToName map
        tagIdToName.set(tags[i]._id.toString(), tags[i].name);
    }
    let formattedQuestions = {}; // an easier format for the user of the API. I.e. formattedquestions is a version of the question model that has the tag & answers already fetched
    for(const i in questions){
        formattedQuestions[i] = {
            _id : questions[i]._id,
            title: questions[i].title,
            text: questions[i].text,
            asked_by:  questions[i].asked_by.username,
            views: questions[i].views,
            ask_date_time: questions[i].ask_date_time,
            tags : questions[i].tags,
            answers: questions[i].answers
        };

        for(const j in questions[i].comment){
            questions[i].comment[j].posted_by.password = null; // erase password
            questions[i].comment[j].posted_by.email = null; // erase the user email
        }
    
        for(const i in q.answers){
            questions[i].answers[j].ans_by.password = null; // erase password
            questions[i].answers[j].ans_by.email = null; // erase the user email
        }

        for(const j in questions[i]["tags"]){ // go through all the tags that questions[i] associated with
            if(tagsKeyword.includes(tagIdToName.get(questions[i]["tags"][j].toString()))){ // tag match
                matchingQuestions.add(formattedQuestions[i]);
            }
        }
        for(let j = 0; j < normalKeyword.length; j++){
            if(questions[i]["title"].toLowerCase().includes(normalKeyword[j])){ // question title match the keyword
                matchingQuestions.add(formattedQuestions[i]);
            }
            if(questions[i]["text"].toLowerCase().includes(normalKeyword[j])){ // question text match the keyword
                matchingQuestions.add(formattedQuestions[i]);
            }
        }
    }
    res.status(200).send([...matchingQuestions]);
}

const getQuestion = async (req,res) => {
    const questions = await question.find({}).populate('tags').populate('asked_by').populate({
        path: 'answers',
        populate: {
            path: 'ans_by',
            model: 'User'
        }
    }).populate({
        path: 'comment',
        populate: {
            path: 'posted_by',
            model: 'User'
        }
    }).orFail(new Error("No document found!")).exec(); // get all questions
    for(const i in questions){ // fetch username only, does not pass the sensitive information to client
        questions[i].asked_by.password = null;
        questions[i].asked_by.email = null;
        for(const j in questions[i].comment){
            questions[i].comment[j].posted_by.password = null; // erase password
            questions[i].comment[j].posted_by.email = null; // erase the user email
        }
    
        for(const j in questions[i].answers){
            questions[i].answers[j].ans_by.password = null; // erase password
            questions[i].answers[j].ans_by.email = null; // erase the user email
        }
    }
    res.status(200).send(questions);
}

const getQuestionById = async (req,res) => {
    const q = await question.findOne({_id : req.params.id}).populate('asked_by').populate({
        path: 'answers',
        populate: [{
            path: 'ans_by',
            model: 'User'
        },{
            path: 'comment',
            model: 'Comment'
        }]
    }).populate('tags').populate({
        path: 'comment',
        populate: {
            path: 'posted_by',
            model: 'User'
        }
    }).orFail(new Error("No document found!")).exec();
    q.asked_by.password = null; // erase the password 
    q.asked_by.email = null; // erase the user email
    for(const i in q.comment){
        q.comment[i].posted_by.password = null; // erase password
        q.comment[i].posted_by.email = null; // erase the user email
    }

    for(const i in q.answers){
        q.answers[i].ans_by.password = null; // erase password
        q.answers[i].ans_by.email = null; // erase the user email
    }
    res.status(200).send(q);
}

// require the request to have a parameter of the id of the data in the database. Client side should have this id that was initially sent when fetching questions
const increaseQuestionVote = async (req,res) => {
    const id = req.params.id; // use the id to identify the question
    let q = await question.findOne({_id: id}); // find the question and its associated information
    u = await user.find({email: req.body.email});
    if(u[0].reputation < 50){
        res.status(400).send("You can not vote yet. Reputation is less than 50. Please get more votes from other people.")
        return;
    }
    await question.updateOne({_id: id}, {votes : q.votes + 1}); // increase the reputation by 1
    q = await question.findOne({_id: id}).populate('comment'); // find the question and its associated information
    res.status(200).send(q)
}

// require the request to have a parameter of the id of the data in the database. Client side should have this id that was initially sent when fetching questions
const decreaseQuestionVote = async (req,res) => {
    const id = req.params.id;
    let q = await question.findOne({_id: id});
    u = await user.find({email: req.body.email});
    if(u[0].reputation < 50){
        res.status(400).send("You can not vote yet. Reputation is less than 50. Please get more votes from other people.")
        return;
    }
    await question.updateOne({_id: id}, {votes: q.votes -1});
    q = await question.findOne({_id: id}).populate('comment'); // find the question and its associated information
    res.status(200).send(q)
}

/**
 * This function will read through a string and process the strings into separate keywords
 * marking the tag keywords vs the text keywords.
 * 
 * @param {String} input 
 * @returns An 2d array with each entry being [boolean][string] -> boolean true if tag false if text.
 */
function scanKeyWords(input){
    let info = input;
    if(info === '') return [];
    let listOfKeywords = []
    info = info.split(" ");
    // info contains different keywords, some may contain tags. Example, ["javascript", "[react][html]", "css"]
    for (let i = 0; i < info.length; i++) {
        if (info[i].includes("[")) {
            for (let j = 0; j < info[i].length; j++) {
                if (info[i][j] === '[') { // if search is a keyword
                    let start = j;
                    while (info[i][j] === '[') j++;
                    start = j - 1;
                    while (j < info[i].length) {
                        if (info[i][j] === ']') {
                            let end = j;
                            listOfKeywords.push([true, info[i].slice(start + 1, end).toLowerCase()]);
                            break;
                        }
                        j++;
                    }
                }
            }
        } else {
            // if search is not a keyword
            listOfKeywords.push([false, info[i].toLowerCase()]);
        }
    }
    return listOfKeywords;
}

const deleteQuestion = async (req,res) => { // deleting a question will delete all of its associated comment and answers
    const id = req.params.id;
    let q = await question.findOne({_id: id}).populate('answers').populate('comment'); // populate the fields that we need to delete
    for(const j in q["comment"]){ // go through each comment and delete each individual one
        const commentId = q['comment'][j]._id;
        await comment.deleteOne({_id: commentId});
    }
    
    for(const i in q["answers"]){ // go through each individual comment in the answers and delete the comments then the answer
        for(const j in q['answers']["comment"]){
            const commentId = q['answers'][i]['comment'][j]._id;
            await comment.deleteOne({_id: commentId});
        }
        const answerId = q['answers'][i]._id;
        await answer.deleteOne({_id:answerId});
    }
    await question.deleteOne({_id:id}); // lastly delete the question
    let u = await user.findOne({email: req.body.email});
    q = await question.find({asked_by: u }); // the new questions set for the user
    const qAnswered = [];
    const allQ = await question.find({}).populate({
        path: 'answers',
        populate: {
            path: 'ans_by',
            model: 'User'
        }
    });
    for(const i in allQ){
        for(const j in allQ[i]['answers']){
            if(allQ[i]['answers'][j].ans_by._id.toString() === u._id.toString()){
                allQ[i]['answers'][j].ans_by.password = null;
                allQ[i]['answers'][j].ans_by.email = null;
                qAnswered.push(allQ[i]);
            }
        }
    }
    t = await tag.find({});
    for(const i in t){
        for(const j in t[i].users){
            if(t[i].users[j]._id.toString() === u.id){
                await tag.updateOne({_id: t[i]._id}, {users: t[i].users.filter(uu => uu._id.toString() !== u.id)});
            }
        }
    }
    t = await tag.find({users:u});
    res.status(200).send({q,qAnswered,t});
}
const modifyQuestion = async (req,res) => { // modifying existing quesition in the databse
    const id = req.params.id;
    const tags = [];
    const u = await user.findOne({email: req.body.email});
    if(req.body.tags){
        for(const t in req.body.tags){
            if(req.body.tags[t] === ' ') continue;
            const tagInDataBase = await tag.find({name: req.body.tags[t]}); // check if the tag already exist
            if(tagInDataBase.length == 0){
                console.log(req.body.tags[t]);
                const newTag = await tag.create({name : req.body.tags[t], users : [u]});
                tags.push(newTag);
            }else{
                tags.push(tagInDataBase[0]);
                if(tagInDataBase[0].users.includes(u._id)){ // if already is the creator of tag
                    continue;
                }
                await tag.updateOne({name: req.body.tags[t]}, {users: [...tagInDataBase[0].users, u]}); // add a new creator of tag
            }
        }
    }
    await question.updateOne({_id: id}, {text: req.body.text, title: req.body.title, tags: tags});
    res.status(200).send("Success");
}

module.exports = {postQuestion, getQuestionByKeyword ,getQuestion, updateView, getQuestionById, increaseQuestionVote, decreaseQuestionVote,
deleteQuestion,modifyQuestion}