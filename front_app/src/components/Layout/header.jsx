import React from 'react';
import './header.css';

const Header = ({ title, onBack}) => {
    return (
        <header className="header">
            {onBack && (
                <button onClick={onBack} className="back-button"> ← Volver </button>
            )}
            <h1 className="header-title">{title}</h1>
        </header>
    );
};

export default Header;
