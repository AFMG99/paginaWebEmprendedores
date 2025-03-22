import React from 'react'
import { useLocation } from 'react-router-dom'
import Navegacion from '../components/Header/Navegacion'

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderAndNav = location.pathname === '/' || location.pathname === '/Cambio-de-contrasena' || location.pathname === '/Registro';

    return (
        <>
            {!hideHeaderAndNav && <Navegacion />}
            {children}
        </>
    );
};

export default Layout;
