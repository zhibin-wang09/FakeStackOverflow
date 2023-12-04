const user = require('../models/account')
const bcrypt = require('bcrypt')
const saltRound = 10;

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
    await user.create({username: username, password: hashpass, email: email}); // store in database
    res.status(200).send("Account created successfully"); 
}

const getSession = async (req, res) => {
    return res.status(200).send(req.session.email);
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
        next();
    }else{ // if this is not valid we stop here and return error
        res.status(401).send("You are not authorized to continue access the resource");
    }
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

module.exports = {signup, login, logout, verify, increaseReputation, decreaseReputation,getUser, getSession}