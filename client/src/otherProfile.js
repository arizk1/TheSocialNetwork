import React, { Component } from "react";
import axios from "./axios";
import BioEditor from "./bioEditor";
import FriendshipButton from "./friendship_button";
import ProfilePic from "./profilepic";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(curentUser) {
        console.log(curentUser);
        if (this.props.match.params.id == this.props.id) {
            this.props.history.push("/");
        } else {
            axios
                .get("/user-data/" + this.props.match.params.id)
                .then(({ data }) => {
                    console.log(data[0]);
                    this.setState({ ...data[0] });
                })
                .catch((error) =>
                    console.log("error in geting /user-data", error)
                );
        }
    }
    render() {
        return (
            <>
                <div className="profile-container">
                    <img src={this.state.profile_pic} />

                    <h3>
                        {this.state.first} {this.state.last}
                    </h3>
                    <p> {this.state.bio} </p>

                    <FriendshipButton otherUserId={this.state.id} />
                </div>
            </>
        );
    }
}
