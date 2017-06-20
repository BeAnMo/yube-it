const passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      DB            = require('./db'),
      User          = require('./models/user');
      
/* using passport:
- for signup:
    1. check DB if user exists
    2. create new User, hash password, & save new User
    3. return done(null, newUser)

- for login
    1. check DB if user exists
    2. check DB if password is correct
    3. return done(null, currentUser)
    
- serialization:
    - takes in a User and serialize specified user info for session
        ex: user name, id, etc...
    - this is the info stored in req.user

- deserialization:
    - takes specified user info (req.user) and ... what exactly?
*/
      
passport.use('login', new LocalStrategy((username, password, done) => {
    console.log('login:', username);
    const passQ = 'SELECT * FROM users WHERE user_name=?';
    DB.database.get(passQ, username, (err, row) => {
        if(err) return done(err);
        
        // if user doesn't exist
        if(!row) return done(null, false, { message: 'Not a user!' });
        
        let currentUser = new User(row.user_name, row.user_pass);
  
        currentUser.checkPassword(password, (err, isMatch) => {
            if(err) return done(err);
         
            // correct password
            if(isMatch) {
                // passes info to deserialize
                // retrieve extended user info and send it
                return done(null, currentUser.username);
            } else {
            // incorrect password
                return done(null, false, { message: 'Invalid password.' });
            } 
        });
    });
}));

passport.use('signup', new LocalStrategy((username, password, done) => {
    console.log('in signup:', username);
    const passQ = 'SELECT * FROM users WHERE user_name=?';
    DB.database.get(passQ, username, (err, row) => {
        if(err) done(err);

        // if user exists
        if(row !== undefined) return done(null, false, { message: 'User Exists!' });
        
        // if user does not exist
        let newUser = new User(username, password);
        // search for existing user, if none exist, create new user
        // else alert that username exists
        newUser.hashPassAndInsert();
        
        return done(null, newUser.username);  
    });
}));

      
module.exports = function(){
    passport.serializeUser((user, done) => {
        console.log('serialization:', user);
        done(null, user);
    });
    
    passport.deserializeUser((name, done) => {
        console.log('deserialize:', name);
        const query = 'SELECT user_id, user_name FROM users WHERE user_name=?';
        DB.database.get(query, name, (err, row) => {
            if(err) return done(err);
        
            if(!row) return done(null, false);
            
            return done(null, row);
        });
    });
}
