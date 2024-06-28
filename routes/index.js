var express = require('express');
const session = require('express-session');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const Passport = require('passport');
const localStrategy = require('passport-local');
const upload = require("./multer"); 
Passport.use(new localStrategy(userModel.authenticate()));

router.use(express.static("./public"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', async function(req, res, next) {
  res.render('login', { error: req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.user.username
  })
  .populate("posts");
  console.log(user);
  res.render("profile", {user});
});

router.get('/logout', function(req,res){
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/forgot', (req,res) => {
  res.send("forgot");
});


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
  failureRedirect: '/login',
  failureFlash: true // will show flash message when the login failed
}), function (req,res) {});

router.post('/upload', isLoggedIn, upload.single('file'), async (req,res) => {
  if(!req.file) {
    return res.status(400).render('/profile');
  }
  const user = await userModel.findOne({
    username: req.user.username
  });
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
});

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}


module.exports = router;
