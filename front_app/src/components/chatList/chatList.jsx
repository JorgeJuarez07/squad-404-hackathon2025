import React from 'react';
import ChatItem from '../chatItem/chatItem';
import './chatList.css';

const ChatList = ({ chats }) => {
    return (
        <div className="chat-list">
        {chats.map((chat) => (
            <ChatItem
            key={chat.id}
            id={chat.id}
            initial={chat.initial}
            name={chat.name}
            message={chat.message}
            timestamp={chat.timestamp}
            />
        ))}
        </div>
    );
};

export default ChatList;