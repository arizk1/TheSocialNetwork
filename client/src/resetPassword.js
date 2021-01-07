import { Component } from "react";
import axios from "./axios";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 1,
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleEmailCheck(e) {
        e.preventDefault();
        console.log("working");
        axios
            .post("/password/reset/start", this.state)
            .then(({ data }) => {
                this.setState({ data, view: 2 });
                // this.setState({ view: 2 });
            })
            .catch((error) => {
                this.setState({ error: true });
                console.log("error: ", error);
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("working");

        axios
            .post("/password/reset/verify", this.state)
            .then(({ data }) => {
                this.setState({ data, view: 3 });
                // this.setState({ view: 3 });
                // location.replace("/");
            })
            .catch((error) => {
                this.setState({ error: true });
                console.log("error: ", error);
            });
    }

    render() {
        return (
            <>
                <div>
                    {this.state.error && (
                        <p>Something is wrong! Please check your input</p>
                    )}
                    <h2>Reset your password</h2>

                    {this.state.view == 1 && (
                        <div>
                            <h3>
                                Please enter the email address with which you
                                registered
                            </h3>
                            <ul className="form1">
                                <li>
                                    <label>
                                        Email{" "}
                                        <span className="required">*</span>
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
                                    <input
                                        onClick={(e) =>
                                            this.handleEmailCheck(e)
                                        }
                                        type="submit"
                                        value="submit"
                                    />
                                </li>
                            </ul>
                        </div>
                    )}
                    {this.state.view == 2 && (
                        <div>
                            <h3>
                                Please enter the code you recieved on your email
                            </h3>
                            <ul className="form1">
                                <li>
                                    <input
                                        onChange={(e) => this.handleChange(e)}
                                        type="text"
                                        name="code"
                                        className="field-long"
                                        placeholder="code"
                                    />
                                </li>
                                <h3>Please enter your new password</h3>
                                <li>
                                    <input
                                        onChange={(e) => this.handleChange(e)}
                                        className="password"
                                        type="password"
                                        name="password"
                                        placeholder="new password"
                                    />
                                </li>
                                <li>
                                    <input
                                        onClick={(e) => this.handleSubmit(e)}
                                        type="submit"
                                        value="submit"
                                    />
                                </li>
                            </ul>
                        </div>
                    )}
                    {this.state.view == 3 && (
                        <div>
                            <h3>Success!</h3>
                            <HashRouter>
                                <div>
                                    <Link to="/login">
                                        You can now login with your new
                                        password!
                                    </Link>
                                </div>
                            </HashRouter>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
