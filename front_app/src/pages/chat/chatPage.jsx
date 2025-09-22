import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/header';
import ChatList from '../../components/chatList/chatList';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { getConversations } from '../../Api/index';

const ChatPage = ({ logout, onProfileClick }) => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadChats = async () => {
            try {
                const conversationsData = await getConversations();
                setChats(conversationsData);
            } catch (err) {
                console.error("Error al cargar las conversaciones:", err);
                setError("No se pudieron cargar los chats.");
            } finally {
                setIsLoading(false);
            }
        };
        loadChats();
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    const renderContent = () => {
        if (isLoading) {
            return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando chats...</p>;
        }
        if (error) {
            return <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>;
        }
        if (chats.length === 0) {
            return <p style={{ textAlign: 'center', padding: '20px' }}>No tienes conversaciones.</p>
        }
        return <ChatList chats={chats} />;
    };

    return (
        <div className="chat-page-container">
            <div className="content-card">
                <NavigationBar logout={logout} onProfileClick={onProfileClick} />
                <Header title="Chats" onBack={handleGoHome} />
                {renderContent()}
            </div>
        </div>
    );
};

export default ChatPage;