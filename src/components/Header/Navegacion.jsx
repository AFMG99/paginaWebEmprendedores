import React, { useState, useRef } from 'react';
import { FaUserCircle, FaCog, FaBell } from 'react-icons/fa';
import PerfilModal from '../Modals/PerfilModal';
import ConfigModal from '../Modals/ConfigModal';
import NotiModal from '../Modals/NotiModal';
import '../../assets/css/styles.css';

const Navegacion = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [showNoti, setShowNoti] = useState(false);
    const profileTriggerRef = useRef(null);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navegacion">
                <div className="container-fluid contenedor-nav">
                        <button
                            className="navbar-toggler ms-auto"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                            <ul className="navbar-nav d-flex flex-row justify-content-evenly align-items-center">
                                <li className="nav-item">
                                    <FaBell className="icono-nav" onClick={() => setShowNoti(true)} title="Notificaciones" />
                                </li>
                                <li className="nav-item">
                                    <FaCog className="icono-nav" onClick={() => setShowConfig(true)} title="Configuración" />
                                </li>
                                <li className="nav-item">
                                    <FaUserCircle
                                        ref={profileTriggerRef}
                                        className="icono-nav perfil"
                                        onClick={() => setShowPerfil(!showPerfil)}
                                        title="Perfil"
                                    />
                                </li>
                            </ul>
                    </div>
                </div>
            </nav>
            {/* Modales */}
            <NotiModal show={showNoti} handleClose={() => setShowNoti(false)} />
            <ConfigModal show={showConfig} handleClose={() => setShowConfig(false)} />
            <PerfilModal
                show={showPerfil}
                handleClose={() => setShowPerfil(false)}
                triggerRef={profileTriggerRef}
            />
        </div>
    );
};

export default Navegacion;