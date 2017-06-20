const DB   = require('../db');
      
/*
- User from UserExt:
SELECT * FROM users WHERE user_id = 
    (SELECT user_ref FROM users_exts WHERE user_ref = ?)

- UserExt from User:
SELECT * FROM users_exts WHERE user_ref = 
    (SELECT user_id FROM users WHERE user_id = ?)
*/


function UserExt(id, email, signup){
    this.id       = id;     // String or Number
    this.email    = email;  // String
    this.signup   = signup; // Date
    this.more     = 0;      // String or Number
    this.less     = 0;      // String or Number
    this.base     = 200;    // String or Number
}

// Void -> Void
// gets user's information
UserExt.prototype.getID = function(){ return this.id; };

UserExt.prototype.getEmail = function(){ return this.email; };

UserExt.prototype.getSignup = function(){ return this.signup; };

// total number of 'more' & 'less' not amout of
UserExt.prototype.getMore = function(){ return this.more; };

UserExt.prototype.getLess = function(){ return this.less; };

UserExt.prototype.getBase = function(){ return this.base; };

// String, [Object -> ???] -> Void
// retrieves all user extension info from the DB, given the user name
UserExt.prototype.getAll_DB = function(username, done){
    const q = 'SELECT * FROM users WHERE user_ref = ' +
        '(SELECT user_id FROM users WHERE user_name = ?)';
    DB.database.get(q, username, (err, row) => {
        if(err) throw new Error('DB ERR:', err);
        
        done(row);
    });
};

// X -> Void
// sets user's information
UserExt.prototype.setID = function(newID){ this.id = newID; };

UserExt.prototype.setEmail = function(newEmail){ return this.email = newEmail; };

UserExt.prototype.setMore = function(amount){
    this.more += 1;
    return this.base + amount;
};

UserExt.prototype.setLess = function(amount){
    this.less += 1;
    return this.base - amount;
};

UserExt.prototype.resetBase = function(amount){ return this.base = amount; };


// Void -> Object
// consumes a User and returns an object for DB insertions
UserExt.prototype.makeEntry = function(){
  var userInsert = {
    query: 'INSERT INTO users_exts (user_ref, user_email, ' +
        'user_signedup, user_more, user_less, user_base) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
    params: [
      this.id,
      this.email,
      this.signup.toString(),
      this.more,
      this.less,
      this.base
    ]
  };

  return userInsert;
}

// Void -> Void
// inserts new user into DB
UserExt.prototype.save = function(){
    let entry = this.makeEntry();
    
    return DB.insert(entry);
}


module.exports = UserExt;
