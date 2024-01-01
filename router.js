const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');





const User = [
    {id:1, username:'admin', password:'admin', password2:'admin', email: 'admin.gmail.com'},
    {id:1, username:'simeon', password:'simeon', password2:'simeon', email:'ayendisimeon3@gmail.com'},
]



passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
router.use(bodyParser.urlencoded({ extended:true }));

router.use(session({ 
    secret: 'admin',
    resave: true,
    saveUninitialized: true,
    
}));



router.use(passport.initialize());
router.use(passport.session());
router.use(flash());







router.get('/', (req, res) => {
    res.render('index', {title: 'home'});
});

router.get('/signup', (req, res) => {
    req.flash('info', 'Flash message');
    res.render('signup');
});


router.post('/signup', (req, res, next) => {
    const { username, password , email} = req.body;
    if (User.some(u => u.username === username )) {
        req.flash('info', 'this is a flash');
        return res.redirect('/signup');
    }

    const newUser = { id:User.length + 1, username, password, email };
    User.push(newUser);
    req.login(newUser, (err) => {
        if (err) {
            return next(err);
        } else {
            return res.redirect('/dashboard');
        }
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect:'/dashboard',
    successMessage: 'Welcome',
    failureRedirect: '/',
    failureFlash: true,
}));

router.get('/dashboard',  (req, res)=>{
    console.log(req.user);
    if(req.user) {
        
        res.render('dashboard', { user: req.user });
    
    } else {
        res.render('dashboard', {user:null})
    }
});


router.get('/logout', (req, res) => {
    res.logout();
    res.redirect('/login');
});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('dashboard', { user: req.user });
        return next()
    }
    
}


module.exports = router;