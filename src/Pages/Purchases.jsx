import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaDollarSign } from 'react-icons/fa';
import ManagePurchases from '../components/Purchases/ManagePurchases';
import ConsultaCompras from '../components/Purchases/Check/ConsultaCompras';

const Purchases = ({ resetView }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setSelectedOption(null);
    }, [resetView]);    

    const handleCardClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="admin-users-container">
            {selectedOption === null ? (
                <div className="cards-container">
                    <div className="card" onClick={() => handleCardClick("consultar")}>
                        <FaShoppingBag className="card-icon" />
                        <span>Consultar Compras</span>
                    </div>
                    <div className="card" onClick={() => handleCardClick("registrar")}>
                        <FaDollarSign className="card-icon" />
                        <span>Registrar Compras</span>
                    </div>
                </div>
            ) : (
                <>
                    {selectedOption === "consultar" && <ConsultaCompras resetView={resetView}/>}
                    {selectedOption === "registrar" && <ManagePurchases resetView={resetView}/>}
                </>
            )}
        </div>
    );
};

export default Purchases;
