/* Signup.html Router */
const express       = require('express'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      User          = require('../models/user'),
      UserExt       = require('../models/user-extended'),
      DB            = require('../db'),
      SELECT        = require('../db/commands/select-from');

const router = express.Router();
const route  = '/signup';


// GET signup page
router.get('/', (req, res) => {
    res.render('signup.html');
});

// POST new user
router.post('/', passport.authenticate('signup'), (req, res) => {
    let newUser = new UserExt(null, req.body.email, new Date());
    
    DB.database.serialize(() => {
        DB.database.get(SELECT.userIDFromUsers, 
                        req.body.username, 
                        DB.result('POST /yube-it/signup', (row) => {
                        
            if(!row || row.user_id === null) {
                return new Error('user does not exist in DB');
            }
            
            newUser.setID(row.user_id);
            newUser.save();
        }));
    });
    // can't do failure redirect, only ends in 401 - unauthorized
    
    // successful redirect
    res.redirect('/yube-it');
});


module.exports = router;
