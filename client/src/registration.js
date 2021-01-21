import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends Component {
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

    handleSubmit(e) {
        e.preventDefault();
        console.log("working");

        axios
            .post("/registartion", this.state)
            .then(({ data }) => {
                // console.log(res);
                // debugger;
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

                <h2>Create Account</h2>
                <ul className="form1">
                    <li>
                        <label>
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="text"
                            name="first"
                            className="field-divided"
                            placeholder="First name"
                        />
                        <input
                            onChange={(e) => this.handleChange(e)}
                            type="text"
                            name="last"
                            className="field-divided"
                            placeholder="Last name"
                        />
                    </li>
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
                            onClick={(e) => this.handleSubmit(e)}
                            type="submit"
                            value="SIGN UP"
                        />
                        <div className="loginbutton">
                            <h4>
                                {" "}
                                Have already an account?{" "}
                                <Link to="/login">Login here!</Link>
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}
