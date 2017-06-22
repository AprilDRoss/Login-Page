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

let users =[{username:"april",password:"password"},{username:"water", password:"essentia"}];
let messages = [];

//set-up the main endpoint
app.get("/", function(req, res){
    res.render("login");
  });

//render the login page
// app.get("/login", function(req, res){
//   res.render("login");
// });

//retrieve information from login
app.post("/login", function(req, res){
  let loggedinUser;

users.forEach(function(user){
  if(user.username === req.body.username) {
    loggedinUser = user;
  }else {
    loggedinUser = [{
      username:"",
      password:""
    }];
  }
});
req.checkBody("username", "Enter a valid username:").notEmpty();
req.checkBody("password", "Enter a valid password.").notEmpty();
req.checkBody("password", "Invalid username and password!").equals(loggedinUser.password);

// check every user entry for errors
  let errors = req.validationErrors();   //an array of errors
  if (errors){
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    res.render("login",{errors:messages});
  }else{
    res.redirect("/");
    }
});

  //reading the information from user
  app.get("/", function(req, res){
    //render the user.mustache page
    // res.render("user")
    res.render("/",{username:req.session.username});
  });

//keep username and password in users
   //users.push(req.body.username, req.body.password);

app.listen(8080, function(){
  console.log("App is running on localhost:8080.")
});
