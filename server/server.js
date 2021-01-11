//##################################
//###### SETTINGS & MODULES #######
//#################################

const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const { hash, compare } = require("./bc");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");

//##################################
//######    MIDDLEWARES     #######
//#################################

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    express.json({
        extended: false,
    })
);

app.use(express.urlencoded({ extended: false }));

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve(__dirname + "/uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24)
            .then((uid) => {
                callback(null, uid + path.extname(file.originalname));
            })
            .catch((err) => callback(err));
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));

//##################################
//########### ROUTES ##############
//#################################

app.post("/registartion", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPW) => {
            console.log(hashedPW);
            db.addUser(first, last, email, hashedPW)
                .then(({ rows }) => {
                    // console.log(rows);
                    req.session.userid = rows[0].id;
                    // req.session.logedin = true;
                    res.json({ sucess: true });
                })
                .catch((err) => {
                    console.log("error in registration", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("error in hashing password", err);
            res.json({ error: true });
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.checkUserPW(email)
        .then(({ rows }) => {
            let hashedPW = rows[0].password;
            compare(password, hashedPW).then((result) => {
                console.log(result);
                if (result) {
                    db.getUserIdByEmail(email)
                        .then(({ rows }) => {
                            req.session.userid = rows[0].id;
                            res.json({ sucess: true });
                        })
                        .catch((err) => {
                            console.log("error in logging", err);
                            res.json({ error: true });
                        });
                } else {
                    return;
                }
            });
        })
        .catch((err) => {
            console.log("error in logging", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    if (email == null) {
        res.json({ error: true });
    }
    db.getUserIdByEmail(email)
        .then(({ rows }) => {
            console.log(rows);
            const secretCode = cryptoRandomString({
                length: 6,
            });
            console.log(secretCode);
            db.addCode(email, secretCode).then(({ rows }) => {
                console.log({ rows });
                sendEmail(
                    "arizk991@gmail.com",
                    rows[0].code,
                    "here is your code to reset your password"
                )
                    .then(() => {
                        res.json({ sucess: true });
                    })
                    .catch((err) => {
                        console.log("error in sending email", err);
                        res.json({ error: true });
                    });
            });
        })
        .catch((err) => {
            console.log("error in getting email", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const { password, code } = req.body;
    db.compareCodes(code)
        .then(({ rows }) => {
            console.log(rows);
            hash(password).then((hashedPW) => {
                console.log(hashedPW);
                db.editPassword(hashedPW, req.session.userid)
                    .then(({ rows }) => {
                        console.log(rows);
                        res.json({ sucess: true });
                    })
                    .catch((err) => {
                        console.log("error in editing the password", err);
                        res.json({ error: true });
                    });
            });
        })
        .catch((err) => {
            console.log("error in comparing the codes", err);
            res.json({ error: true });
        });
});

app.get("/user", (req, res) => {
    db.getUserData(req.session.userid)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch((err) => console.log("error", err));
});

app.post("/profilePic", uploader.single("image"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = s3Url + filename;
    const userId = req.session.userid;
    if (req.file) {
        db.addProfilePic(url, userId)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error adding profile pic", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.post("/update-bio", (req, res) => {
    const { draftBio } = req.body;
    console.log(draftBio);
    const userId = req.session.userid;
    if (req.body) {
        db.updateBio(draftBio, userId)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error adding bio", err);
                res.json({ error: true });
            });
    } else {
        res.json({ error: true });
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.userid) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userid) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
