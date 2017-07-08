/* Users Pages */
const express = require('express'),
      DB      = require('../db'),
      SELECT  = require('../db/commands/select-from'),
      User    = require('../models/user'),
      UserExt = require('../models/user-extended'),
      Utility = require('../utils');
      
const router = express.Router();
const route  = './p';


// GET info for specific username
router.get('/:username', (req, res, next) => {
    let username = req.params.username;
    
    // why does this not work?
    /*DB.database.get(SELECT.allUserExtsWhere, username, DB.result('GET /:username', (row) => {
        if(!row){
            //throw new Error('DB ERROR: row does not exist');
            return next('error.html');
        } else {
            var userInfo = {
                user_name: username
            };
            
            Object.keys(row).forEach((key) => { userInfo[key] = row[key]; });
            
            DB.database.all(SELECT.titleANDCreatedFromPosts, 
                        userInfo.user_ref, 
                        DB.result('GET /:username - title & date',
                        (rows) => {
                        
                userInfo.posts = rows;
                userInfo.user_signedup = userInfo.user_signedup;
                userInfo.utils = {
                    formatDate: Utility.formatDate,
                    formatTitle: Utility.formatTitle
                };
                
                return res.render('user.html', { user: userInfo });     
            }));
        
        }
    }, next));    */
        
    DB.database.get(SELECT.allUserExtsWhere, username, (err, row) => {
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
