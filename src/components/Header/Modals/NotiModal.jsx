import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const NotiModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Notificaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Aquí verás las notificaciones más recientes.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NotiModal
