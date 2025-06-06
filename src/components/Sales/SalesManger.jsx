import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaReceipt } from 'react-icons/fa';
import RegisterProducts from './Register/RegisterProducts';
import RegisterSale from './Register/RegisterSale';

const SalesManager = ({ resetView }) => {
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
                {selectedType === 'productos' && <RegisterProducts />}
                {selectedType === 'ventas' && <RegisterSale />}
            </div>
        </div>
    );
};

export default SalesManager;
