import React from 'react';
import { useNavigate } from 'react-router-dom';
import './conversationHeader.css';

const ConversationHeader = ({ name }) => {
    const navigate = useNavigate();
    return (
        <header className="conversation-header">
            <button onClick={() => navigate(-1)} className="back-arrow">←</button>
            <h1 className="contact-name">{name}</h1>
        </header>
    );
};
export default ConversationHeader;