/* User Model */
const bcrypt = require('bcrypt-nodejs'),
      DB     = require('../db');


/* a User is:
- username: String (6-20 chars)
- password: String (8-25 chars)
- email:    String (6-25 chars)
- posts:    ...
- comments: ...
- 'mores':  Number
- 'lesses': Number
-  base:    200 (added/substracted with more & less)
- signup:   Date
*/
function User(name, pass){
    this.username = name;
    this.password = pass;
}

// Void -> Void
// gets user's information
User.prototype.getName = function(){ return this.username; };

// Void -> Void
// hashes the user's password, then stores the user in the DB
User.prototype.hashPassAndInsert = function(callback){
    const SALT_FACTOR = 10;
    const noop = function(){};
    const user = this;
    
    // save reference to this user?
    
    // generates salt for the hash
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if(err) return console.error(err);
        
        // hashes the password
        bcrypt.hash(user.password, salt, noop, (err, hashedPass) => {
            if(err) return done(err);
            
            // stores password & continues saving
            user.password = hashedPass;
            // inserts into DB
            console.log('saving user:', user.username);
            return user.save();
        });
    });
}

/*------- DB methods ------------------------------------*/
// String, Function -> Void
// checks to ensure guessed password matches saved pass
User.prototype.checkPassword = function(guess, callback){
    const query = 'SELECT user_pass FROM users WHERE user_name=?';
    DB.database.get(query, this.username, (err, row) => {
        if(err) return new Error(err);
        
        bcrypt.compare(guess, row.user_pass, (err, isMatch) => {
            callback(err, isMatch);
        });
    });
}

// Void -> Object
// consumes a User and returns an object for DB insertions
User.prototype.makeEntry = function(){
  var userInsert = {
    query: 'INSERT INTO users ' +
           '(user_name, user_pass) ' +
           'VALUES (?, ?)',
    params: [
      this.username,
      this.password,
    ]
  };

  return userInsert;
}

// Void -> Void
// inserts new user into DB
User.prototype.save = function(){
    let entry = this.makeEntry();
    
    return DB.insert(entry);
}

// [String Function -> Object] -> Object
// searches the DB for a specific user
User.prototype.nameExists = function(callback){
    const query = 'SELECT user_name FROM users WHERE user_name=?';
    return DB.database.get(query, this.username, (err, row) => {
        if(err) throw new Error(err);
        
        return callback(row);
    });
}

// String [Object -> Object] -> Object
// searches the DB for the user's password
User.prototype.readPass = function(callback){
    const query = 'SELECT user_pass FROM users WHERE user_name=?';
    return DB.database.get(query, this.username, (err, row) => {
        return callback(row);
    });
}


module.exports = User;

