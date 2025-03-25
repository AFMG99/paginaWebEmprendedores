import React, { useState, useEffect } from 'react';
import { FaBox, FaCog, FaBuilding } from 'react-icons/fa';
import SupplyPurchase from './SupplyPurchase';
import AdministrativeExpenses from './AdministrativeExpenses';
import OperationalCosts from './OperationalCosts';

const RegisterPurchase = ({ resetView }) => {
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        setSelectedType(null);
    }, [resetView]);

    return (
        <div className="register-purchase-container">
            {selectedType === null && (
                <div className="purchase-tabs">
                    <button onClick={() => setSelectedType('insumos')}>
                        <FaBox className="icon" /> Compra de Insumos
                    </button>
                    <button onClick={() => setSelectedType('costos')}>
                        <FaCog className="icon" /> Costos Operativos
                    </button>
                    <button onClick={() => setSelectedType('gastos')}>
                        <FaBuilding className="icon" /> Gastos Administrativos
                    </button>
                </div>
            )}

            <div className="purchase-content full-width">
                {selectedType === 'insumos' && <SupplyPurchase />}
                {selectedType === 'costos' && <OperationalCosts />}
                {selectedType === 'gastos' && <AdministrativeExpenses />}
            </div>
        </div>
    )
}

export default RegisterPurchase
