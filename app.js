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
//set-up the login endpoint
  app.get("/login", function(req, res){
      res.render("login", {error:messages});
    });

//retrieve information from login
app.post("/login", function(req, res){
  console.log(req.body.username);
  req.checkBody("username",'Invalid username').notEmpty();
  req.checkBody("password", 'Invalid password').notEmpty().isLength({max: 10});

  let errors = req.validationErrors();

  if(errors){
    console.log(errors);
     errors.forEach(function (error){  //loop thru each entry
     messages.push(error.msg);
  });
  res.render("/login",{errors:messages});
} else{
  req.session.username = req.body.username;
  res.redirect("/");
  }
});

//set-up the main endpoint
app.get("/", function(req, res){
    res.render("index",{username:req.session.username});
  });

app.listen(8080, function(){
  console.log("App is running on localhost:8080.")
});
