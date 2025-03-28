import React, { useState } from 'react';
import { FaUserCircle, FaCog, FaBell } from 'react-icons/fa';
import PerfilModal from '../Modals/PerfilModal';
import ConfigModal from '../Modals/ConfigModal';
import NotiModal from '../Modals/NotiModal';
import '../../assets/css/styles.css';

const navegacion = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [showNoti, setShowNoti] = useState(false);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navegacion">
                <div className="container-fluid d-flex justify-content-between align-items-center contenedor-nav">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0">

                            {/* Íconos con eventos para abrir los modales */}
                            <li className="nav-item">
                                <FaBell className="icono-nav" onClick={() => setShowNoti(true)} title="Notificaciones" />
                            </li>
                            <li className="nav-item">
                                <FaCog className="icono-nav" onClick={() => setShowConfig(true)} title="Configuración" />
                            </li>
                            <li className="nav-item">
                                <FaUserCircle className="icono-nav perfil" onClick={() => setShowPerfil(true)} title="Perfil" />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Modales */}
            <NotiModal show={showNoti} handleClose={() => setShowNoti(false)} />
            <ConfigModal show={showConfig} handleClose={() => setShowConfig(false)} />
            <PerfilModal show={showPerfil} handleClose={() => setShowPerfil(false)} />
        </div>
    )
}

export default navegacion
