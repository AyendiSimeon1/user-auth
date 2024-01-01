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





const users = [
    {id:1, username:'admin', password:'admin', password2:'admin', email: 'admin.gmail.com'},
    {id:1, username:'simeon', password:'simeon', password2:'simeon', email:'ayendisimeon3@gmail.com'},
]



passport.use(new LocalStrategy(
    function(username, password, done) {
      users.findOne({ username: username }, function (err, user) {
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
    users.findById(id, function(err, user) {
      done(err, user);
    });
  });
  

// // Secret key for JWT
// const secretKey = 'admin';

// // Sample user data (in-memory for demonstration purposes)
// const users = [
//   { id: 1, username: 'admin', password: 'admin' },
//   // Add more users as needed
// ];

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// router.get('/login', (req, res) => {
//     res.render('login');  // 'login' is the name of your view file
//   });

// // Login route - Issue JWT upon successful login
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Authenticate user (replace this with your database lookup)
//   const user = users.find(u => u.username === username && u.password === password);

//   if (user) {
//     // Generate a JWT token
//     const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

//     res.json({ token });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

// // Protected route - Verify JWT before allowing access
// router.get('/dashboard', verifyToken, (req, res) => {
//   res.json({ message: 'Access granted to protected route' });
// });

// // Middleware to verify JWT
// function verifyToken(req, res, next) {
//   // Get token from header, query, or cookie
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'Token not provided' });
//   }

//   // Verify token
//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }

//     // Attach decoded user data to request object for further use
//     req.user = decoded;
//     next();
//   });
// }






// // Signup route - Creates a new user
// router.post('/signup', async (req, res) => {
//     try {
//       const { username, password } = req.body;
  
//       // Check if user already exists
//       const existingUser = users.find(u => u.username === username);
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Create new user (replace this with your database logic)
//       const newUser = { id: users.length + 1, username, password: hashedPassword };
//       users.push(newUser);
  
//       res.status(201).json({ message: 'User created successfully', userId: newUser.id });
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating user' });
//     }
//   });
  

// // Login route - Issue JWT upon successful login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     // Authenticate user (replace this with your database lookup)
//     const user = users.find(u => u.username === username);
  
//     if (user) {
//       // Compare hashed password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (isMatch) {
//         // Generate a JWT token
//         const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
//         res.json({ token });
//       } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//       }
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   });

  
router.use(bodyParser.urlencoded({ extended:true }));

router.use(session({ 
    secret: 'admin',
    resave: true,
    saveUninitialized: true,
    cookie: { secure:true }
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