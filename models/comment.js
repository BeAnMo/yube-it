/* Comment Model */
const DB         = require('../db'),
      InsertInto = require('../db/commands/insert-into');

/* a Comment is:
- author:     User.username
- body:       String(10-> chars)
- date:       Number (as UTC seconds)
- mores:      Number
- lesses:     Number
- score:      Number
- post_id:    Number (original post)
- parent:     Number (references time of parent comment?) */ 
function Comment(id, user, body, date, post, parent){
    this.id     = id; // id of user
    this.post   = post; // date of root post
    //this.user   = user;
    this.body   = body;
    this.date   = date.getTime();
    this.parent = parent; // date of previous comment, 0 if parent is root post
    this.more   = 0;
    this.less   = 0;
    this.score  = 0;
}

// Getters
// Void -> X
Comment.prototype.getBody = function(){
    return this.body;
}

Comment.prototype.getUser = function(){
    return this.user;
}

Comment.prototype.getDate = function(){
    return this.date;
}

Comment.prototype.getMore = function(){
    return this.more;
}

Comment.prototype.getLess = function(){
    return this.less;
}

Comment.prototype.getScore = function(){
    return this.score;
}

Comment.prototype.getID = function(){
    return this.id;
}


// Setters
// X -> Void
Comment.prototype.setID = function(newID){
    this.id = newID;
}

Comment.prototype.setMoreScore = function(amount){
    this.more += 1;
    this.score + amount;
}

Comment.prototype.setLessScore = function(amount){
    ttis.less -= 1;
    this.score + amount;
}

// Void -> Object
// consumes a User and returns an object for DB insertions
Comment.prototype.makeEntry = function(){
  var postInsert = {
    /*query: 'INSERT INTO comments ( ' + 
        'comment_user, comment_body, ' +
        'comment_date, comment_more, ' + 
        'comment_less, comment_score, ' + 
        'comment_post, comment_parent) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',*/
    query: InsertInto.comments,
    params: [
      this.id,
      this.body,
      this.date,
      this.more,
      this.less,
      this.score,
      this.post,
      this.parent
    ]
  };

  return postInsert;
}

// Void -> Void
// inserts new user into DB
Comment.prototype.save = function(){
    let entry = this.makeEntry();
    
    return DB.insert(entry);
}


module.exports = Comment;
