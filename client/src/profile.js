import { Component } from "react";
import BioEditor from "./bioEditor";
import ProfilePic from "./profilepic";

export default function Profile({
    first,
    last,
    bio,
    addBio,
    profile_pic,
    toggleUploader,
}) {
    return (
        <div>
            <h2>Profile Component</h2>
            <h3>
                My name is {first} {last}
            </h3>
            <ProfilePic
                profile_pic={profile_pic}
                toggleUploader={toggleUploader}
            />
            <BioEditor bio={bio} addBio={addBio} />
        </div>
    );
}
