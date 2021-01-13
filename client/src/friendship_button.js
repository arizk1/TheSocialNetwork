import { useEffect, useState } from "react";
import axios from "./axios";

export default function FriendshipButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState();
    // const [action, setAction] = useState({});

    useEffect(() => {
        let abort;
        (async () => {
            if (otherUserId) {
                const { data } = await axios.get(
                    `/friendship-status/${otherUserId}`
                );

                if (!abort) {
                    console.log("data from /friendship-status   ", data);
                    setButtonText(data);
                }
            }
        })();
        return () => {
            console.log(`About to replace ${otherUserId} with a new value`);
            abort = true;
        };
    }, [otherUserId]);

    const handelClick = () => {
        axios
            .post(`/update/friendship-status`, {
                action: buttonText,
                otherUserId: otherUserId,
            })
            .then(({ data }) => {
                console.log("data  ", data);
                setButtonText(data);
            });
    };

    return (
        <section>
            <button className="friendship-button" onClick={handelClick}>
                {buttonText}
            </button>
        </section>
    );
}
