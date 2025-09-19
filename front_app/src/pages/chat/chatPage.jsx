import React from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Layout/header';
import ChatList from '../../components/chatList/chatList';
import { chatsData } from '../../data/conversationData';
import './chatPage.css';

/*const chatsData = [
    {
        id: 1,
        name: 'Ana la Apicultora',
        message: 'Hola, ¿recibiste la miel que te envié?',
        timestamp: '11:45 AM',
        initial: 'A',
    },
    {
        id: 2,
        name: 'Mercado Orgánico "El Sol"',
        message: 'Tu pedido de vegetales frescos está listo para recoger.',
        timestamp: 'Ayer',
        initial: 'M',
    },
    {
        id: 3,
        name: 'Carlos el Cafetero',
        message: 'Perfecto, te confirmo el envío para el viernes.',
        timestamp: 'Hace 3 días',
        initial: 'C',
    },
    {
        id: 4,
        name: 'Soporte Técnico AgroApp',
        message: 'Hemos actualizado nuestros términos y condiciones. Por favor, revísalos.',
        timestamp: '15/09/2025',
        initial: 'S',
    },
    {
        id: 5,
        name: 'Grupo: Productores de Maíz',
        message: 'Laura: ¡No se olviden de la reunión de mañana!',
        timestamp: 'Ahora',
        initial: 'P',
    },
];*/

const ChatPage = () => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="chat-page-container">
            <div className="chat-page-content">
                <Header title="Chats" onBack={handleGoHome}/>
                <ChatList chats={chatsData} />
            </div>
        </div>
    );
};

export default ChatPage;