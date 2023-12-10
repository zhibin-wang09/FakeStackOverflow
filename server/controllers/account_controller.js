const user = require('../models/account')
const bcrypt = require('bcrypt')
const saltRound = 10;
const question = require('../models/questions')
const answers = require('../models/answers');
const tags = require('../models/tags');
const comment = require('../models/comment');

const signup = async (req, res) => {
    // extract important fields
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    // check if user existed already, two no users can have the same email
    const checkIfExist = await user.findOne({email: email}); 
    const validEmailFormat = /^(.+)@(.+)\.(.+)$/;
    if(checkIfExist !== null){ // if existed already then we will not create an account
        return res.status(400).send("Account already exist!");
    }else if(!validEmailFormat.test(email)){ // if the email has the wrong format
        return res.status(400).send("Email format is not valid! Please enter the email in such format *@*.* where * means any sequence of characters");
    }else if(password.includes(email) || password.includes(username)){ // if the password contains username or email
        return res.status(400).send("Password should not contain username or email!")
    }
    const salt = await bcrypt.genSalt(saltRound); // generate the hashing key
    const hashpass = await bcrypt.hash(password, salt); // hash the password
    await user.create({username: username, password: hashpass, email: email,}); // store in database
    res.status(200).send("Account created successfully"); 
}

const getSession = async (req, res) => {
    return res.status(200).send(req.session.email);
}

const getCurrentUserInfo = async (req,res) => {
    const u = await user.find({email: req.body.email}); // the current user from the client side making the request
    const q = await question.find({asked_by: u}); // find all the question asscoiated with the user
    const a = await answers.find({ans_by: u}); // find all the answers associated with the user
    let t = await tags.find({});
    let tagarr = [];
    for(let i =0;i < t.length; i++){
        if(t[i].users.includes(u[0]._id)){
            tagarr.push(t[i]);
        }
    }
    t = tagarr
    let qAnswered = new Set();
    const allQ = await question.find({}).populate({
        path: 'answers',
        populate: {
            path: 'ans_by',
            model: 'User'
        }
    });
    for(const i in allQ){
        for(const j in allQ[i]['answers']){
            if(allQ[i]['answers'][j].ans_by._id.toString() === u[0]._id.toString()){
                allQ[i]['answers'][j].ans_by.password = null;
                allQ[i]['answers'][j].ans_by.email = null;
                qAnswered.add(allQ[i]);
            }
        }
    }
    qAnswered = Array.from(qAnswered);
    res.status(200).send({q,a,u,t,qAnswered}); 
}

const login = async (req, res) => {
    // extract important fields
    let password = req.body.password;
    let email = req.body.email;

    // check if user already exist
    const checkIfExist = await user.findOne({email: email});
    if(checkIfExist === null){ // result in error if account does not exist
        return res.status(401).send("Account does not exist!");
    }

    const verdict = await bcrypt.compare(password, checkIfExist.password); // compare password hash
    if(!verdict){// if the password is wrong
        return res.status(401).send("Wrong password!");
    }
    req.session.email = email;
    return res.status(200).send("Login successful");
}

const logout = async (req, res) => {
    if(req.session.email === null){ // the user must be signed in to sign out
        return res.status(400).send("You are not signed in yet");
    }
    req.session.destroy(function (err){
        if(err) res.status(400).send(err);
        //res.clearCookie('token') // clear the cookie on the client side
        res.redirect(200, '') // fill in this for back to the welcome page  
    });
}

const verify = async (req,res,next) => { 
    if(req.session.email){ // if this is valid we move on to the next operation
        req.body.email = req.session.email; // we will decode the cookie and obtain the email of the user and use it later
        let u = await user.findOne({email: req.body.email});
        if(u && u.role === 'admin' && req.params.id !== undefined && req.path.includes("/profile")){
            // admin will have readwrite permission as any other users. Therefore switch over to user email to further authenticate as whatever user
            u = await user.findOne({_id: req.params.id});
            req.body.email = u.email; 
        }
        next();
    }else{ // if this is not valid we stop here and return error
        res.status(401).send("You are not authorized to continue access the resource. Please Login.");
    }
}

const getAllUser = async (req,res) => {
    const email = req.session.email;
    const admin = await user.findOne({email: email});
    if(admin.role === 'normal'){
        res.status(401).send("You are not admin. Can not get user information");
        return;
    }
    const u = await user.find({});
    res.status(200).send(u);
}

const increaseReputation = async (req,res) => {
    const email = req.body.email; // use the email to identify the question
    const q = await user.findOne({email: email}); // find the question and its associated information
    await user.updateOne({email: email}, {reputation : q.reputation + 5}); // increase the reputation by 1
    res.status(200).send()
}

const decreaseReputation = async (req,res) => {
    const email = req.body.email; // use the id to identify the question
    const q = await user.findOne({email: email}); // find the question and its associated information
    await user.updateOne({email: email}, {reputation : q.reputation - 10}); // increase the reputation by 1
    res.status(200).send()
}

const getUser = async (req,res) => {
    const email  = req.body.email;
    const user = await user.findOne({email:email});
    res.status(200).send(user);
}

const deleteUsers = async (req,res) => {
    const email = req.body.email;
    let admin = await user.findOne({email: email});
    if(admin.role !== 'admin'){ // check if current user is admin
        return res.status(401).send("You can not delete user if you are not admin");
    }
    let du = await user.findOne({_id: req.params.id}); // find the user we wish to delete
    // need to delete all associating questions, answers, comments etc...

    // delete user question
    const q = await question.find({asked_by: du});
    for(const k in q){
        for(const i in q[k]["answers"]){ // go through each individual comment in the answers and delete the comments then the answer
            for(const j in q[k]['answers']["comment"]){
                const commentId = q[k]['answers'][i]['comment'][j]._id;
                await comment.deleteOne({_id: commentId});
            }
            const answerId = q[k]['answers'][i]._id;
            await answers.deleteOne({_id:answerId});
        }

        await question.deleteOne({_id:q[k]._id}); // lastly delete the question
    }

    // delete an answer asked by this user.
    let a = await answers.find({ans_by: du}).populate('comment');
    for(const k in a){
        for(const i in a[k]["comment"]){ // go through the comments and delete each one
            await comment.deleteOne({_id : a[k]['comment'][i]._id});
        }
        await answers.deleteOne({_id : a[k]._id});
    }


    // delete an tag added by this user
    t = await tags.find({});
    for(const i in t){
        for(const j in t[i].users){
            if(t[i].users[j]._id.toString() === du._id){
                await tags.updateOne({_id: t[i]._id}, {users: t[i].users.filter(uu => uu._id.toString() !== du._id)});
            }
        }
    }

    // delete comment added by this user
    await comment.deleteMany({posted_by: du});
    await user.deleteOne({email : du.email});
    u = await user.find({});
    return res.status(200).send(u);
}

const isLoggedin = (req,res) => {
    if(req.session.email){
        res.status(200).send();
    }else{
        res.status(401).send();
    }
}

module.exports = {signup, login, logout, verify, increaseReputation, decreaseReputation,getUser, getSession,getCurrentUserInfo,getAllUser,deleteUsers,isLoggedin}