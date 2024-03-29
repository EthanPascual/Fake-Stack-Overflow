//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const bcrypt = require('bcrypt');
let userArgs = process.argv.slice(2);

let adminName = userArgs[0];
let adminPassword = userArgs[1];

if (!userArgs[2].startsWith('mongodb')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users')
let Comment = require('./models/comments')


let mongoose = require('mongoose');
let mongoDB = userArgs[2];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments) {
  answerdetail = {
    text: text,
    ans_By: ans_by
  };
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (comments != false) {
    answerdetail.comments = comments;
  }
  let answer = new Answer(answerdetail);

  return answer.save();
}


function commentCreate(text, ans_by) {
  answerdetail = {
    text: text,
    ans_By: ans_by,
    upVotes: []
  };

  let comment = new Comment(answerdetail);
  return comment.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, comments) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    upVotes: [],
    downVotes: [],

  }
  if (answers != false) qstndetail.answers = answers;
  if (comments != false) qstndetail.comments = comments;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function userCreate(username, password, email, admin, rep) {
  userdetail = {
    username: username,
    password: password,
    email: email,
    admin: admin,
    rep: rep
  }
  let user = new User(userdetail)
  return user.save();
}

const saltRounds = 10;
const hashedPass = bcrypt.hashSync(adminPassword, saltRounds);
const hashedPass2 = bcrypt.hashSync("EthanIsCool", saltRounds);

const populate = async () => {
  let u1 = await userCreate('EthanPascual', hashedPass2, 'ethan.pascual@gmail.com', true, 50);
  let u2 = await userCreate(adminName, hashedPass, 'admin@gmail.com', true, 50);
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');
  let c1 = await commentCreate("Hello, this is a test comment, I don't think your question is not very intelligent!", u1)
  let c2 = await commentCreate("This may be change we need to increase our comments", u2)
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1, false, [c2]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u1, false);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u2, false);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u1, false);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u2, false);
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u1, false, false, [c1]);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u2, false, 121, false);
  if (db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if (db) db.close();
  });

console.log('processing ...');
