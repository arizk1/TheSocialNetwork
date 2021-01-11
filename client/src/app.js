import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherProfile";

export default class App extends Component {
    constructor() {
        super();
        // I'm hardcoding but you will be retrieving this data from axios!
        this.state = {
            first: null,
            last: null,
            id: null,
            profile_pic: null,
            bio: null,
            uploaderIsVisible: false,
        };
        // we could bind setImage with the arrow function syntax, too!
        this.setImage = this.setImage.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.addBio = this.addBio.bind(this);
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log(data);
                this.setState({
                    id: data[0].id,
                    first: data[0].first,
                    last: data[0].last,
                    email: data[0].email,
                    profile_pic: data[0].profile_pic,
                });
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }

    // this is passed down to ProfilePic as a prop
    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    // this is passed to Uploader as a prop
    setImage(newProfilePic) {
        console.log("newProfilePic: ", newProfilePic);
        this.setState({
            profile_pic: newProfilePic,
        });
    }

    addBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <BrowserRouter>
                <div>
                    <div className="profile-container">
                        <h1>LOGO</h1>

                        <div className="profile-pic-container">
                            <ProfilePic
                                toggleUploader={this.toggleUploader}
                                first={this.state.first}
                                last={this.state.last}
                                profile_pic={this.state.profile_pic}
                            />
                        </div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    profile_pic={this.state.profile_pic}
                                    bio={this.state.bio}
                                    addBio={this.addBio}
                                    toggleUploader={this.toggleUploader}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    match={props.match}
                                    key={props.match.url}
                                    history={props.history}
                                    id={this.state.id}
                                />
                            )}
                        />

                        {this.state.uploaderIsVisible && (
                            <Uploader setImage={this.setImage} />
                        )}
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
