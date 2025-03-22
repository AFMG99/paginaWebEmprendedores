import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfigModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Configuración</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Opciones de configuración de la cuenta y preferencias.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfigModal
