import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Navegacion from '../components/Header/Navegacion';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const hideHeaderAndNav = ['/', '/Cambio-de-contrasena', '/Registro'].includes(location.pathname);

    if (location.pathname === '/' && isAuthenticated) {
        return <Navigate to="/Principal" replace />;
    }

    if (!hideHeaderAndNav && !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {!hideHeaderAndNav && <Navegacion />}
            {children}
        </>
    );
};

export default Layout;