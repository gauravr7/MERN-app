const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "users works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				errors.email = 'email alreadt exists';
				return res.status(400).json(errors);
			} else {
				const avatar = gravatar.url(req.body.email, {
					s: '200', // size
					r: 'pg', // rating
					d: 'mm' // default
				})
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					avatar,
					password: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					})
				})
			}
		})
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	//find user by email.
	User.findOne({ email })
		.then(user => {
			//check for user
			if (!user) {
				errors.email = 'User Not found';
				res.status(404).json(errors);
			}
			// check password
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						//user Matched
						// create JWT payload
						const payload = {
							id: user.id,
							name: user.name,
							avatar: user.avatar
						}

						//sign token
						jwt.sign(
							payload,
							keys.secretOrKey,
							{ expiresIn: 10000 },
							(err, token) => {
								res.json({
									success: true,
									token: 'Bearer ' + token
								});
							});

					} else {
						errors.password = 'Password incorrect';
						return res.status(400).json(errors);
					}
				})
		})
})

// @route   GET api/users/current
// @desc   	Return Curren user
// @access  private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});

module.exports = router;