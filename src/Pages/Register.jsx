import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userData, setUserData] = useState({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        username: '',
        email: '',
        telefono: '',
        direccion: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const [validation, setValidation] = useState({
        primer_nombre: null,
        primer_apellido: null,
        username: null,
        email: null,
        telefono: null,
        direccion: null,
        password: null,
        confirmPassword: null,
        termsAccepted: null
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            [name]: type === 'checkbox' ? checked : value
        });
        validateField(name, value, checked);
    };

    const validateField = (name, value, checked) => {
        let isValid = true;

        switch (name) {
            case 'primer_nombre':
            case 'primer_apellido':
                isValid = value.trim() !== '';
                break;
            case 'username':
                isValid = value.length >= 4;
                break;
            case 'email':
                isValid = /^\S+@\S+\.\S+$/.test(value);
                break;
            case 'telefono':
                isValid = /^[0-9]{10}$/.test(value);
                break;
            case 'direccion':
                isValid = value.trim() !== '';
                break;
            case 'password':
                isValid = value.length >= 8;
                break;
            case 'confirmPassword':
                isValid = value === userData.password;
                break;
            case 'termsAccepted':
                isValid = checked;
                break;
            default:
                break;
        }

        setValidation((prev) => ({
            ...prev,
            [name]: isValid
        }));
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const isValidForm = Object.values(validation).every((v) => v === true);
        if (!isValidForm) {
            Swal.fire('Error', 'Revisa los campos antes de continuar.', 'error');
            return;
        }

        Swal.fire('Éxito', 'Registro exitoso', 'success').then(() => {
            navigate('/');
        });
    };

    return (
        <div className="registro-page d-flex justify-content-center">
            <div className='registro-container col-10'>
                <h2 className="text-center">Registro de Usuario</h2>
                <form onSubmit={handleSubmit} className="formulario-registro container-fluid w-100">

                    <div className='row mx-0'>
                        <div className="form-floating col-md-6 col-12 mb-3">
                            <input
                                type="text"
                                name="primer_nombre"
                                id="floatingInput"
                                placeholder="Primer Nombre"
                                className={`form-control ${validation.primer_nombre === false ? 'is-invalid' : validation.primer_nombre === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingInput">Primer Nombre</label>
                            <div className="invalid-feedback">Campo obligatorio</div>
                        </div>
                        <div className="form-floating col-md-6 col-12 mb-3">
                            <input
                                type="text"
                                name="segundo_nombre"
                                id="floatingInput"
                                placeholder='Segundo Nombre'
                                className="form-control"
                                onChange={handleChange}
                            />
                            <label htmlFor="floatingInput">Segundo Nombre</label>
                        </div>
                    </div>

                    <div className="row mx-0">
                        <div className="form-floating col-md-6 col-12 mb-3">
                            <input
                                type="text"
                                name="primer_apellido"
                                id="floatingInput"
                                placeholder="Primer Apellido"
                                className={`form-control ${validation.primer_apellido === false ? 'is-invalid' : validation.primer_apellido === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="floatingInput">Primer Apellido</label>
                            <div className="invalid-feedback">Campo obligatorio</div>
                        </div>
                        <div className="form-floating col-md-6 col-12 mb-3">
                            <input
                                type="text"
                                name="segundo_apellido"
                                id='floatingInput'
                                placeholder='Segundo Apellido'
                                className="form-control"
                                onChange={handleChange}
                            />
                            <label htmlFor="floatingInput">Segundo Apellido</label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="input-with-icon">
                            <i className="fa fa-user"></i>
                            <input
                                type="text"
                                name="username"
                                placeholder="Nombre de Usuario"
                                className={`form-control ${validation.username === false ? 'is-invalid' : validation.username === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Debe tener al menos 4 caracteres.</div>
                    </div>

                    <div className="mb-3">
                        <div className='input-with-icon'>
                            <i className="fa fa-envelope"></i>
                            <input
                                type="email"
                                name="email"
                                placeholder='Correo Electronico'
                                className={`form-control ${validation.email === false ? 'is-invalid' : validation.email === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Correo no válido.</div>
                    </div>

                    <div className="mb-3">
                        <div className='input-with-icon'>
                            <i className="fa fa-phone"></i>
                            <input
                                type="tel"
                                name="telefono"
                                placeholder='Telefono'
                                className={`form-control ${validation.telefono === false ? 'is-invalid' : validation.telefono === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Debe tener 10 dígitos.</div>
                    </div>

                    <div className="mb-3">
                        <div className='input-with-icon'>
                            <i className="fa fa-map-marker"></i>
                            <input
                                type="text"
                                name="direccion"
                                placeholder='Dirección'
                                className={`form-control ${validation.direccion === false ? 'is-invalid' : validation.direccion === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Campo obligatorio</div>
                    </div>

                    <div className="mb-3">
                        <div className="input-with-icon">
                            <i className="fa fa-lock"></i>
                            <input
                                type="password"
                                name="password"
                                placeholder='Contraseña'
                                className={`form-control ${validation.password === false ? 'is-invalid' : validation.password === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
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
                                placeholder='Confirmar Contraseña'
                                className={`form-control ${validation.confirmPassword === false ? 'is-invalid' : validation.confirmPassword === true ? 'is-valid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="invalid-feedback">Las contraseñas no coinciden.</div>
                    </div>

                    <div className="col-12">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                className={
                                    `form-check-input ${validation.termsAccepted === false ? 'is-invalid' : validation.termsAccepted === true ? 'is-valid' : ''}`}
                                onChange={handleChange} required
                            />
                            <label className="form-check-label">Aceptar términos y condiciones</label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                </form>
            </div>
        </div>
    )
}

export default Register