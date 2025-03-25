import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus } from "react-icons/fa";
import UserList from '../components/AdminUsers/UserList';
import CreateUser from '../components/AdminUsers/CreateUser';

const AdminUsers = ({ resetView }) => {
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
                        <FaUsers className="card-icon" />
                        <span>Consultar Usuarios</span>
                    </div>
                    <div className="card" onClick={() => handleCardClick("registrar")}>
                        <FaUserPlus className="card-icon" />
                        <span>Registrar Usuario</span>
                    </div>
                </div>
            ) : (
                <>
                    {selectedOption === "consultar" && <UserList />}
                    {selectedOption === "registrar" && <CreateUser />}
                </>
            )}
        </div>
    );
};

export default AdminUsers;
