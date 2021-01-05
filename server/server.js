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
                    console.log(rows);
                    req.session.userid = rows[0].id;
                    // req.session.logedin = true;
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log("error in registration", err);
                });
        })
        .catch((err) => {
            console.log("error in hashing password", err);
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
                        })
                        .catch((err) => {
                            console.log("error in logging", err);
                        });
                } else {
                    throw Error;
                }
            });
        })
        .catch((err) => {
            console.log("error in logging", err);
        });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
