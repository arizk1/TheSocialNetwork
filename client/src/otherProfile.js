import React, { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const userId = this.props.match.params.id;
        console.log(
            "this.props.match.params",
            this.props.match.params,
            "userID: ",
            userId
        );
        //axious request

        // if (this.props.match.params.id == this.props.id)
    }
    render() {
        return (
            <>
                <h2>Other Profile</h2>
            </>
        );
    }
}
