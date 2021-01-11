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
