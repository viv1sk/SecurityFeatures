//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//The new mongoose.Schema declaration makes the schema
//being declared an object of the Schema class in mongoose.

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"]
});
//The mongoose encrypt functionality is passed as a plugin
//in the schema that we defined. We pass our secret constant
//as a javascript object in the encrypt plugin.
//The encryptedField allows us to specify which fields we would like to apply
//encryption on.

const User = new mongoose.model("User", userSchema);

app.route("/")

  .get(function(req, res) {
    res.render("home");
  });

app.route("/login")

  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
      email: username
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) { //Checking if the user exists
          if (foundUser.password === password) { //Checking the inputted password against the password in the database.
            res.render("secrets"); //Since the user exists and the pwds match, we render secrets.ejs
          }
        }
      }
    })
  });

app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });





app.listen(3000, function() {
  console.log("Server started successfully @ 3000")
});
