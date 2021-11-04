const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const expressSanitizer = require('express-sanitizer');

// INDEX ROUTE - show all posts
router.get('/', (req, res) => {
    let noMatch = null;
    Post.find({}, (err, allPosts) => {
        if (err) {
            req.flash('error', err.message);
        } else {
            if (allPosts.length < 1) {
                noMatch = 'No posts, please add some'
            }
            res.render('posts/index', {posts: allPosts, noMatch: noMatch});
        }
    });
});

// NEW ROUTE - show form to post
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('posts/new');
});

// CREATE ROUTE - add new posts
router.post('/', middleware.isLoggedIn, (req, res) => {
    const title = req.body.post.title;
    const image = req.body.post.image;
    const description = req.sanitize(req.body.post.description);
    const author = {
        id: req.user._id,
        username: req.user.username,
    };
    const newPost = {
        title: title, 
        image: image, 
        description: description, 
        author: author
    };
    Post.create(newPost, err => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    });
});

// SHOW ROUTE - show post details
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate('comments likes').exec( (err, foundPost) => {
        if (err || !foundPost) {
            req.flash('error', 'Post not found');
            res.redirect('/posts');
        } else {
            res.render('posts/show', {post: foundPost});
        }
    });
});

// POST LIKE ROUTE
router.post('/:id/like', middleware.isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/posts');
        }
        // Check if req.user._id exists in foundPost.likes
        const foundUserLike = foundPost.likes.some(like => {
            return like.equals(req.user._id);
        });
        if (foundUserLike) {
            // User already liked, removing like
            foundPost.likes.pull(req.user._id);
        } else {
            // Adding the new user like
            foundPost.likes.push(req.user);
        }
        foundPost.save(err => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/posts');
            }
            return res.redirect('/posts/' + foundPost._id);
        });
    });
});

// EDIT ROUTE - edit a post
router.get('/:id/edit', middleware.checkPostOwnership, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts');
        } else {
            res.render('posts/edit', {post: foundPost});
        }
    });
});

// UPDATE ROUTE - update post
router.put('/:id', middleware.checkPostOwnership, (req, res) => {
    req.body.post.description = req.sanitize(req.body.post.description);
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts');
        } else {
            req.flash('success', 'Post updated');
            res.redirect('/posts/' + req.params.id);
        }
    });
});

// DESTROY ROUTE - remove the post and comments
router.delete('/:id', middleware.checkPostOwnership, (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err, removedPost) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/posts');
        }
        Comment.deleteMany( {_id: { $in: removedPost.comments}}, err => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('posts');
            }
            req.flash('success', 'Post deleted');
            return res.redirect('/posts');
        });
    });
});

module.exports = router;
