import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to The New World of Social Networks!</h1>

            <HashRouter>
                <div className="loginbutton">
                    <Link to="/login">Click here to Log in!</Link>
                </div>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
