const sqlite3     = require('sqlite3').verbose(),
      path        = require('path'),
      Select      = require('./commands/select-from'),
      LeftJoin    = require('./commands/left-join'),
      CreateTable = require('./commands/create-table');

const dbPath   = path.resolve('./test.db', '../test.db');
const db       = new sqlite3.Database(dbPath);


/*-------------------------------------------------------*/
/*------- Helpers ---------------------------------------*/
// String, Function, Function -> [Error, Object -> Error or [Object -> X]]
// takes in a string denoting the error location and can optionally take
// a success callback and failure callback,
// if no error is present, success callback is called,
// if their is a failure callback, it is called to prevent the operation from
// hanging
function result(location, success, failure){
    return function(err, obj){
        if(err) {
            if(errHandler){
                console.error(location + ': ' + err);
                return failure(err);
            } else {
                return console.error(location + ': ' + err);
            }
        } else if(success){
            return success(obj);
        } else {
            return;
        }
    }
}


/*-------------------------------------------------------*/
/*------- Table Creation --------------------------------*/
/* turn on foreign keys:
PRAGMA foreign_keys = ON; */

// abstracted to ./commands/create-table.js

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
    return db.get(Select.userNameFromUsers, user, (err, row) => {
        if(err) throw new Error(err);
    
        return callback(row);
    });
}


// [String Function -> Object] -> Object
// searches the DB for all of user's info
function readUser(user, callback){
    return db.get(Select.allFromUser, user, (err, row) => {
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
        console.log('Creating Tables, if not already created');
        db.run('PRAGMA foreign_keys = ON')
          .run(CreateTable.users,     result('createUserTable'))
          .run(CreateTable.usersExts, result('createUserExtTable'))
          .run(CreateTable.posts,     result('createPostTable'))
          .run(CreateTable.comments,  result('createCommentTable'));
    });
}


//!!! this is a text book example of N+1 SELECT problem
//!!! refactor !!!
// String, String, Object -> Void
// retrieves the post info and all comment info associated with it
function postAndComments(user_id, post_date, store, callback){
    console.time('Post & Comments retrieval');
    
    db.get(LeftJoin.usersOnPosts, [user_id, post_date], (err, row) => {
        if(err) return next(err);
            
        store.post = row;
        
        db.all(LeftJoin.usersOnComments, post_date, (err, rows) => {
            if(err) return next(err);

            store.comments = rows;
            
            let parents = store.comments;
            
            db.serialize(() => {
                let statement = db.prepare(LeftJoin.oneUserOnOneComment);
                
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
                console.log(parents);
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
    //commentsTable:   createCommentTable,
    insert:          createDBstatement,
    initialize:      initialize,
    userExists:      userExists,
    readUser:        readUser,
    postAndComments: postAndComments,
    result:          result
}
