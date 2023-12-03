// router that distinguish between different requests
const express = require('express');
const {postQuestion, getQuestionByKeyword ,getQuestion
,updateView, getQuestionById} = require('../controllers/question_controller'); // crud methods for questions
const {getAnswers, postAnswers} = require('../controllers/answer_controller'); // crud methods for answers
const {getTag} = require('../controllers/tag_controller'); // crud method for tags
const {signup, login, logout, verify} = require('../controllers/account_controller'); // has all the authroization & authentication functions
const router = express.Router();

router.route('/get/questions').get(getQuestion); // retrieve questions
router.route('/get/questions/:id').get(getQuestionById); // retrieve questions by id
router.route('/post/questionskeyword').post(getQuestionByKeyword) // retrieve questions by keywords
router.route('/post/questions').post(postQuestion); // add brand new question and update existing quesitions
router.route('/get/answers/:id').get(getAnswers); // retrieve answers asscoiated with a question
router.route('/post/answer/:id').post(postAnswers); // add brand new answer
router.route('/post/questions/updateview/:id').post(updateView); // update the # of views of a question
router.route('/get/tags').get(getTag); // retrieve all the tags
router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/logout').get(logout);

module.exports = router;