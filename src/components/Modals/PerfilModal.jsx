import React, { useState, useRef, useEffect } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut } from "react-icons/fi";

const PerfilModal = ({ show, handleClose, triggerRef }) => {
    const { user, logout } = useAuth();
    const modalRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (show && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: triggerRect.bottom + window.scrollY + 8,
                left: triggerRect.left + window.scrollX - 357
            });
        }
    }, [show, triggerRef]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, handleClose, triggerRef]);

    if (!show) return null;

    const modalStyle = {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1050,
        width: '400px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    };

    return (
        <div ref={modalRef} style={modalStyle} className="profile-modal">
            <div className="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="modal-title m-0">Perfil de Usuario</h5>
                <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                        logout();
                        handleClose();
                    }}
                >
                    <FiLogOut size="25" />
                </button>
            </div>

            <div className="modal-body p-3">
                {user ? (
                    <ListGroup variant="flush">
                        <ListGroup.Item className="border-0 px-0 py-2">
                            <strong>Nombre:</strong> {user.name}
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 px-0 py-2">
                            <strong>Email:</strong> {user.email}
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 px-0 py-2">
                            <strong>Rol:</strong>
                            <Badge bg={user.role === 'Admin' ? 'primary' : 'secondary'} className="ms-2">
                                {user.role}
                            </Badge>
                        </ListGroup.Item>
                    </ListGroup>
                ) : (
                    <p>No hay información de usuario</p>
                )}
            </div>
        </div>
    );
};

export default PerfilModal;