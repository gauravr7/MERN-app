const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "users works" }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'email alreadt exists' });
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
    const email = req.body.email;
    const password = req.body.password;

    //find user by email.
    User.findOne({ email })
        .then(user => {
            //check for user
            if (!user) {
                res.status(404).json({ email: 'user not found' });
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json({ msg: 'Success' })
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' });
                    }
                })
        })
})

module.exports = router;