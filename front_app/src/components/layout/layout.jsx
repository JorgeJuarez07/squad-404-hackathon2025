import React from 'react';
import Header from './header'; // Asegúrate de que la ruta sea correcta

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
