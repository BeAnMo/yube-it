const passport      = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      DB            = require('./db'),
      SELECT        = require('./db/commands/select-from'),
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
    
    DB.database.get(SELECT.allFromUser, username, DB.result('passport login', (row) => {
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
    }));
}));

passport.use('signup', new LocalStrategy((username, password, done) => {
    console.log('in signup:', username);
    DB.database.get(SELECT.allFromUser, username, DB.result('passport signup', (row) => {
        // if user exists
        if(row !== undefined) return done(null, false, { message: 'User Exists!' });
        
        // if user does not exist
        let newUser = new User(username, password);
        // search for existing user, if none exist, create new user
        // else alert that username exists
        newUser.hashPassAndInsert();
        
        return done(null, newUser.username);  
    }));
}));

      
module.exports = function(){
    passport.serializeUser((user, done) => {
        console.log('serialization:', user);
        done(null, user);
    });
    
    passport.deserializeUser((name, done) => {
        console.log('deserialize:', name);
        DB.database.get(SELECT.userNameAndIDFromUsers, name, 
                        DB.result('deserialize user:', (row) => {
        
            if(!row) return done(null, false);
            
            return done(null, row);
        }));
    });
}
