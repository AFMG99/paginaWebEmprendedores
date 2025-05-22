import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus } from "react-icons/fa";
import UserList from '../components/AdminUsers/UserList';
import CreateUser from '../components/AdminUsers/CreateUser';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const AdminUsers = ({ resetView, __testHandleCardClick }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        setSelectedOption(null);
    }, [resetView]);

    const handleCardClick = (option) => {
        if (option === "registrar" && user?.role !== "Admin") {
            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'Solo los administradores pueden registrar usuarios',
                confirmButtonText: 'Entendido'
            });
            return;
        };
        setSelectedOption(option);
    };

    const cardClickHandler = __testHandleCardClick || handleCardClick;

    return (
        <div className="admin-users-container">
            {selectedOption === null ? (
                <div className="cards-container">
                    <div className="card" onClick={() => cardClickHandler("consultar")}>
                        <FaUsers className="card-icon" />
                        <span>Consultar Usuarios</span>
                    </div>
                    {user?.role === "Admin" && (
                        <div className="card" onClick={() => cardClickHandler("registrar")}>
                            <FaUserPlus className="card-icon" />
                            <span>Registrar Usuario</span>
                        </div>
                    )}
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
