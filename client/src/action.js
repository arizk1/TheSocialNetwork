import axios from "./axios";

export async function receiveUsers() {
    const { data } = await axios.get("/get-friends");
    console.log("data", data);
    return {
        type: "RECEIVE_FRIENDS",
        friends: data,
    };
}

export async function unfriend(id) {
    const { data } = await axios.post("/unfriend", { otherUserId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "UNFRIEND",
            id: id,
        };
    }
}

export async function accept(id) {
    const { data } = await axios.post("/accept", { otherUserId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "ACCEPT",
            id: id,
        };
    }
}
