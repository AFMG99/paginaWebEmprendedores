import React from 'react';
import imagen from '../../assets/img/Logo_web.png'

const SaleModal = ({ sale, onClose }) => {
    if (!sale) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content animate" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h3>Detalle de Venta</h3>
                <div className="modal-body">
                    <img 
                        src={imagen} 
                        alt={sale.producto} 
                        className="modal-img"
                    />
                    <p><strong>Producto:</strong> {sale.producto}</p>
                    <p><strong>Descripción:</strong> {sale.descripcion || "Sin descripción disponible"}</p>
                    <p><strong>Total:</strong> ${sale.total.toLocaleString()}</p>
                    <p><strong>Método de Pago:</strong> {sale.metodo_pago}</p>
                    <p><strong>Fecha:</strong> {sale.fecha}</p>
                </div>
            </div>
        </div>
    );
};

export default SaleModal;
