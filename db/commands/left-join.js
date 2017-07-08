// given: posts.post_id, posts.post_created
exports.usersOnPosts = `\
SELECT \
user_name, \
post_title, \
post_body, \
post_created, \
post_id \
FROM posts \
LEFT JOIN users ON posts.post_id = users.user_id \
WHERE post_id = ? AND post_created = ?\
`;
        
// given: comments.comment_post
exports.usersOnComments = `\
SELECT \
user_name, \
comment_body, \
comment_post, \
comment_user, \
comment_date, \
comment_parent \
FROM comments \
LEFT JOIN users ON comments.comment_user = users.user_id \
WHERE comment_post = ?\
`;

// given: comments.comment_date
exports.oneUserOnOneComment = `\
SELECT \
user_name, \
comment_date \
FROM comments \
LEFT JOIN users ON comments.comment_user = users.user_id \
WHERE comment_date = ?\
`;
