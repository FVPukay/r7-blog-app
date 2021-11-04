require("dotenv").config();

const express          = require('express'),
      app              = express(),
      mongoose         = require('mongoose'),
      methodOverride   = require('method-override'),
      flash            = require('connect-flash'),
      passport         = require('passport'),
      localStrategy    = require('passport-local'),
      expressSanitizer = require('express-sanitizer'),
      User             = require('./models/user'),
      mongoSanitize    = require('express-mongo-sanitize'),
      helmet           = require("helmet"),
      session          = require('express-session'),
      MongoStore       = require('connect-mongo'),
      dbUrl            = process.env.DB_URL || 'mongodb://localhost/r7_blog_app';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB')
    })
    .catch(console.log)

mongoose.connection.on('error', err => {
    req.flash('error', err.message);
    res.redirect('/posts');
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(mongoSanitize());

app.set('view engine', 'ejs');

app.use(express.static('semantic'));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    'https://code.jquery.com',
];

const styleSrcUrls = [
    'https://fonts.googleapis.com',
];

const fontSrcUrls = [
    'https://fonts.gstatic.com',
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com",
                "https://media.istockphoto.com",
            ],
            fontSrc: ["'self'", "data:", ...fontSrcUrls],
        },
    })
);

const secret = process.env.MSS || process.env.MSDEVS;

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
});

store.on('error', err => {
    console.log('SESSION STORE ERROR', err.message);
});

const passportSecret = process.env.PS || process.env.PDEVS;

// Passport configuration
app.use(session({
    store,
    secret: passportSecret,
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
      userRoutes    = require('./routes/users'),
      commentRoutes = require('./routes/comments');

app.use('/', indexRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/posts/:id/comments', commentRoutes);

app.use((req, res, next) => {
    req.flash('error', 'Error: You have been redirected');
    res.status(404).redirect('/posts');
});

module.exports = app;
