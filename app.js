require("dotenv").config();

const express          = require('express'),
      app              = express(),
      mongoose         = require('mongoose'),
      methodOverride   = require('method-override'),
      flash            = require('connect-flash'),
      passport         = require('passport'),
      localStrategy    = require('passport-local'),
      User             = require('./models/user');

mongoose.connect('mongodb://localhost/r7_blog_app')
    .then(() => {
        console.log('Connected to DB')
    })
    .catch(console.log)

mongoose.connection.on('error', err => {
    req.flash('error', `${err}`);
    res.redirect('/posts');
});

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static('semantic'));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport configuration
app.use(require('express-session')({
    secret: process.env.PS,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

const indexRoutes   = require('./routes/index'),
      postRoutes    = require('./routes/posts'),
      userRoutes    = require('./routes/users');
//       commentRoutes = require('./routes/comments');

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
// app.use('/posts/:id/comments', commentRoutes);

app.use(function (req, res, next) {
    req.flash('error', 'Error: You have been redirected');
    res.status(404).redirect('/posts');
});

module.exports = app;
