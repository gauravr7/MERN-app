const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Load Input Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests port Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "posts works" }));

// @route   GET api/posts
// @desc    Get Post
// @access  public
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ nopostfound: 'no posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get Post by Id
// @access  public
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err => res.status(404).json({ nopostfound: 'no post found with the provided id' }));
});

// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	//check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});
	newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete Post by Id
// @access  private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					//check for post owner
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ notauthorized: 'user not authorized' });
					}

					//delete
					post.remove()
						.then(() => res.json({ success: true }));

				})
				.catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
		})
});

// @route   POST api/posts/like/:id
// @desc    like Post
// @access  private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
						return req.status(400).json({ alreadyliked: 'User already liked this post' })
					}

					//Add the user it to likes array
					post.likes.unshift({ user: req.user.id });
					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({ postnotfound: 'no post found' }));
		});
});

// @route   POST api/posts/unlike/:id
// @desc    unlike Post
// @access  private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
						return req.status(400).json({ notliked: 'you have not yet liked this post' })
					}

					// get the remove index
					const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

					// Splice out of array
					post.likes.splice(removeIndex, 1);
					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({ postnotfound: 'no post found' }));
		});
});

module.exports = router;