import React, { useState, useEffect } from 'react';
import { FaBox, FaUserTie, FaBuilding } from 'react-icons/fa';
import SupplyPurchase from './Register/SupplyPurchase';
import RegisterCosts from './Register/Costs/RegisterCosts';
import ProviderRegister from './Register/Provisioner/ProviderRegister';
import RegisterInputs from './Register/Inputs/RegisterInputs';

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
                    <button onClick={() => setSelectedType('proveedor')}>
                        <FaUserTie className="icon" /> Registro de Proveedor
                    </button>
                    {/* <button onClick={() => setSelectedType('costos')}>
                        <FaBuilding className="icon" /> Costos y Gastos
                    </button> */}
                </div>
            )}

            <div className="purchase-content full-width">
                {selectedType === 'insumos' && <RegisterInputs />}
                {selectedType === 'proveedor' && <ProviderRegister />}
                {/* {selectedType === 'costos' && <RegisterCosts />} */}
            </div>
        </div>
    )
}

export default RegisterPurchase
