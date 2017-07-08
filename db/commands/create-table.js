exports.posts = 
`CREATE TABLE IF NOT EXISTS posts (\
post_title TEXT, \
post_body TEXT, \
post_created INTEGER, \
post_more INTEGER, \
post_less INTEGER, \
post_score INTEGER, \
post_id INTEGER, \
FOREIGN KEY (post_id) REFERENCES users(user_id)\
)`;
        
exports.comments = 
`CREATE TABLE IF NOT EXISTS comments (\
comment_body TEXT, \
comment_date INTEGER, \
comment_score INTEGER, \
comment_more INTEGER, \
comment_less INTEGER, \
comment_user INTEGER, \
comment_post INTEGER, \
comment_parent INTEGER, \
FOREIGN KEY (comment_user) REFERENCES users(user_id)\
)`;
        
exports.users = 
`CREATE TABLE IF NOT EXISTS users (\
user_id INTEGER PRIMARY KEY AUTOINCREMENT, \
user_name TEXT, \
user_pass TEXT\
)`;
        
exports.usersExts = 
`CREATE TABLE IF NOT EXISTS users_exts (\
user_email TEXT, \
user_signedup TEXT, \ 
user_more REAL, \
user_less REAL, \
user_score REAL, \
user_ref INTEGER, \
FOREIGN KEY(user_ref) REFERENCES users(user_id)\
)`;
