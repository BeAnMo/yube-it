const sqlite3  = require('sqlite3').verbose();
const path     = require('path');

const dbPath   = path.resolve('./test.db', '../test.db');
const db       = new sqlite3.Database(dbPath);


/*-------------------------------------------------------*/
/*------- Table Creation --------------------------------*/
/* turn on foreign keys:
PRAGMA foreign_keys = ON; */

// void -> void
function createPostTable(){
  // creates a table of posts
  // created if table does not exist on server launch
  const q = 'CREATE TABLE IF NOT EXISTS posts ' +
        '(post_title TEXT, ' +
        'post_body TEXT, ' +
        'post_created INTEGER, ' + // make PRIMARY KEY
        'post_more INTEGER, ' +
        'post_less INTEGER, ' +
        'post_score INTEGER, ' +
        'post_id INTEGER, ' +
        'FOREIGN KEY (post_id) REFERENCES users(user_id))';
  
  return db.run(q, (err) => {
        if(err) throw new Error(err);
        
        console.log('DB: posts table created');
    });
}

// void -> void
function createCommentTable(){
    // creates a table of posts
    // created if table does not exist on server launch
    const q = 'CREATE TABLE IF NOT EXISTS comments ' +
        '(comment_body TEXT, ' +
        'comment_date INTEGER, ' + // comment post
        'comment_score INTEGER, ' +
        'comment_more INTEGER, ' +
        'comment_less INTEGER, ' +
        'comment_user INTEGER, ' + // users.user_id
        'comment_post INTEGER, ' + // original post
        'comment_parent INTEGER, ' + // parent comment or original post
        'FOREIGN KEY (comment_user) REFERENCES users(user_id))';
         
        return db.run(q, (err) => {
            if(err) throw new Error(err);
            
            return console.log('DB: comments table created')
        });
}

/*
CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,  
    username TEXT,  
    password TEXT, // encrypt 
    email TEXT
);
*/
// void -> void
function createUserTable(){
  // creates a table of users
  // created if table does not exist on server launch
  // maybe have fields for user agent stuff?
  // ex: OS, browser, hardware
  const q = 'CREATE TABLE IF NOT EXISTS users ' +
        '(user_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'user_name TEXT, user_pass TEXT)';
  
  return db.run(q, (err) => {
        if(err) throw new Error(err);
        
        return console.log('DB: users table created');
    });
}

// void -> void
function createUserExtTable(){
  // creates a table of users
  // created if table does not exist on server launch
  // maybe have fields for user agent stuff?
  // ex: OS, browser, hardware
  const q = 'CREATE TABLE IF NOT EXISTS users_exts ' +
        '(user_email TEXT, user_signedup TEXT, user_more REAL, ' +
        'user_less REAL, user_score REAL, user_ref INTEGER, ' + 
        'FOREIGN KEY(user_ref) REFERENCES users(user_id))';
  
  return db.run(q, (err) => {
        if(err) throw new Error(err);
        
        return console.log('DB: users_exts table created');
    });
}


/*-------------------------------------------------------*/
/*------- DB Checking -----------------------------------*/
// String, Function -> Void
function isTablePresent(table, callback){
    // checks DB for presense of specific table
    db.get('SELECT name FROM sqlite_master ' +
          'WHERE type="table" AND name=?', table,
          callback);
}

// String, Function -> Void
// drops given table
function dropTable(table, callback){
    db.serialize(() => {
        db.run('PRAGMA foreign_keys = OFF');
        
        db.run('DROP TABLE IF EXISTS posts', table);
        
        db.run('PRAGMA foreign_keys = ON');
    });
    
    return callback();
}

// [String Function -> Object] -> Object
// searches the DB for a specific user
function userExists(user, callback){
    const query = 'SELECT user_name FROM users WHERE user_name=?';
    return db.get(query, user, (err, row) => {
        if(err) throw new Error(err);
    
        return callback(row);
    });
}

// [String Function -> Object] -> Object
// searches the DB for all of user's info
function readUser(user, callback){
    const query = 'SELECT * FROM users WHERE user_name=?';
    return db.get(query, user, (err, row) => {
        if(err) throw new Error(err);
        
        return callback(row);
    });
}

/*-------------------------------------------------------*/
/*------- Table Updates & Insertions --------------------*/
// Object -> void
function createDBstatement(obj){
  // creates a statement for insertion into the DB
  let statement = db.prepare(obj.query);

  statement.run(obj.params);

  return statement.finalize();
}

// Void -> Void
// initializes DB
function initialize(){
    return db.serialize(function(){
        db.run('PRAGMA foreign_keys = ON');
        // check if db exists? it should when server goes live
        // need to check if user table exists:
        //   SELECT name FROM sqlite_master WHERE
        //   type='table' AND name='users';
        createUserTable();
        createUserExtTable();
        createPostTable();
        createCommentTable();
    });
}

// String, String, Object -> Void
// retrieves the post info and all comment info associated with it
function postAndComments(user_id, post_date, store, callback){
    console.time('Post & Comments retrieval');
    // retrieves info for the original post
    const userQ = 'SELECT user_name, post_title, post_body, post_created, ' +
        'post_id FROM posts LEFT JOIN users ON posts.post_id = users.user_id ' +
        'WHERE post_id = ? AND post_created = ?';
    // retrieves info for the comments
    const commentQ = 'SELECT user_name, comment_body, comment_post, comment_user, ' + 
        'comment_date, comment_parent ' +
        'FROM comments LEFT JOIN users ON comments.comment_user = users.user_id ' + 
        'WHERE comment_post = ?';
    
    db.get(userQ, [user_id, post_date], (err, row) => {
        if(err) return next(err);
            
        store.post = row;
        
        db.all(commentQ, post_date, (err, rows) => {
            if(err) return next(err);

            store.comments = rows;
            
            let parents = store.comments;
            
            db.serialize(() => {
                // retrieve user_name of the parent comment
                const statementQ = 'SELECT user_name, comment_date FROM ' +
                    'comments LEFT JOIN users ON ' + 
                    'comments.comment_user = users.user_id ' + 
                    'WHERE comment_date = ?';
                let statement = db.prepare(statementQ);
                
                db.run('BEGIN');
                
                for(let i = 0; i < parents.length; i++){
                    statement.get(parents[i].comment_parent, (err, row) => {
                        if(row === undefined){
                            // if row does not exist, that means parent comment
                            // is the original post
                            parents[i].parent_user = store.post.user_name;
                        } else {
                            parents[i].parent_user = row.user_name;
                        }
                        
                    });
                }
                
                db.run('COMMIT');
                
                statement.finalize(() => {
                    console.timeEnd('Post & Comments retrieval');
                    return callback();
                });
            });
        });      
    });
}



module.exports = {
    database:        db,
    path:            dbPath,
    tablePresent:    isTablePresent,
    commentsTable:   createCommentTable,
    insert:          createDBstatement,
    initialize:      initialize,
    userExists:      userExists,
    readUser:        readUser,
    postAndComments: postAndComments
}
