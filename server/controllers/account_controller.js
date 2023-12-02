const user = require('../models/account')
const bcrypt = require('bcrypt')
const saltRound = 10;

const signup = async (req, res) => {
    // extract important fields
    let username = req.username;
    let password = req.password;
    let email = req.email;
    // check if user existed already, two no users can have the same email
    const checkIfExist = await user.findOne({email: email}); 
    const validEmailFormat = '^[^@]+@[^@]+\.[^@]+$';
    if(checkIfExist !== null){ // if existed already then we will not create an account
        res.status(400).send("User already exist!");
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

const login = () => {

}

const logout = () => {

}

const verify = () => {

}

modules.exports = {signup, login, logout, verify}