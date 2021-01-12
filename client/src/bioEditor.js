import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaVisiable: false,
            draftBio: "",
        };
    }
    handleChange(e) {
        console.log("change event", e.target.value);
        this.setState({
            draftBio: e.target.value,
        });
    }
    handelBioAdding() {
        axios
            .post("/update-bio", this.state)
            .then(({ data }) => {
                console.log("response", data);
                this.props.addBio(data.bio);
            })
            .catch((err) => {
                console.log("error on POST /update-bio", err);
            });
    }

    handleAddorUpdate() {
        this.setState({
            draftBio: this.props.bio,
            textareaVisiable: !this.state.textareaVisiable,
        });
    }

    render() {
        return (
            <div>
                {this.state.textareaVisiable && (
                    <>
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button onClick={() => this.handelBioAdding()}>
                            Save Bio
                        </button>
                    </>
                )}
                <>
                    <p>{this.props.bio}</p>

                    {this.props.addBio && (
                        <button onClick={() => this.handleAddorUpdate()}>
                            {this.props.bio ? "Update Bio" : "Add Bio"}
                        </button>
                    )}
                </>
            </div>
        );
    }
}
