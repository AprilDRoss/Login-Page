const express = require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");

//create the express app
const app = express();

//set up static and set up path using path-package
//this serves static files to server
app.use(express.static(path.join(__dirname,"public")));

//set-up mustache engine
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "mustache");

//implement body-parser and validator
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(validator());

//initialize express session
app.use(session ({
  secret:'hydration',
  resave:false,
  saveUninitialized:false
}));
let messages = [];

let user = [{username:"april", password:"adam4"}];
//console.log(users);

//set-up the login endpoint
  app.get("/login", function(req, res){
   res.render("login",{errors:messages});
    });

//retrieve information from login
app.post("/login", function(req, res){
  let loggedUser;

  user.forEach(function(user){
    if(user.username === req.body.username){
      loggedUser = user;
      console.log(loggedUser);
    }else {
      res.render("login",{errors:messages});
    }
  });
  //console.log(req.body.username);
  req.checkBody("username",'Invalid username').notEmpty();
  req.checkBody("password", 'Invalid password').notEmpty().isLength({max: 10});
  req.checkBody("password", 'Invalid username and password combination.').equals(loggedUser.password);

  let errors = req.validationErrors();

  if(errors){
    console.log(errors);
     errors.forEach(function (error){  //loop thru each entry
     messages.push(error.msg);
  });
  res.render("login",{errors:messages});
} else{
  req.session.username = req.body.username;
  }
  res.redirect("/");
});

//set-up the main endpoint
app.get("/", function(req, res){
  if(req.session.username){
    res.render("index",{username:req.session.username});
  }else {
      res.redirect("/login");
  }
  });

app.listen(8000, function(){
  console.log("App is running on localhost:8000.")
});
