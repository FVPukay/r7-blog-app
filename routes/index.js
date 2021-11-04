const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root route - show landing page
router.get('/', (req, res) => {
    res.render('landing');
});

// Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render('register', err.message);
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Thanks for signing up ' + user.username + '!');
            res.redirect('/posts');
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Have fun blogging!',
}), (req, res) => {
});

// Log out route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Thanks for using the RESTful 7 Blog App!');
    res.redirect('/posts');
});

module.exports = router;
