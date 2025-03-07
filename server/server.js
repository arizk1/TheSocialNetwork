//##################################
//###### SETTINGS & MODULES #######
//#################################

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
}); // for Heroku, add ||"webadress from heroku"
const compression = require("compression");
const path = require("path");
const db = require("./db");
const frindshipsDb = require("./friendshipsDb");
const { hash, compare } = require("./bc");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
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

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            console.log(
                "error in logging, Email or Password is incorrect",
                err
            );
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
            console.log(rows);
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

app.get(`/user-data/:id`, (req, res) => {
    console.log(req.params.id);
    db.getUserData(req.params.id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in getting other profile:", err));
});

//##################################
//######     FIND USERS      #######
//#################################

app.get(`/find/recent/users`, (req, res) => {
    db.getRecentUsers()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in getting recent users:", err));
});

app.get(`/find/users/:query`, (req, res) => {
    const { query } = req.params;
    const first = query.replace(/^:+/, "");
    db.searchFor(first)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in searching for people", err));
});

//##################################
//###### FRIENDSHIP BUTTON  #######
//#################################

const BUTTON_TEXT = {
    MAKE_REQUEST: "Send Friend Request",
    CANCEL_REQUEST: "Cancel Friend Request",
    ACCEPT_REQUEST: "Accept Friend Request",
    UNFRIEND: "Unfriend",
};
app.get("/friendship-status/:otherUserId", (req, res) => {
    const userId = req.session.userid;
    const { otherUserId } = req.params;
    // console.log("user id ===>", userId, "other user id ===>", otherUserId);
    frindshipsDb
        .checkStatus(userId, otherUserId)
        .then(({ rows }) => {
            // console.log(rows);
            if (!rows[0]) {
                res.json(BUTTON_TEXT.MAKE_REQUEST);
            }
            if (rows[0]) {
                if (rows[0].accepted == true) {
                    res.json(BUTTON_TEXT.UNFRIEND);
                } else if (rows[0].accepted == false) {
                    if (rows[0].sender_id == userId) {
                        res.json(BUTTON_TEXT.CANCEL_REQUEST);
                    } else {
                        res.json(BUTTON_TEXT.ACCEPT_REQUEST);
                    }
                }
            }
        })
        .catch((err) => console.log("error in .. /friendship-status", err));
});

app.post("/update/friendship-status", (req, res) => {
    const userId = req.session.userid;
    const { action, otherUserId } = req.body;

    if (action === BUTTON_TEXT.MAKE_REQUEST) {
        frindshipsDb
            .makeRequest(userId, otherUserId)
            .then(() => {
                res.json(BUTTON_TEXT.CANCEL_REQUEST);
            })
            .catch((err) => console.log("error in .. make Request", err));
    }
    if (action === BUTTON_TEXT.CANCEL_REQUEST) {
        frindshipsDb
            .cancelRequest(userId, otherUserId)
            .then(() => {
                res.json(BUTTON_TEXT.MAKE_REQUEST);
            })
            .catch((err) => console.log("error in .. cancelRequest", err));
    }
    if (action === BUTTON_TEXT.ACCEPT_REQUEST) {
        frindshipsDb
            .acceptFriend(userId, otherUserId)
            .then(() => {
                res.json(BUTTON_TEXT.UNFRIEND);
            })
            .catch((err) => console.log("error in .. acceptFriend", err));
    }
    if (action === BUTTON_TEXT.UNFRIEND) {
        frindshipsDb
            .unfriend(userId, otherUserId)
            .then(() => {
                res.json(BUTTON_TEXT.MAKE_REQUEST);
            })
            .catch((err) => console.log("error in .. unfriend", err));
    }
});

//##################################
//## /FRIENDS /PENDING / WANABES ##
//#################################

app.get("/get-friends", (req, res) => {
    const userId = req.session.userid;
    frindshipsDb
        .getFriends(userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("error in .. /get-friends", err));
});

app.post("/unfriend", (req, res) => {
    const userId = req.session.userid;
    const { otherUserId } = req.body;

    frindshipsDb
        .unfriend(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("error in .. /unfriend", err));
});
app.post("/accept", (req, res) => {
    const userId = req.session.userid;
    const { otherUserId } = req.body;
    frindshipsDb
        .acceptFriend(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("error in .. /accept", err));
});

app.post("/reject", (req, res) => {
    const userId = req.session.userid;
    const { otherUserId } = req.body;
    frindshipsDb
        .unfriend(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("error in .. /reject", err));
});

app.post("/cancel", (req, res) => {
    const userId = req.session.userid;
    const { otherUserId } = req.body;
    frindshipsDb
        .cancelRequest(userId, otherUserId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("error in .. /cancel", err));
});

// s3.delete,
app.post("/delete-account", (req, res) => {
    const userId = req.session.userid;
    db.deletefromChat(userId).then(() => {
        db.deletefriendships(userId).then(() => {
            db.deletefromusers(userId)
                .then(() => {
                    res.json({ success: true });
                    req.session = null;
                    res.redirect("/welcome");
                })
                .catch((err) => {
                    console.log("error in db.delete user ", err);
                });
        });
    });
});

//##################################
//####   /WELCOME /LOGOUT /*  ######
//#################################
app.get("/welcome", (req, res) => {
    if (req.session.userid) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
});

app.get("*", function (req, res) {
    if (!req.session.userid) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
let onlineUsersObj = {};
let privateList = [];
let UniqePrivateList = [];

io.on("connection", (socket) => {
    console.log("---------------------------------------------");
    console.log(`Socket with id: ${socket.id} is connected`);
    console.log(`User with id: ${socket.request.session.userid} is connected`);
    console.log("---------------------------------------------");

    // ########################################
    // ##########  ONLINE USERS ###############
    // ########################################
    const userId = socket.request.session.userid;

    if (!userId) {
        return socket.disconnect(true);
    }
    onlineUsersObj[socket.id] = userId;
    let onlineUsers = Object.values(onlineUsersObj);
    db.getUsersByIds(onlineUsers).then(({ rows }) => {
        io.sockets.emit("onlineUsers", rows);
    });

    // ########################################
    // ###########      CHAT    ###############
    // ########################################
    socket.on("new chat msg", (message) => {
        db.addChatMessage(message, socket.request.session.userid)
            .then(({ rows }) => {
                const timestamp = rows[0].created_at;
                const msgId = rows[0].id;
                db.getUserData(socket.request.session.userid).then(
                    ({ rows }) => {
                        io.sockets.emit("new chat msg and user", {
                            id: msgId,
                            message: message,
                            firs: rows[0].first,
                            last: rows[0].last,
                            profile_pic: rows[0].profile_pic,
                            created_at: timestamp,
                        });
                    }
                );
            })
            .catch((err) => console.log("error in .. /cancel", err));
    });

    db.getTenMostRecentMessages()
        .then(({ rows }) => {
            socket.emit("10 recent messages", rows);
        })
        .catch((err) => {
            console.error("error in db.getTenMostRecentMessages: ", err);
        });
    // ########################################
    // ###########      CHAT    ###############
    // ########################################

    db.getPrivateMessageFriendsList(userId).then(({ rows }) => {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].sender_id !== userId) {
                privateList.push(rows[i].sender_id);
            } else if (rows[i].recipient_id !== userId) {
                privateList.push(rows[i].recipient_id);
            }
        }
        for (let i = 0; i < privateList.length; i++) {
            if (UniqePrivateList.indexOf(privateList[i]) === -1) {
                UniqePrivateList.push(privateList[i]);
            }
        }
        db.getUsersByIds(UniqePrivateList).then(({ rows }) => {
            socket.emit("listOfFriends", rows);
        });
    });

    // ########################################
    // ########      DISCONNECT    ############
    // ########################################
    socket.on("disconnect", () => {
        console.log(`Socket with id: ${socket.id} is disconnected`);
        delete onlineUsersObj[socket.id];
        let onlineUsers = Object.values(onlineUsersObj);
        db.getUsersByIds(onlineUsers).then(({ rows }) => {
            io.sockets.emit("onlineUsers", rows);
        });
    });
});
