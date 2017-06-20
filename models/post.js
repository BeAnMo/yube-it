/* Post Model */
const DB      = require('../db'),
      Utility = require('../utils');

/* a Post is:
// id should be 'user_ref' not 'post_id'
- id:       Number (pointer to specific user)
- title:    String(3-40 chars)
- body:     String(10-> chars)
- date:     Date
- 'mores':  Number
- 'lesses': Number
*/
function Post(title, body, date){
    this.title     = title;
    this.body      = body;
    this.created   = date.getTime();
    this.more      = 0;
    this.less      = 0;
    this.score     = 0;
    this.id        = null;
}

// Getters
// Void -> X
Post.prototype.getTitle = function(){
    return this.title;
}

Post.prototype.getBody = function(){
    return this.body;
}

Post.prototype.getCreated = function(){
    return this.created;
}

Post.prototype.getMore = function(){
    return this.more;
}

Post.prototype.getLess = function(){
    return this.less;
}

Post.prototype.getScore = function(){
    return this.score;
}

Post.prototype.getID = function(){
    return this.id;
}


// Setters
// X -> Void
Post.prototype.setID = function(newID){
    this.id = newID;
}

Post.prototype.setMoreScore = function(amount){
    this.more += 1;
    this.score + amount;
}

Post.prototype.setLessScore = function(amount){
    this.less -= 1;
    this.score + amount;
}


// Void -> Object
// consumes a User and returns an object for DB insertions
Post.prototype.makeEntry = function(){
  var postInsert = {
    query: 'INSERT INTO posts (post_title, post_body, ' +
        'post_created, post_more, post_less, post_score, post_id) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
    params: [
      this.title,
      this.body,
      this.created,
      this.more,
      this.less,
      this.score,
      this.id
    ]
  };

  return postInsert;
}

// Void -> Void
// inserts new user into DB
Post.prototype.save = function(){
    let entry = this.makeEntry();
    
    return DB.insert(entry);
}


module.exports = Post;
