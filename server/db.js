const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialNet`
);

module.exports.addUser = (firstName, lastName, email, hashedPw) => {
    const q = `INSERT INTO users (first, last, email, password ) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id`;
    const params = [firstName, lastName, email, hashedPw];
    return db.query(q, params);
};

module.exports.checkUserPW = (email) => {
    const q = `SELECT password FROM users WHERE email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserIdByEmail = (email) => {
    const q = `SELECT id FROM users WHERE email = ($1)`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserData = (userId) => {
    const q = `SELECT * FROM users WHERE id = ($1)`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.getRecentUsers = () => {
    const q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    return db.query(q);
};

module.exports.searchFor = (first) => {
    const q = `SELECT * FROM users WHERE first ILIKE $1;`;
    const params = [first + "%"];
    return db.query(q, params);
};

module.exports.addCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code) 
    VALUES ($1, $2) 
    RETURNING *`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.compareCodes = (code) => {
    const q = `SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes' AND code = ($1);`;
    const params = [code];
    return db.query(q, params);
};

module.exports.editPassword = (hashedPw, userId) => {
    const q = `UPDATE users 
    SET password = $1
    WHERE id = $2`;
    const params = [hashedPw, userId];
    return db.query(q, params);
};

module.exports.addProfilePic = (picUrl, userId) => {
    const q = `UPDATE users SET profile_pic = $1
    WHERE id = $2
    RETURNING profile_pic`;
    const params = [picUrl, userId];
    return db.query(q, params);
};

module.exports.updateBio = (bio, userId) => {
    const q = `UPDATE users SET bio = $1
    WHERE id = $2
    RETURNING bio`;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.addChatMessage = (message, userId) => {
    const q = `INSERT INTO chat_messages (message, sender_id) 
    VALUES ($1, $2) 
    RETURNING *`;
    const params = [message, userId];
    return db.query(q, params);
};

module.exports.getTenMostRecentMessages = () => {
    const q = `SELECT chat_messages.message, chat_messages.id, chat_messages.sender_id, chat_messages.created_at, users.id, users.first, users.last, users.profile_pic
  FROM chat_messages
  JOIN users
  ON chat_messages.sender_id = users.id
  LIMIT 10`;
    return db.query(q);
};

module.exports.deletefromChat = (userId) => {
    const q = `DELETE FROM chat_messages WHERE sender_id = $1`;
    const params = [userId];
    return db.query(q, params);
};
module.exports.deletefriendships = (userId) => {
    const q = `DELETE FROM friendships 
    WHERE (recipient_id = $1 OR sender_id = $1)`;
    const params = [userId];
    return db.query(q, params);
};
module.exports.deletefromusers = (userId) => {
    const q = `DELETE FROM users WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.getUsersByIds = (arrayOfIds) => {
    const query = `SELECT id, first, last, profile_pic FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

module.exports.getPrivateMessageFriendsList = (userId) => {
    const q = `SELECT private_messages.sender_id, private_messages.recipient_id
  FROM private_messages
  WHERE (private_messages.sender_id = $1) OR (private_messages.recipient_id = $1)`;
    const params = [userId];
    return db.query(q, params);
};
