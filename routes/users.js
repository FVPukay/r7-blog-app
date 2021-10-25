const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const async = require('async');

// USER PROFILE ROUTE
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash('error', 'Something went wrong');
            res.redirect('/posts');
        }
        res.render('users/show', {user: foundUser});
    });
});

// EDIT ROUTE - user profile form
router.get('/:id/edit', (req, res) => {
    res.render('users/edit', {user: req.user, user_id: req.user._id});
});

// UPDATE ROUTE - user profile
router.put('/:id', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const avatar = req.body.avatar;
    const user = {username: username, email: email, avatar: avatar};
    const oldUsername = await User.findOne(
        {"_id": mongoose.Types.ObjectId(req.params.id)}, 'username'
    );
    
    if (oldUsername.username !== username) {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, user)
        .then(req.flash(
            'success', 
            'Thanks for updating your username. Please log back in.'
        ))
        .then(res.redirect('/login'))
    } else {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, user)
        .then(res.render('users/show', {user: user}))
    }
});

module.exports = router;
