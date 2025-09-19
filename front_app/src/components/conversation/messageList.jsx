import React from 'react';
import Message from './message';
import './messageList.css';

const MessageList = ({ messages }) => {
    return (
        <div className="message-list">
        {messages.map(msg => (
            <Message key={msg.id} message={msg} />
        ))}
        </div>
    );
};

export default MessageList;