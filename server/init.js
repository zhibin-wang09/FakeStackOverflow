// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
let userArgs = process.argv.slice(2);

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/account')
let Comment = require('./models/comment')
const bcrypt = require('bcrypt')
const saltRound = 10;

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so'; // pre-determine local database
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function tagCreate(name,users) {
  let tag = new Tag({ name: name, users: users});
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time,comment) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if(comment != false) answerdetail.comment = comment;
  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, comment) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if(comment != false) qstndetail.comment = comment;
  let qstn = new Question(qstndetail);
  return qstn.save();
}

async function adminCreate(username, password, email){
    // assuming this is going to be an admin user
    const salt = await bcrypt.genSalt(saltRound); // generate the hashing key
    const hashpass = await bcrypt.hash(password, salt); // hash the password
    userdetail = {
        username: username,
        password: hashpass,
        email: email,
        role: 'admin',
        reputation: 10000,
        date: new Date()
    }
    let user = new User(userdetail)
    return user.save()
}

function userCreate(username, password,email){
  userdetail = {
        username: username,
        password: password,
        email: email,
        role: 'normal'
    }
    let user = new User(userdetail)
    return user.save()
}

function commentCreate(posted_by, text){
  const commentDetail = {
    posted_by: posted_by,
    text: text
  }
  let comment = new Comment(commentDetail);
  return comment.save();
}

const populate = async () => {
  await adminCreate(userArgs[0], userArgs[1], "admin@gmail.com");
  let u1 = await userCreate('hamkalo', '123455', 'hamkalo@gmail.com');
  let u2 = await userCreate('azad', 'abcdefg', 'azad@gmail.com');
  let u3 = await userCreate('abaya', 'fdasfdsa', 'abaya@gmail.com');
  let u4 = await userCreate('alia', 'rejakdjf;', 'alia@gmail.com');
  let u5 = await userCreate('sana', 'r0u3jajfa', 'sana@gmail.com');
  let u6 = await userCreate('Joji John', '34iordsja', 'JojiJohn@gmail.com');
  let u7 = await userCreate('saltyPeter', 'fdlkaj2rja', 'saltyPeter@gmail.com');
  let t1 = await tagCreate('react', [u1]);
  let t2 = await tagCreate('javascript', [u6]);
  let t3 = await tagCreate('android-studio',[u7]);
  let t4 = await tagCreate('shared-preferences',[u2]);
  let c1 = await commentCreate(u1, "I don't like react");
  let c2 = await commentCreate(u2, "I like react");
  let c3 = await commentCreate(u3, "Maybe I like react");
  let c4 = await commentCreate(u4, "I don't really like react");
  let c5 = await commentCreate(u5, "I love react");
  let c6 = await commentCreate(u6, "I hate react");
  let c7 = await commentCreate(u7, "It's whatever");
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1, false,[c1,c2,c3,c7]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2, false,[c4,c5,c6,c7]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u3, false,[c1,c2,c3]);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u4, false,[c6,c7]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u5, false,[c6,c7]);
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u6, false, false,[c1,c7]);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u7, false, 121,[c7]);
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
