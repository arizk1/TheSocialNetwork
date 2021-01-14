const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialNet`
);
//GET ROUTES
module.exports.checkStatus = (UserId, OtherUserId) => {
    const q = `SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [UserId, OtherUserId];
    return db.query(q, params);
};

module.exports.getFriends = (userId) => {
    const q = `  SELECT users.id, first, last, profile_pic, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [userId];
    return db.query(q, params);
};

//POST ROUTES
module.exports.makeRequest = (UserId, OtherUserId) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *;`;
    const params = [UserId, OtherUserId];
    return db.query(q, params);
};

module.exports.cancelRequest = (UserId, OtherUserId) => {
    const q = `DELETE FROM friendships 
    WHERE sender_id = $1 AND recipient_id = $2;`;
    const params = [UserId, OtherUserId];
    return db.query(q, params);
};

module.exports.acceptFriend = (UserId, OtherUserId) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE (recipient_id = $1 AND sender_id = $2) 
    OR (recipient_id = $2 AND sender_id = $1)
    RETURNING *;`;
    const params = [UserId, OtherUserId];
    return db.query(q, params);
};

module.exports.unfriend = (UserId, OtherUserId) => {
    const q = `DELETE FROM friendships 
    WHERE (recipient_id = $1 AND sender_id = $2) 
    OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [UserId, OtherUserId];
    return db.query(q, params);
};
