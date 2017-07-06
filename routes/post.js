const express = require('express'),
      Post    = require('../models/post'),
      Utility = require('../utils');

const router = express.Router();


// GET post page
router.get('/', Utility.ensureAuthenticated, (req, res, next) => {
    res.render('post/create-post.html', { currentUser: req.user });
});

// POST new post
router.post('/', Utility.ensureAuthenticated, (req, res, next) => {
    let newPost = new Post(req.body.title, req.body.body, new Date());
    newPost.setID(req.user.user_id);
    newPost.save();
    res.redirect('/yube-it');
});


module.exports = router;
