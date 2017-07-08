
/*------- WHERE user_name = ? ---------------------------*/
exports.userNameFromUsers = `\
SELECT \
user_name \
FROM users \
WHERE user_name=?\
`;
// DUPLICATE: used in models/user.js
//const query = 'SELECT user_name FROM users WHERE user_name=?';

exports.passwordFromUsers = `\
SELECT \
user_pass \
FROM users \
WHERE user_name=?\
`;
// DUPLICATE: used in models/user.js
//const query = 'SELECT user_pass FROM users WHERE user_name=?';

exports.userIDFromUsers = `\
SELECT \
user_id \
FROM users \
WHERE user_name=?\
`;

exports.userNameAndIDFromUsers = `\
SELECT \
user_id, \
user_name \
FROM users \
WHERE user_name=?\
`;
        
exports.allFromUser = `\
SELECT \
* \
FROM users \
WHERE user_name=?\
`;

// given: users.user_name
exports.allUserExts = `\
SELECT * \
FROM users \
WHERE user_ref = (\
SELECT \
user_id \
FROM users \
WHERE user_name = ?\
)`;

/*------- WHERE user_ref = ... user_name = ? ------------*/
exports.allUserExtsWhere = `\
SELECT \
users_exts.* \
FROM users_exts \
WHERE user_ref = (\
SELECT \
user_id \
FROM users \
WHERE user_name = ?\
)`;

/*------- WHERE post_id = ? -----------------------------*/     
exports.titleAndCreatedFromPosts = `\
SELECT \
post_title, \
post_created \
FROM posts \
WHERE post_id = ?\
`;        

/*------- posts* DESC ORDER -----------------------------*/
exports.allPostsDESC = `\
SELECT \
* \
FROM posts \
ORDER BY post_created DESC\
`;
