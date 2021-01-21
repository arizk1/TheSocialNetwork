import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindUsers() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        let abort;

        (async () => {
            const { data } = await axios.get(`/find/recent/users`);
            if (!abort) {
                // console.log("data from users  ", data);
                setRecentUsers(data);
            }
        })();

        (async () => {
            const { data } = await axios.get(`/find/users/:${query}`);
            if (!abort) {
                // console.log("data from users  ", data);
                setUsers(data);
            }
        })();

        return () => {
            console.log(`About to replace ${query} with a new value`);
            abort = true;
        };
    }, [query]);

    return (
        <section>
            <h1>Our amazing users!</h1>

            {!query && (
                <div>
                    <h2>Here are our most new users, say hi!</h2>
                    <div className="friends-container">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="card">
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        src={
                                            user.profile_pic
                                                ? user.profile_pic
                                                : "/userdef.png"
                                        }
                                    />
                                </Link>
                                <Link to={`/user/${user.id}`}>
                                    <h2>
                                        {user.first} {user.last}
                                    </h2>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h3>Search for a specific user here</h3>
            <input
                className="search"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here..."
            />
            {query && (
                <>
                    <div className="friends-container">
                        {users.map((all, id) => (
                            <div key={id} className="card">
                                <Link to={`/user/${all.id}`}>
                                    <img
                                        src={
                                            all.profile_pic
                                                ? all.profile_pic
                                                : "../userdef.png"
                                        }
                                    />
                                </Link>
                                <Link to={`/user/${all.id}`}>
                                    <h2>
                                        {all.first} {all.last}
                                    </h2>
                                </Link>
                            </div>
                        ))}
                        {!users.length && query && <p>Nothing Found</p>}
                    </div>
                </>
            )}
        </section>
    );
}
