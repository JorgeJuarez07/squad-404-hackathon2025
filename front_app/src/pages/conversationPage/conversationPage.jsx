import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import ConversationHeader from '../../components/conversation/conversationHeader';
import MessageList from '../../components/conversation/messageList';
import MessageInput from '../../components/conversation/messageInput';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './conversationPage.css';

const ConversationPage = ({logout, onProfileClick }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!chatId || !user) {
            setIsLoading(false);
            return;
        };

        const q = query(
        collection(db, 'conversations', chatId, 'messages'),
        orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            text: data.text,
            sender: data.senderId === user.sub ? 'me' : 'them'
            };
        });
        console.log(user.sub);
        setMessages(msgs);
        setIsLoading(false);
        });

        return () => unsubscribe();
    }, [chatId, user]);

    if (isLoading) {
        return <div className="status-message">Cargando mensajes...</div>;
    }

    return (
        <div className="conversation-container">
            <NavigationBar logout={logout} onProfileClick={onProfileClick} />
        <div className="content-card">
            <ConversationHeader name={"Nombre Contacto"} onBack={() => navigate('/chats')} />
            <MessageList messages={messages} />
            <MessageInput chatId={chatId} />
        </div>
        </div>
    );
};

export default ConversationPage;