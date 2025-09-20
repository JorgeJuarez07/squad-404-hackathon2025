import React from 'react';
import Header from './header'; 

const Layout = ({ children, title, onBack }) => {
    return (
        <div className="layout-container">
            <Header title={title} onBack={onBack} />
            <main className="layout-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
