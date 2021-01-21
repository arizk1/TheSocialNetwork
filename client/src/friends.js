import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveUsers, accept, unfriend, cancel, reject } from "./action";
import { Link } from "react-router-dom";

export default function Friends(props) {
    const userId = props.id;
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((user) => user.accepted == true)
    );
    const wanabes = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter(
                (user) => user.accepted == false && user.recipient_id === userId
            )
    );
    const pending = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter(
                (user) => user.accepted == false && user.recipient_id !== userId
            )
    );

    useEffect(() => {
        dispatch(receiveUsers());
        console.log("props", props.id);
    }, []);

    if (!friends) {
        return null;
    }

    return (
        <>
            <div className="friends">
                <h1>Your friends</h1>
                {friends.length && (
                    <div>
                        <div className="friends-container">
                            {friends.map((user) => (
                                <div key={user.id} className="card">
                                    <Link to={`/user/${user.id}`}>
                                        <img src={user.profile_pic} />
                                    </Link>
                                    <Link to={`/user/${user.id}`}>
                                        <h2>
                                            {user.first} {user.last}
                                        </h2>
                                    </Link>
                                    <div className="friends-buttons">
                                        <button
                                            id="unfriend"
                                            onClick={() =>
                                                dispatch(unfriend(user.id))
                                            }
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!friends.length && (
                    <div>
                        <h1>Sorry you do not have friends yet</h1>
                    </div>
                )}
            </div>
            <div className="wanabes">
                <h1>Wannabes requests</h1>
                {wanabes.length >= 0 && (
                    <div>
                        <div className="friends-container">
                            {wanabes.map((user) => (
                                <div key={user.id} className="card">
                                    <Link to={`/user/${user.id}`}>
                                        <img src={user.profile_pic} />
                                    </Link>
                                    <Link to={`/user/${user.id}`}>
                                        <h2>
                                            {user.first} {user.last}
                                        </h2>
                                    </Link>
                                    <div className="friends-buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(accept(user.id))
                                            }
                                        >
                                            Add Friend
                                        </button>
                                        <button
                                            id="remove"
                                            onClick={() =>
                                                dispatch(reject(user.id))
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!wanabes.length && (
                    <div>
                        <h4>None!</h4>
                    </div>
                )}
            </div>
            <div className="pending">
                <h1>Pending requests</h1>
                {pending.length >= 0 && (
                    <div>
                        <div className="friends-container">
                            {pending.map((user) => (
                                <div key={user.id} className="card">
                                    <Link to={`/user/${user.id}`}>
                                        <img src={user.profile_pic} />
                                    </Link>
                                    <Link to={`/user/${user.id}`}>
                                        <h2>
                                            {user.first} {user.last}
                                        </h2>
                                    </Link>
                                    <div className="friends-buttons">
                                        <button
                                            className="unfriend"
                                            onClick={() =>
                                                dispatch(cancel(user.id))
                                            }
                                        >
                                            Cancel Request
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!pending.length && (
                    <div>
                        <h4>None!</h4>
                    </div>
                )}
            </div>
        </>
    );
}
