const Post = require('../models/post');
const Comment = require('../models/comment');

const middlewareObj = {};

const EDENIED = 'Permission denied';
const ELOGIN = 'You need to log in to do that';

middlewareObj.checkPostOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, (err, foundPost) => {
            if (err || !foundPost) {
                req.flash('error', 'Post not found');
                res.redirect('/posts');
            } else {
                // Does the user own the post?
                if (foundPost.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', EDENIED);
                    res.redirect('/posts/' + req.params.id);
                }
            }
        });
    } else {  // not authenticated
        req.flash('error', ELOGIN);
        res.redirect('/login');
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('/posts/' + req.params.id);
            } else {
                // Does the user own the comment?
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash('error', EDENIED);
                    res.redirect('/posts/' + req.params.id);
                }
            }
        });
    } else {
        req.flash('error', ELOGIN);
        res.redirect('/login');
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', ELOGIN);
    res.redirect('/login');
};

module.exports = middlewareObj;
