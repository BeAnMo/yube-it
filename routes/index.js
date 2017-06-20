const express = require('express'),
      DB      = require('../db'),
      Comment = require('../models/comment'),
      Utility = require('../utils');

// check out url.resolve()    
const router = express.Router();
// String -> String
// for user in console.time/.timeEnd
const TIMER = (item) => { return 'TIMER - ' + item; };

// router junction
// router.user(URI-of-specific-route, require(route-module))
router.use('/signup', require('./signup'));
router.use('/login', require('./login'));
router.use('/post', require('./post'));
router.use('/p', require('./user'));

// sets variables for templates
router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

// GET home page
router.get('/', function(req, res, next) {
    console.time(TIMER('GET /'));
    const query = 'SELECT * FROM posts ORDER BY post_created DESC';
    DB.database.all(query, (err, rows) => {
        if(err) return next(err);

        let postsInfo = {
            posts: rows,
            utils: {
                formatTitle: Utility.formatTitle,
                elapsedTime: Utility.elapsedTime
            }
        }
        console.timeEnd(TIMER('GET /'));
        res.render('index.html', postsInfo);
    });
});

// GET log out currentUser
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

// GET specific Post page
router.get('/:user_id/:date/:title', (req, res, next) => {
    const postInfo = { formatTitle: Utility.formatTitle };
    
    DB.postAndComments(req.params.user_id, req.params.date, postInfo, () => {
        res.render('post/view-post.html', postInfo);
    });
});

/*
// PUT update post score
router.put('/:user_id/:date/:title', Utility.ensureAuthenticated, (req, res, next) => {
    console.log(req.body);
    const query = 'UPDATE posts SET post_more = ?, post_less = ?, ' +
        'post_score = ? WHERE post_id = ? AND post_created = ?';
    const params = [
        req.body.more, req.body.less, req.body.score, 
        req.params.user_id, req.params.date];
    
    DB.database.run(query, params, (err) => {
        if(err) return next(err);
        // need a way to send data to DB before user navigates to different
        // pages
        next();
    });
});
*/


// POST new comment
const commentURI = '/:user_id/:date/:title';
router.post('/:user_id/:date/:title/comment', Utility.ensureAuthenticated, (req, res, next) => {
    const redirect = '/' + req.params.user_id + '/' + req.params.date + '/' +
        req.params.title;
    const postInfo = {};
    
    let comment = new Comment(req.user.user_id, req.user.user_name, 
                              req.body.body, new Date(), 
                              req.params.date, req.body.parent);
    console.log(comment);
    comment.save();

    DB.postAndComments(req.params.user_id, req.params.date, postInfo, () => {
        res.redirect(redirect);
    });
});


module.exports = router;
