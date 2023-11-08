import React, { useEffect, useState } from "react";
import socket from "../../socket";
import { Link } from "react-router-dom";

interface Message {
  user: string;
  message: string;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    socket.on("new_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("send_message", newMessage);
      setNewMessage("");
    }
  };

  return (
    <>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index}>
            <span>{message.user}: </span>
            <span>{message.message}</span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <p>
        <Link to="/room">
          <button>Back to Room</button>
        </Link>
      </p>
    </>
  );
};

export default ChatRoom;
