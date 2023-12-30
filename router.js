const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');


 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(expressSession({ 
    secret: 'simeon',
    resave: false,
    saveUninitialized: true,
    cookie: { secure:true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const users = [
    {id:1, username:'admin', password:'admin', password2:'admin', email: 'admin.gmail.com'},
    {id:1, username:'simeon', password:'simeon', password2:'simeon', email:'ayendisimeon3@gmail.com'},
]

passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username && u.password === u.password)
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message:'Incorrect Username or password'});
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

router.get('/', (req, res) => {
    res.render('index', {title: 'home'});
});

router.get('/signup', (req, res) => {
    req.flash('info', 'Flash message');
    res.render('signup');
});


router.post('/signup', (req, res) => {
    const { username, password , email} = req.body;
    if (users.some(u => u.username === username )) {
        req.flash('info', 'this is a flash');
        return res.redirect('/signup');
    }

    const newUser = { id:users.length + 1, username, password, email };
    users.push(newUser);
    req.login(newUser, (err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/dashboard');
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect:'/dashboard',
    successMessage: 'Welcome',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.get('/dashboard', isLoggedIn, (req, res)=>{
    res.render('dashboard', { user: req.user });
});

router.get('/logout', (req, res) => {
    res.logout();
    res.redirect('/login');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}


module.exports = router;