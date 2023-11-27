// this file takes care of requests related to questions
const question = require('../models/questions') // obtain the question collection
const tag = require('../models/tags')
const answer = require('../models/answers');


const postQuestion = async (req, res) => { // a post method to handle new questions added to the database
    // req will have a list of tag names
    const tags = [];
    for(const t in req.body.tags){
        const tagInDataBase = await tag.find({name: req.body.tags[t]}); // check if the tag already exist
        if(tagInDataBase.length == 0){
            const newTag = await tag.create({name : req.body.tags[t]});
            tags.push(newTag);
        }
    }
    const q = await question.create({title : req.body.title, text : req.body.text, tags : tags, asked_by : req.body.asked_by});
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

    const questions = await question.find({}); // get ready for filtering from all questions
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
            asked_by:  questions[i].asked_by,
            views: questions[i].views,
            ask_date_time: questions[i].ask_date_time,
            "tags": {},
            "answers" : {},
        };
        for(const j in questions[i]["tags"]){
            const t = await tag.findById(questions[i]["tags"][j]).orFail(new Error("No document found!"));
            formattedQuestions[i]["tags"][j] = t;
        }
        for(const j in questions[i]["answers"]){
            const a = await answer.findById(questions[i]["answers"][j]).orFail(new Error("No document found!"));
            formattedQuestions[i]["answers"][j] = a;
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
    const questions = await question.find({}).orFail(new Error("No document found!")); // get all questions
    const formattedQuestions = [];
    for(const i in questions){
        formattedQuestions[i] = {
            _id : questions[i]._id,
            title: questions[i].title,
            text: questions[i].text,
            asked_by:  questions[i].asked_by,
            views: questions[i].views,
            ask_date_time: questions[i].ask_date_time,
            "tags": {},
            "answers" : {},
        };
        for(const j in questions[i]["tags"]){
            const t = await tag.findById(questions[i]["tags"][j]).orFail(new Error("No document found!"));
            formattedQuestions[i]["tags"][j] = t;
        }
        for(const j in questions[i]["answers"]){
            const a = await answer.findById(questions[i]["answers"][j]).orFail(new Error("No document found!"));
            formattedQuestions[i]["answers"][j] = a;
        }
    }
    res.status(200).send(formattedQuestions);
}

const getQuestionById = async (req,res) => {
    const q = await question.findOne({_id : req.params.id}).orFail(new Error("No document found!"));
    res.status(200).send(q);
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

module.exports = {postQuestion, getQuestionByKeyword ,getQuestion, updateView, getQuestionById}