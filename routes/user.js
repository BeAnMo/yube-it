/* Users Pages */
const express = require('express'),
      DB      = require('../db'),
      User    = require('../models/user'),
      UserExt = require('../models/user-extended'),
      Utility = require('../utils');
      
const router = express.Router();
const route  = './p';


// GET info for specific username
router.get('/:username', (req, res, next) => {
    const query = 'SELECT users_exts.* FROM users_exts ' + 
        'WHERE user_ref = (SELECT user_id FROM users WHERE user_name = ?)';
    let username = req.params.username;
        
    DB.database.get(query, username, (err, row) => {
        if(err) {
            //throw new Error('DB ERROR:', err);
            return next('error.html');
        } else if(!row){
            //throw new Error('DB ERROR: row does not exist');
            return next('error.html');
        } else {
            var userInfo = {
                user_name: username
            };
            
            Object.keys(row).forEach((key) => { userInfo[key] = row[key]; });
          
            const postsQ = 'SELECT post_title, post_created FROM posts ' + 
                'WHERE post_id = ?';
            DB.database.all(postsQ, userInfo.user_ref, (err, rows) => {
                if(err) return new Error('DB ERROR:', err);

                userInfo.posts = rows;
                userInfo.user_signedup = userInfo.user_signedup;
                userInfo.utils = {
                    formatDate: Utility.formatDate,
                    formatTitle: Utility.formatTitle
                };
                
                return res.render('user.html', { user: userInfo });
            });    
        }    
    });
});


module.exports = router;
