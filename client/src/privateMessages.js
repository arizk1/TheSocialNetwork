import { useEffect, useState } from "react";
import { render } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function PrivateMessages(props) {
    // const userId = props.id;

    // const dispatch = useDispatch();
    const privateList = useSelector((state) => state && state.privateList);
    console.log(privateList);

    // const privateMessages = useSelector(
    //     (state) =>
    //         state.privateMessages &&
    //         state.privateMessages.filter((user) => user.accepted == true)
    // );

    const showMessage = () => {
        console.log("working");
    };

    return (
        <>
            <p>Private Messages</p>

            <div onClick={() => showMessage()}>
                {privateList &&
                    privateList.map((user, idx) => (
                        <div className="online-user" key={idx}>
                            <img src={user.profile_pic} />
                            <Link to={"/user/" + user.id}>
                                <h5>
                                    {user.first} {user.last}
                                </h5>
                            </Link>
                        </div>
                    ))}
            </div>
        </>
    );
}
