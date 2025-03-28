import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const PerfilModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Aquí puedes ver y editar la información de tu perfil.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PerfilModal
