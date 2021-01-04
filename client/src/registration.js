import { Component } from "react";
import axios from "axios";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleSubmit() {
        // evt.preventDefault();
        console.log("working");

        // var formData = new FormData();
        // formData.append("first", this.state.first);
        // formData.append("last", this.state.last);
        // formData.append("email", this.state.email);
        // formData.append("password", this.state.password);

        axios
            .post("/registartion", this.state)
            .then(() => {
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
                <h2>Registration</h2>
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
                            onClick={() => this.handleSubmit()}
                            type="submit"
                            value="Submit"
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
