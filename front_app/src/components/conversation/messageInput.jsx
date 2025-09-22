import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './messageInput.css';

const MessageInput = ({ chatId }) => {
    const [text, setText] = useState('');
    const { user } = useAuth();

    const handleSendMessage = async () => {
        if (text.trim() === '' || !user) return;
        try {
        await addDoc(collection(db, 'conversations', chatId, 'messages'), {
            text: text,
            senderId: user.sub,
            timestamp: serverTimestamp(),
        });
        setText('');
        } catch (error) {
        console.error("Error al enviar mensaje:", error);
        }
    };

    return (
        <div className="message-input-container">
        <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="message-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="send-button" onClick={handleSendMessage}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
        </button>
        </div>
    );
};
export default MessageInput;