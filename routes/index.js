var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const Passport = require('passport');
const localStrategy = require('passport-local');
// Passport.authenticate(new localStrategy(userModel.authenticate()));
Passport.use(new localStrategy(userModel.authenticate()));

router.use(express.static("./public"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render("profile");
})

router.post('/register', function(req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname }); 

  userModel.register(userData, req.body.password)
    .then(function() {
      Passport.authenticate("local") (req,res,function(){
        res.redirect('/profile');
      })
    })
  
});
router.post('/login', Passport.authenticate('local',{
  successRedirect: "/profile",
  failureRedirect: '/login'
}), function (req,res) {});

router.get('/logout', function(req,res){
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/forgot', (req,res) => {
  res.send("forgoy");
});

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}


module.exports = router;
