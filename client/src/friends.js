import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveUsers, accept, unfriend } from "./action";
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
            state.friends.filter((user) => user.accepted == false)
    );
    // const pending = useSelector(
    //     (state) =>
    //         state.friends &&
    //         state.friends.filter(
    //             (user) => user.accepted == false && user.id == props.id
    //         )
    // );

    useEffect(() => {
        dispatch(receiveUsers());
        console.log("props", props.id);
    }, []);

    if (!friends) {
        return null;
    }

    return (
        <>
            <div id="friends">
                <h1>Your friends</h1>
                {friends.length && (
                    <div>
                        <div className="friend">
                            {friends.map((user) => (
                                <div key={user.id}>
                                    <Link to={`/user/${user.id}`}>
                                        <img src={user.profile_pic} />
                                    </Link>
                                    <Link to={`/user/${user.id}`}>
                                        {user.first} {user.last}
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(user.id))
                                            }
                                        >
                                            UNFRIEND
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
            <div id="wanabes">
                <h1>Pending requests</h1>
                {wanabes.length >= 0 && (
                    <div>
                        <div className="friend">
                            {wanabes.map((user) => (
                                <div key={user.id}>
                                    <Link to={`/user/${user.id}`}>
                                        <img src={user.profile_pic} />
                                    </Link>
                                    <Link to={`/user/${user.id}`}>
                                        {user.first} {user.last}
                                    </Link>
                                    <div className="buttons">
                                        <button
                                            onClick={() =>
                                                dispatch(accept(user.id))
                                            }
                                        >
                                            ACCEPT
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
        </>
    );
}
