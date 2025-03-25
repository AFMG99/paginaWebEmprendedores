import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaDollarSign } from 'react-icons/fa';
import RegisterPurchase from '../components/Purchases/RegisterPurchase';

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
                    {selectedOption === "consultar" && <RegisterPurchase />}
                    {selectedOption === "registrar" && <RegisterPurchase resetView={resetView}/>}
                </>
            )}
        </div>
    );
};

export default Purchases;
