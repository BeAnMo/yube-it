/* login.html Router */
const express       = require('express'),
      User          = require('../models/user')
      passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

const router = express.Router();
const route  = '/login';

// GET signup page
router.get('/', (req, res) => {
    res.render('login.html');
});

// POST log in user
router.post('/', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: route,
    failureFlash: true
}));


module.exports = router;
