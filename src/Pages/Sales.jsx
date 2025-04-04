import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCashRegister } from 'react-icons/fa';
import CheckSale from '../components/Sales/CheckSale';
import SalesManager from '../components/Sales/SalesManger';


const Sales = ({ resetView }) => {
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
                        <FaClipboardList className="card-icon" />
                        <span>Consultar Ventas</span>
                    </div>
                    <div className="card" onClick={() => handleCardClick("registrar")}>
                        <FaCashRegister className="card-icon" />
                        <span>Registrar Ventas</span>
                    </div>
                </div>
            ) : (
                <>
                    {selectedOption === "consultar" && <CheckSale resetView={resetView}/>}
                    {selectedOption === "registrar" && <SalesManager resetView={resetView}/>}
                </>
            )}
        </div>
    )
}

export default Sales
