import { useState } from "react";
import axios from "./axios";

export default function DeleteAccount() {
    const [del, setDel] = useState({ del: false });

    // const handleDelete = () => {
    //     setDel({ del: true });
    // };

    // const dontDel = () => {
    //     setDel({ del: false });
    // };

    let abort;
    const deleteAccout = (e) => {
        (async () => {
            const { data } = await axios.post(`/delete-account`);
            if (!abort) {
                if (data.success) {
                    location.replace("/welcome");
                }
            }

            return () => {
                abort = true;
            };
        })([]);
    };

    return (
        <div className="delete-acc">
            {/* {!del && ( */}
            <button onClick={(e) => deleteAccout(e)}>Delete Account</button>
            {/* )} */}

            {/* {del && (
                <>
                    <p>Are you sure? your data will not be restored!</p>

                    <button onClick={(e) => deleteAccout(e)}>Yes</button>
                    <button onClick={(e) => dontDel(e)}>No</button>
                </>
            )} */}
        </div>
    );
}
