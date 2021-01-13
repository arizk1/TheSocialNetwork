import { useEffect, useState } from "react";
import axios from "./axios";

const BUTTON_TEXT = {
    MAKE_REQUEST: "Send Friend Request",
    CANCEL_REQUEST: "Cancel Friend Request",
    ACCEPT_REQUEST: "Accept Friend Request",
    UNFRIEND: "Unfriend",
};

export default function FriendshipButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState();
    const [action, setAction] = useState({});

    useEffect(() => {
        let abort;

        (async () => {
            const { data } = await axios.get(
                `/friendship-status/${otherUserId}`
            );
            if (!abort) {
                console.log("data from /friendship-status   ", data);
                setButtonText(data);
                setAction({
                    action: data,
                    otherUserId: otherUserId,
                });
            }
        })();

        return () => {
            console.log(`About to replace ${otherUserId} with a new value`);
            abort = true;
        };
    }, [otherUserId]);

    const handelClick = () => {
        console.log("working");
        console.log("bottontext", buttonText);
        console.log("action", action);

        buttonAction(buttonText, setAction, otherUserId);

        axios.post(`/update/friendship-status`, action).then((data) => {
            console.log("data  ", data);
        });
    };

    return (
        <section>
            <h1>BUTTON! HA!</h1>
            <button onClick={handelClick}>{buttonText}</button>
        </section>
    );
}

function buttonAction(buttonText, setAction, otherUserId) {
    if (buttonText === BUTTON_TEXT.MAKE_REQUEST) {
        return setAction({
            action: BUTTON_TEXT.MAKE_REQUEST,
            otherUserId: otherUserId,
        });
    } else if (buttonText === BUTTON_TEXT.CANCEL_REQUEST) {
        return setAction({
            action: BUTTON_TEXT.CANCEL_REQUEST,
            otherUserId: otherUserId,
        });
    } else if (buttonText === BUTTON_TEXT.ACCEPT_REQUEST) {
        return setAction({
            action: BUTTON_TEXT.ACCEPT_REQUEST,
            otherUserId: otherUserId,
        });
    } else if (buttonText === BUTTON_TEXT.UNFRIEND) {
        return setAction({
            action: BUTTON_TEXT.UNFRIEND,
            otherUserId: otherUserId,
        });
    }
}

// const buttonAction = (buttonText) => {
//     for (const key in BUTTON_TEXT) {
//         if (buttonText === BUTTON_TEXT.key) {
//             setAction({
//                 action: BUTTON_TEXT.key,
//                 otherUserId: otherUserId,
//             });
//         }
//     }
// };
