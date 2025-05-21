import React, { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { showAllUser, editUser, deleteUser } from '../../service/Services.js';
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext.jsx";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await showAllUser();
            setUsers(data);
        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const user = users.find(user => user.id === selectedUserId);
            await editUser(selectedUserId, {
                name: user.name,
                email: user.email,
                role: user.role,
                active: user.active
            });
            Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
            setEditMode(false);
            setSelectedUserId(null);
            fetchUsers();
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar el usuario", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUserId) return;

        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará al usuario permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar"
        });
        if (confirm.isConfirmed) {
            setLoading(true);
            try {
                await deleteUser(selectedUserId);
                fetchUsers();
                Swal.fire('Eliminado', 'Usuario eliminado con éxito.', 'success');
                fetchUsers();
            } catch (error) {
                Swal.fire("Error", "No se pudo eliminar el usuario", "error");
            } finally {
                setLoading(false);
                setSelectedUserId(null);
                setEditMode(false);
            }
        }
    };
    
    const handleCancel = () => {
        setEditMode(false);
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (field, value) => {
        setUsers(users.map(user =>
            user.id === selectedUserId ? { ...user, [field]: value } : user
        ));
    };

    return (
        <div className="user-container">
            <h2 className="text-center text-titulo">Lista de Usuarios</h2>

            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table border="1" className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr
                                    key={user.id}
                                    onClick={() => !editMode && setSelectedUserId(user.id)}
                                    className={selectedUserId === user.id ? "selected" : ""}
                                >
                                    <td>
                                        {editMode && selectedUserId === user.id ? (
                                            <input
                                                type="text"
                                                value={user.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedUserId === user.id ? (
                                            <input
                                                type="email"
                                                value={user.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedUserId === user.id ? (
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleChange("role", e.target.value)}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Usuario">Usuario</option>
                                            </select>
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedUserId === user.id ? (
                                            <select
                                                value={user.active ? "Activo" : "Inactivo"}
                                                onChange={(e) => handleChange("active", e.target.value === "Activo")}
                                            >
                                                <option value="Activo">Activo</option>
                                                <option value="Inactivo">Inactivo</option>
                                            </select>
                                        ) : (
                                            user.active ? "Activo" : "Inactivo"
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-users">No se encontraron usuarios</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="footer">
                <button
                    onClick={handleEdit}
                    disabled={!selectedUserId || editMode || (user?.role !== "Admin")}
                    className="edit-button"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={handleSave}
                    disabled={!editMode || (user?.role !== "Admin")}
                    className="save-button"
                >
                    <FaSave />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={!selectedUserId || editMode || (user?.role !== "Admin")}
                    className="delete-button"
                >
                    <FaTrash />
                </button>
                <button
                    onClick={handleCancel}
                    disabled={!editMode || (user?.role !== "Admin")}
                    className="cancel-button"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default UserList;
