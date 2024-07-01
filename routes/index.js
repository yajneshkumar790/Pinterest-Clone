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
  res.render('index', { nav: false });
});

router.get('/register', (req,res) => {
  res.render('index', { nav: false });
});

router.get('/login', async function(req, res, next) {
  res.render('login', { error: req.flash('error'), nav: false});
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.user.username
  })
  .populate("posts");
  // console.log(user);
  res.render("profile", {user, nav: true});
});
router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.user.username
  })
  .populate("posts");
  res.render("show", {user, nav: true});
});

router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.user.username});
  const posts = await postModel.find()
  .populate("user");
  res.render("feed", {user, posts, nav: true});
});

router.get('/add', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.user.username
  })
  .populate("posts");
  // console.log(user);
  res.render("add", {user, nav: true});
});


router.get('/logout', function(req,res){
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/login');
  });
});

router.post('/register', function(req, res) {
  // const { username, email, fullname } = req.body;
  const userData = new userModel({ 
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  }); 

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

router.post('/fileupload', isLoggedIn, upload.single('image'), async (req,res) => {
  if(!req.file) {
    return res.status(400).render('/profile');
  }
  const user = await userModel.findOne({
    username: req.user.username
  });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});
router.post('/upload', isLoggedIn, upload.single('image'), async (req,res) => {
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

router.post('/createpost', isLoggedIn, upload.single('postimage'), async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.user.username
  })
  // console.log(user);
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
});

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}


module.exports = router;
