import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import the CSS file

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('Person 1');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/messages');
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = async () => {
    if (message) {
      try {
        await fetch('http://localhost:5000/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender, message }),
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat App</header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === sender ? 'sent' : 'received'}`}
          >
            <p className="message-sender">{msg.sender}</p>
            <p className="message-text">{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <select className="sender-select" onChange={(e) => setSender(e.target.value)}>
          <option value="Person 1">Person 1</option>
          <option value="Person 2">Person 2</option>
        </select>
        <input
          className="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
