import React from 'react';
import './conversationHeader.css';

const ConversationHeader = ({ name, onBack }) => {
    return (
        <header className="conversation-header">
        <button onClick={onBack} className="back-arrow">
            ←
        </button>
        <h1 className="contact-name">{name}</h1>
        </header>
    );
};

export default ConversationHeader;