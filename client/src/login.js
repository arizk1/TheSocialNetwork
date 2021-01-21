import { Component } from "react";
import axios from "./axios";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleLogIn(e) {
        e.preventDefault();
        console.log("working");

        axios
            .post("/login", this.state)
            .then(({ data }) => {
                this.setState({ data });
                location.replace("/");
            })
            .catch((error) => {
                this.setState({ error: true });
                console.log("error: ", error);
            });
    }

    render() {
        return (
            <div>
                {this.state.error && (
                    <p>Something is wrong! Please check your input</p>
                )}
                <h2>Sign in</h2>
                <ul className="form1">
                    <li>
                        <label>
                            Email <span className="required">*</span>
                        </label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="email"
                            name="email"
                            className="field-long"
                            placeholder="example@example.com"
                        />
                    </li>
                    <li>
                        <label>
                            Password <span className="required">*</span>
                        </label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            className="password"
                            type="password"
                            name="password"
                            placeholder="p@$$W0rd"
                        />
                    </li>
                    <li>
                        <input
                            onClick={(e) => this.handleLogIn(e)}
                            type="submit"
                            value="SIGN IN"
                        />
                    </li>
                    <HashRouter>
                        <h4>
                            <Link to="/reset-password">
                                Forgot your password?
                            </Link>
                        </h4>
                    </HashRouter>
                </ul>
            </div>
        );
    }
}
