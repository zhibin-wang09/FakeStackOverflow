// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // use this middleware to set up the session store
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./routers/fake_so_router.js');
var db = 'mongodb://127.0.0.1:27017/fake_so';
const secret = process.argv[2]; // the third argument i.e. the secret
const app = express();
app.use(cors()); // allow this app to be accessed by other origins. This allows cors to be used to all routes available on server
app.use(express.json()); // allow this app to destruct the json received from the request and populate the req.body field in the middleware. Only if Content-type : 'json'
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({
    secret: secret,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: "token",
    resave: false,
    saveUninitialized: true,
}))
app.use('/', router);
const PORT = 8000;
// running on apple silicon, make sure you installed mongod using homebrew
//mongod --config /opt/homebrew/etc/mongod.conf --fork
const server = app.listen(PORT, () => {
    async function connect(){ // use an async function to handle everything related to the connection
        try{
            await mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true});
            console.log("Successfully connected to the database...");
        }catch(e){
            console.log(e);
        }
    }
    connect();
    // process anything after the connection
    console.log(`Connection at http://localhost:${PORT}...`);
})


/**
 * Event emitter to handle (CTRL + C). 
 * 
 * Note: server.closeAllConnections() & server.close() is part of the express library.
 */
process.on('SIGINT', () => {
    server.closeAllConnections(); // this is the function to disconnect all connections
    console.log('')
    server.close((err) => { // this function only stop new connections
        if(err){
            console.log(`${err}`);
            process.exit(1);
        }else{
            // use .then() because the old callback method is deprecated for mongoose.
            mongoose.disconnect().then(() => {
                console.log("Server closed. Database instance disconnected...");
                process.exit(0);
            }).catch((err) =>{
                console.log(`Database close error ${err}`);
                process.exit(1);
            });
        }
    });
})