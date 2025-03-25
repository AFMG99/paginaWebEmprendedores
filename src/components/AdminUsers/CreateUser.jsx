import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";
import { registerUser } from "../../service/Services.js";

const CreateUser = () => {
    const initialState = { name: "", email: "", password: "", confirmPassword: "", role: "Usuario" };
    const initialValidation = { name: null, email: null, password: null, confirmPassword: null };

    const [newUser, setNewUser] = useState(initialState);
    const [validation, setValidation] = useState(initialValidation);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let isValid = true;

        switch (name) {
            case "name":
                isValid = value.trim() !== "";
                break;
            case "email":
                isValid = /^\S+@\S+\.\S+$/.test(value);
                break;
            case "password":
                isValid = value.length >= 8;
                break;
            case "confirmPassword":
                isValid = value === newUser.password && value.length >= 8;
                break;
            default:
                break;
        }

        setValidation((prev) => ({ ...prev, [name]: isValid }));
    };

    const isValidForm = Object.values(validation).every((v) => v === true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidForm) {
            Swal.fire("Error", "Revisa los campos antes de continuar.", "error");
            return;
        }

        try {
            setLoading(true);
            await registerUser(newUser.name, newUser.email, newUser.password, newUser.role);
            Swal.fire("Éxito", `Usuario ${newUser.name} creado con éxito`, "success").then(() => {
                setNewUser(initialState);
                setValidation(initialValidation);
            });
        } catch (error) {
            Swal.fire("Error", error.response.data?.message || "Error al registrar usuario", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column">
            <div className="container mt-4 flex-grow-1">
                <h2 className="text-center text-titulo">Crear Usuario</h2>
                <form onSubmit={handleSubmit} className="formulario-registro container-fluid w-50">
                    <div className="mb-3">
                        <div className="input-with-icon">
                            <i className="fa fa-user"></i>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre de Usuario"
                                className={`form-control ${validation.name === false ? "is-invalid" : validation.name === true ? "is-valid" : ""}`}
                                onChange={handleChange}
                                value={newUser.name}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Campo obligatorio.</div>
                    </div>

                    <div className="mb-3">
                        <div className="input-with-icon">
                            <i className="fa fa-envelope"></i>
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                className={`form-control ${validation.email === false ? "is-invalid" : validation.email === true ? "is-valid" : ""}`}
                                onChange={handleChange}
                                value={newUser.email}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Correo no válido.</div>
                    </div>

                    <div className="mb-3">
                        <div className="input-with-icon">
                            <i className="fa fa-lock"></i>
                            <input
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                className={`form-control ${validation.password === false ? "is-invalid" : validation.password === true ? "is-valid" : ""}`}
                                onChange={handleChange}
                                value={newUser.password}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Mínimo 8 caracteres.</div>
                    </div>

                    <div className="mb-3">
                        <div className="input-with-icon">
                            <i className="fa fa-key"></i>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirmar Contraseña"
                                className={`form-control ${validation.confirmPassword === false ? "is-invalid" : validation.confirmPassword === true ? "is-valid" : ""}`}
                                onChange={handleChange}
                                value={newUser.confirmPassword}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Las contraseñas no coinciden.</div>
                    </div>
                </form>
            </div>

            <div className="footer bg-white text-center p-3" style={{ position: "sticky", bottom: "0", width: "100%", marginTop: '160px' }}>
                <button
                    className="save-button"
                    disabled={!isValidForm}
                    onClick={handleSubmit}
                >
                    <FaSave />
                </button>
            </div>
        </div>
    );
};

export default CreateUser;
