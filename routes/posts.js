const express = require('express');
const router = express.Router();

// INDEX ROUTE - show all posts
router.get('/', (req, res) => {
    res.render('posts/index');
});

// NEW ROUTE - show form to post
router.get('/new', (req, res) => {
    res.render('posts/new');
});

module.exports = router;
