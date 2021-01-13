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
                    {recentUsers.map((user) => (
                        <div key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <img src={user.profile_pic} />
                            </Link>
                            <Link to={`/user/${user.id}`}>
                                {user.first} {user.last}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            <input
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search here..."
            />
            {query && (
                <>
                    {users.map((all, id) => (
                        <div key={id}>
                            <Link to={`/user/${all.id}`}>
                                <img src={all.profile_pic} />
                            </Link>
                            <Link to={`/user/${all.id}`}>
                                {all.first} {all.last}
                            </Link>
                        </div>
                    ))}
                    {!users.length && query && <p>Nothing Found</p>}
                </>
            )}
        </section>
    );
}
