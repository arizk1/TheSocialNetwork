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

export async function reject(id) {
    const { data } = await axios.post("/reject", { otherUserId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "REJECT",
            id: id,
        };
    }
}

export async function cancel(id) {
    const { data } = await axios.post("/reject", { otherUserId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "CANCEL_REQUEST",
            id: id,
        };
    }
}

export async function postNewMessage(userAndMessage) {
    return {
        type: "POST_NEW_MESSAGE",
        userAndMessage: userAndMessage,
    };
}

export async function getRecentTenMessages(recentTenMessages) {
    return {
        type: "RECENT_TEN_MESSAGES",
        recentTenMessages: recentTenMessages,
    };
}

export async function getOnlineUsers(onlineUsers) {
    return {
        type: "ONLINE_USERS",
        onlineUsers: onlineUsers,
    };
}
export async function getFriendsPrivateMessages(privateList) {
    return {
        type: "PRIVATE_LIST",
        privateList: privateList,
    };
}
