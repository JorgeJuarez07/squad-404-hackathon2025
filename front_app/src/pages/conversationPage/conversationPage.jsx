// src/pages/ConversationPage/ConversationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conversations } from '../../data/conversationData';
import ConversationHeader from '../../components/Layout/conversationHeader';
import MessageList from '../../components/conversation/messageList';
import MessageInput from '../../components/conversation/messageInput';
import './conversationPage.css';

/*const ConversationPage = () => {
    const [chat, setChat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { chatId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversation = async () => {
        try {
            setIsLoading(true);
            setError(null);

            await new Promise(resolve => setTimeout(resolve, 500));
            const data = conversations[chatId];
            
            if (data) {
            setChat(data);
            } else {
            throw new Error('Conversación no encontrada.');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
        };

        fetchConversation();
    }, [chatId]);

    if (isLoading) {
        return <div className="status-message">Cargando conversación...</div>;
    }

    if (error) {
        return <div className="status-message error">{error}</div>;
    }

    return (
        <div className="conversation-container">
        <div className="conversation-content">
            <ConversationHeader name={chat.name} onBack={() => navigate('/')} />
            <MessageList messages={chat.messages} />
            <MessageInput />
        </div>
        </div>
    );
};

export default ConversationPage; */

const ConversationPage = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();

    const chat = conversations[chatId];

    if (!chat) {
        return (
        <div className="status-message error">
            Conversación no encontrada.
            <button onClick={() => navigate('/chats')}>Volver a Chats</button>
        </div>
        );
    }

    return (
        <div className="conversation-container">
            <div className="content-card">
                <ConversationHeader name={chat.name} onBack={() => navigate('/chats')} />
                <MessageList messages={chat.messages} />
                <MessageInput />
            </div>
        </div>
    );
};

export default ConversationPage;