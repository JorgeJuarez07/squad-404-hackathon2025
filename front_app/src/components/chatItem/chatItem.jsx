import React from 'react';
import { useNavigate } from 'react-router-dom';
import './chatItem.css';

const ChatItem = ({ id, initial, name, message, timestamp }) => {
    const navigate = useNavigate(); 

    const handleChatClick = () => {
        navigate(`/chats/${id}`);
    };

    return (
        <div className="chat-item" onClick={handleChatClick}>
        <div className="chat-avatar">{initial}</div>
        <div className="chat-details">
            <p className="chat-name">{name}</p>
            <p className="chat-message">{message}</p>
        </div>
        <div className="chat-timestamp">{timestamp}</div>
        </div>
    );
};

export default ChatItem;