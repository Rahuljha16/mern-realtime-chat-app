import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios, authUser, onlineUsers } = useContext(AuthContext);

    // --------- GET all users for sidebar ---------
    const getUsers = async () => {
        try {
            // ✅ Correct API path: /api/message/users
            const { data } = await axios.get("/api/message/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // --------- GET messages for selected user ---------
    const getMessages = async (userId) => {
        try {
            // ✅ Correct API path: /api/message/:id
            const { data } = await axios.get(`/api/message/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // --------- Send message to selected user ---------
    const sendMessage = async (messageData) => {
        console.log("Selected User Object:", selectedUser);
        console.log("Selected User ID:", selectedUser?._id);  // optional safe check
        console.log("Message Data:", messageData);

        if (!selectedUser) {
            toast.error("No user selected!");
            return;
        }

        if (!messageData.text && !messageData.image) {
            toast.error("Cannot send empty message!");
            return;
        }
        try {
            // ✅ Always send to /api/message/send with receiverId in body
            const { data } = await axios.post("/api/message/send", {
                receiverId: selectedUser._id,
                ...messageData
            });

            if (data.success) {
                setMessages(prev => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // --------- Socket subscription for new messages ---------
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]);
                // ✅ Correct API path: /api/message/mark/:id
                axios.put(`/api/message/mark/${newMessage._id}`);
            } else {
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }));
            }
        });
    }

    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    }

    // --------- Load users when authUser changes ---------
    useEffect(() => {
        if (authUser) getUsers();
    }, [authUser, onlineUsers]);

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}
