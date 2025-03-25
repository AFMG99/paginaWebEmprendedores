import React, { useState } from "react";
import { FaEdit, FaSave, FaTrash, FaSearch } from "react-icons/fa";

const UserList = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Admin", active: true },
        { id: 2, name: "María López", email: "maria@example.com", role: "Usuario", active: false },
        { id: 3, name: "Carlos Gómez", email: "carlos@example.com", role: "Usuario", active: true },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (field, value) => {
        setUsers(users.map(user => 
            user.id === selectedUserId ? { ...user, [field]: value } : user
        ));
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setEditMode(false);
        setSelectedUserId(null);
    };

    const handleDelete = () => {
        if (selectedUserId) {
            const updatedUsers = users.filter(user => user.id !== selectedUserId);
            setUsers(updatedUsers);
            setSelectedUserId(null);
            setEditMode(false);
        }
    };

    return (
        <div className="user-container">
            <h2>Lista de Usuarios</h2>

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
                        <th>Seleccionar</th>
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
                                    <input 
                                        type="radio" 
                                        name="selectedUser" 
                                        checked={selectedUserId === user.id}
                                        onChange={() => !editMode && setSelectedUserId(user.id)}
                                        disabled={editMode}
                                    />
                                </td>
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
                    disabled={!selectedUserId || editMode}
                    className="edit-button"
                >
                    <FaEdit />
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={!editMode}
                    className="save-button"
                >
                    <FaSave />
                </button>
                <button 
                    onClick={handleDelete} 
                    disabled={!selectedUserId || editMode}
                    className="delete-button"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default UserList;
