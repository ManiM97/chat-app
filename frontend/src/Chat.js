import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import "./App.css";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("Person 1");
  const [showPicker, setShowPicker] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/messages");
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        await fetch("http://localhost:5000/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender, message }),
        });
        setMessage(""); // Clear input field after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowPicker((prev) => ({ ...prev, [sender]: false })); // Close only for active sender
  };

  // Toggle emoji picker for specific sender
  const togglePicker = (currentSender) => {
    setShowPicker((prev) => ({
      ...prev,
      [currentSender]: !prev[currentSender],
    }));
  };
  

  return (
    <div className="chat-container">
      <header className="chat-header">Chat App</header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === sender ? "sent" : "received"}`}
          >
            <p className="message-sender">{msg.sender}</p>
            <p className="message-text">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Emoji Picker Above Input - Works for Each Sender */}
      {showPicker[sender] && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="chat-input">
        <select
          className="sender-select"
          onChange={(e) => setSender(e.target.value)}
        >
          <option value="Person 1">Person 1</option>
          <option value="Person 2">Person 2</option>
        </select>

        <button className="emoji-button" onClick={() => togglePicker(sender)}>
          😊
        </button>

        <input
          className="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
