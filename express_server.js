const express = require('express');
const morgan = require('morgan'); // console logs get/post request to help with development
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  const char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let output = '';
  for (let i = 0; i < 6; i++){
    output += char[Math.floor(Math.random() * char.length)];
  };
  return output;
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = { 
  "vZRrv6": {
    id: "vZRrv6", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "kRYfIf": {
    id: "kRYfIf", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get('/', (req, res) => {
  if (req.cookies.username){
    res.redirect('/urls');
  } else {
    res.redirect('/login')
  } 
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    username: req.cookies.username
  };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL], 
    username: req.cookies.username
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post('/urls', (req, res) => {
  let short = generateRandomString();
  urlDatabase[short] = req.body.longURL;  // putting a short/long pair into urlDatabase object
  res.redirect('/urls/'+short);
});

app.post('/urls/:shortURL', (req, res) => {
  console.log(urlDatabase[req.params.shortURL], req.body.newURL)
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect('/urls/');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get('/login', (req, res) =>{
  if (req.cookies.username){
    res.redirect('/urls');
  } else {
    let templateVars = {username: req.cookies.username};
    res.render('urls_login', templateVars);
  }
});

app.get ('/register', (req,res) => {
  let templateVars = {username: req.cookies.username};
  res.render('urls_register', templateVars);
});

app.post ('/register', (req,res) =>{
  newID = generateRandomString();
  users[newID] = {
    id: newID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('username', newID);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  console.log(req.cookies);
  
  res.cookie('username', req.body.username); //issued cookies here
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`TinyApp server listening on port ${PORT}!`);
});