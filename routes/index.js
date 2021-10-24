const express = require('express');
const router = express.Router();

// Root route - show landing page
router.get('/', (req, res) => {
    res.render('landing');
});

// Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;
