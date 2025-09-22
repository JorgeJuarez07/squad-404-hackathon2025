// src/components/Conversation/MessageInput.jsx
import React from 'react';
import './messageInput.css';

const MessageInput = () => {
    return (
        <div className="message-input-container">
        <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="message-input"
        />
        <button className="send-button">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
        </button>
        </div>
    );
};

export default MessageInput;