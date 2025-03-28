import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaReceipt } from 'react-icons/fa';

const RegisterSale = ({ resetView }) => {
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
            setSelectedType(null);
        }, [resetView]);

    return (
        <div className="register-purchase-container">
            {selectedType === null && (
                <div className="purchase-tabs">
                    <button onClick={() => setSelectedType('productos')}>
                        <FaBoxOpen className="icon" /> Registrar Productos
                    </button>
                    <button onClick={() => setSelectedType('ventas')}>
                        <FaReceipt className="icon" /> Registrar Ventas
                    </button>
                </div>
            )}

            <div className="purchase-content full-width">
                {selectedType === 'productos'}
                {selectedType === 'ventas' }
            </div>
        </div>
    );
};

export default RegisterSale;
