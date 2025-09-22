import React from 'react';
import './message.css';

const Message = ({ message }) => {
    const messageType = message.sender === 'me' ? 'sent' : 'received';

    return (
        <div className={`message-wrapper ${messageType}`}>
        <div className="message-bubble">
            {message.text}
        </div>
        </div>
    );
};

export default Message;