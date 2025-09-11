import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = ({ selectedUser }) => {
  const { messages = [], sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const scrollEndRef = useRef(null);

  // Load messages when selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id) {
      toast.error("Select a user first!");
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;

    await sendMessage({
      receiverId: selectedUser._id,
      text: trimmed,
    });
    setInput("");
  };

  // Send image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({
        receiverId: selectedUser._id,
        image: reader.result,
      });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#1E1E2F]">
        <img src={assets.logo_icon} alt="logo" className="w-16 mb-2" />
        <p className="text-white font-medium">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1E1E2F]">
      
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-700 sticky top-0 z-10 bg-[#1E1E2F]">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-white font-medium text-sm">{selectedUser.fullName}</p>
          <span className={`flex items-center text-xs ${onlineUsers.includes(selectedUser._id) ? "text-green-400" : "text-gray-500"}`}>
            ● {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="Sent"
                className="max-w-[200px] rounded-lg border border-gray-600"
              />
            ) : (
              <p
                className={`p-2 rounded-lg max-w-[200px] text-white break-words ${
                  msg.senderId === authUser._id
                    ? "bg-violet-500/30 rounded-br-none"
                    : "bg-gray-600/30 rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="flex flex-col items-center text-xs">
              <img
                src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon}
                alt="Avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-gray-400">{formatMessageTime(msg.createdAt)}</span>
            </div>
          </div>
        ))}
        <div ref={scrollEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 p-3 bg-black/50">
        <div className="flex-1 flex items-center bg-gray-100/20 px-3 rounded-full">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            className="flex-1 bg-transparent text-white p-2 rounded-lg outline-none placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden onChange={handleSendImage} />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Upload" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <button onClick={handleSendMessage}>
          <img src={assets.send_button} alt="Send" className="w-7 cursor-pointer" />
        </button>
      </div>

    </div>
  );
};

export default ChatContainer;
