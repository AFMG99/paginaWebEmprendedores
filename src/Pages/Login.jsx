import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../assets/css/styles.css';
import imagen from '../../src/assets/img/Logo_web.png';
import Swal from 'sweetalert2';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        navigate('/Principal')
        // if (username === 'usuario' && password === 'contraseña') {
        //     setErrorMessage('');
        //     Swal.fire({
        //         icon: 'success',
        //         title: 'Inicio de sesión exitoso',
        //         text: '¡Bienvenido!',
        //         confirmButtonText: 'Aceptar'
        //     }).then(() => navigate('/Principal'));
        // } else {
        //     setErrorMessage('Usuario o contraseña incorrectos');
        // }
    };

    const handleNewPassword = (e) => {
        e.preventDefault();
        if (!username) {
            Swal.fire({
                icon: 'info',
                title: 'Usuario requerido',
                text: 'Por favor, digita el usuario.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
        navigate('/Cambio-de-contrasena', { state: { username } });
    }

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/Registro')
    }

    return (
        <div className="container-fluid login-page">
            <div className="row vh-100">
                <div className="col-md-6 d-md-flex login-image">
                    <img src={imagen} alt="Oficina" />
                </div>

                <div className="col-md-6 d-flex align-items-center justify-content-center div">
                    <div className="login-box">
                        <h2 className="text-center text-titulo">Pagina de proyecto de aula</h2>

                        <form className='form' onSubmit={handleLogin}>
                            <div className="mb-3 user">

                                <div className="input-with-icon">
                                    <i className="fa fa-user"></i>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-3 pass">
                                <div className="input-with-icon">
                                    <i className="fa fa-lock"></i>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            <div className='row'>
                                <div className='col-6'>
                                    <button type="submit" className="btn btn-success w-100 mb-3">Login</button>
                                </div>
                                <div className='col-6'>
                                    <button type="submit" className="btn btn-success w-100 mb-3" onClick={handleRegister}>
                                        Registrar
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center">
                                <a onClick={handleNewPassword} className='text linkNewPassword'>¿Olvidaste tu Contraseña?</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
