exports.users = `\
INSERT INTO users (\
user_name, \
user_pass\
) \
VALUES (?, ?)\
`;
    
exports.userExts = `\
INSERT INTO users_exts (\
user_ref, \
user_email, \
user_signedup, \
user_more, \
user_less, \
user_score\
) \
VALUES (?, ?, ?, ?, ?, ?)\
`;
    
exports.posts = `\
INSERT INTO posts (\
post_title, \
post_body, \
post_created, \
post_more, \
post_less, \
post_score, \
post_id\
) \
VALUES (?, ?, ?, ?, ?, ?, ?)\
`;
    
exports.comments = `\
INSERT INTO comments (\
comment_user, \
comment_body, \
comment_date, \
comment_more, \
comment_less, \
comment_score, \
comment_post, \
comment_parent\
) \
VALUES (?, ?, ?, ?, ?, ?, ?, ?)\
`;
