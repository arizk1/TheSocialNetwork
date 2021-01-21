import { useSelector } from "react-redux";
import { socket } from "./socket";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineUsers";
import { useEffect, useRef } from "react";

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log(chatMessages);
    const elemRef = useRef();

    const handelKeyDown = (e) => {
        if (e.key === "Enter") {
            socket.emit("new chat msg", e.target.value);
            elemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    useEffect(() => {
        elemRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    });

    return (
        <>
            <h1>Welcome to the Chatroom</h1>
            <div className="online-users-container">
                <OnlineUsers />
            </div>

            <div className="chat-container">
                <div className="chat" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((message, idx) => (
                            <div key={idx} className="chat-message">
                                <div className="message">
                                    <Link to={`/user/${message.id}`}>
                                        <img src={message.profile_pic} />
                                    </Link>
                                    <h4>
                                        {message.last}
                                        {":"}
                                    </h4>
                                    <p>{message.message}</p>

                                    <h6>
                                        {message.created_at.substring(0, 10)}
                                    </h6>
                                </div>
                            </div>
                        ))}
                </div>

                <div>
                    <textarea
                        className="chat-text"
                        rows="4"
                        cols="50"
                        placeholder="Type your message, press enter to send!"
                        onKeyDown={(e) => handelKeyDown(e)}
                    />
                </div>
            </div>
        </>
    );
}
