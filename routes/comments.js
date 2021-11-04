const express = require('express');
const router = express.Router({mergeParams: true});
const Post = require('../models/post');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const async = require('async');

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts');
        } else {
            res.render('comments/new', {post: post});
        }
    });
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts'); 
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', err.message);
                    res.redirect('/posts');
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Save comment to post
                    post.comments.push(comment);
                    post.save();
                    // Flash success and redirect
                    req.flash('success', 'Comment added');
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});

// EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err || !foundPost) {
            req.flash('error', 'Post not found');
            return res.redirect('/posts');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/posts/' + req.params.id);
            } else {
                res.render('comments/edit', {post_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts/' + req.params.id);
        } else {
            req.flash('success', 'Comment updated');
            res.redirect('/posts/' + req.params.id);
        }
    });
});

// COMMENT DESTROY
router.delete('/:comment_id', middleware.checkCommentOwnership, async (req, res) => {
    const {id, comment_id} = req.params;
    await Post.findByIdAndUpdate(id, { $pull: {comments: comment_id } });
    await Comment.findByIdAndDelete(comment_id);
    req.flash('success', 'Comment deleted');
    res.redirect('/posts/' + req.params.id);
});

module.exports = router;
