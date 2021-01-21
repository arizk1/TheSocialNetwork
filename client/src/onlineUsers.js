import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    return (
        <>
            {onlineUsers &&
                onlineUsers.map((user, idx) => (
                    <div className="online-user" key={idx}>
                        <Link to={"/user/" + user.id}>
                            <img src={user.profile_pic} alt={user.first} />
                        </Link>
                    </div>
                ))}
        </>
    );
}
