import React, { useState } from "react";

const CreateUser = () => {
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Usuario" });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Usuario ${newUser.name} creado con éxito`);
    };

    return (
        <div>
            <h2>Crear Usuario</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nombre" onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                <input type="email" placeholder="Correo" onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <input type="password" placeholder="Contraseña" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                <button type="submit">Crear</button>
            </form>
        </div>
    );
};

export default CreateUser;
