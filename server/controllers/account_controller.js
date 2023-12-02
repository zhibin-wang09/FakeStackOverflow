const user = require('../models/account')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookiestore = require('cookie-store')
const saltRound = 10;
const secret = process.argv[4]; // the fourth argument i.e. the secret

const signup = async (req, res) => {
    // extract important fields
    let username = req.username;
    let password = req.password;
    let email = req.email;
    // check if user existed already, two no users can have the same email
    const checkIfExist = await user.findOne({email: email}); 
    const validEmailFormat = '^[^@]+@[^@]+\.[^@]+$';
    if(checkIfExist !== null){ // if existed already then we will not create an account
        res.status(400).send("Account already exist!");
    }else if(!validEmailFormat.test(email)){ // if the email has the wrong format
        res.status(400).send("Email format is not valid! Please enter the email in such format *@*.* where * means any sequence of characters");
    }else if(password.includes(email) || password.includes(username)){ // if the password contains username or email
        res.status(400).send("Password should not contain username or email!")
    }
    const salt = await bcrypt.genSalt(saltRound); // generate the hashing key
    const hashpass = await bcrypt.hash(password, salt); // hash the password
    const user = await user.creatOne({username, hashpass, email}); // store in database
    res.status(200).send("Account created successfully"); 
}

const login = async (req, res) => {
    // extract important fields
    let password = req.password;
    let email = req.email;

    // check if user already exist
    const checkIfExist = await user.findOne({email: email});
    if(checkIfExist === null){ // result in error if account does not exist
        res.status(401).send("Account does not exist!");
    }
    
    const verdict = await bcrypt.compare(password, checkIfExist.password); // compare password hash
    if(verdict){// if the password is wrong
        res.status(401).send("Wrong password!");
    }
    const token = jwt.sign({email: email}, secret,{ algorithm: 'RS256' }); // make a jwt token
    await cookiestore.set(email, token); // set the token in our cookie store
    res.cookie('token', token, { // send the cookie to the client
        httpOnly: true}).status(200).send("Login successfully");
}

const logout = async (req, res) => {
    if(res.cookie.token === null){ // the user must be signed in to sign out
        res.status(400).send("You are not signed in yet");
    }
    await cookiestore.delete(req.email); // destroy the cookie in our storage
    res.clearCookie('token').status(200).send("Logout successfully"); // clear the cookie on the client side
}

const verify = async (req,res,next) => {
    const verdict = jwt.verify(req.cookie.token,secret,{algorithms: ['RS256']}); // verify the jwt token
    if(verdict){ // if this is valid we move on to the next operation
        next();
    }else{ // if this is not valid we stop here and return error
        res.status(401).send("You are not authorized to continue access the resource");
    }
}

modules.exports = {signup, login, logout, verify}