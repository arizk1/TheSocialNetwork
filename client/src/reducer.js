export default function (state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        state = {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type == "ACCEPT") {
        state = {
            ...state,
            friends: state.friends.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friends: state.friends.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: null,
                    };
                } else {
                    return user;
                }
            }),
        };
    }
    if (action.type == "REJECT") {
        state = {
            ...state,
            friends: state.friends.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: null,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "CANCEL_REQUEST") {
        state = {
            ...state,
            friends: state.friends.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: null,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "RECENT_TEN_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.recentTenMessages,
        };
    }

    if (action.type == "POST_NEW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.userAndMessage],
        };
    }

    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            onlineUsers: action.onlineUsers,
        };
    }

    if (action.type == "PRIVATE_LIST") {
        state = {
            ...state,
            privateList: action.privateList,
        };
    }

    return state;
}
