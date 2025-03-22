import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Upd_pass = () => {
    const [correo, setCorreo] = useState('')
    const [nuevaContrasena, setNuevaContrasena] = useState('')
    const [username, setUsername] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [fase, setFase] = useState(1)

    const location = useLocation()
    const navigate = useNavigate()
    const { username: usernameFromLocation } = location.state || {}

    const correoPredeterminado = 'prueba@correo.com'

    const handleVerificarCorreo = (e) => {
        e.preventDefault()
        if (correo === correoPredeterminado) {
            setFase(2)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Correo Incorrecto',
                text: 'El correo ingresado no coincide con el registrado.',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    const contrasena = async (username, nuevaContrasena) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username && nuevaContrasena) {
                    resolve({ message: 'La contraseña se ha cambiado exitosamente.' })
                } else {
                    reject({ response: { data: { message: 'Error al cambiar la contraseña.' } } });
                }
            }, 1000)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await contrasena(usernameFromLocation || username, nuevaContrasena);
            setMensaje(response.message);
            Swal.fire({
                icon: 'success',
                title: 'Contraseña Cambiada',
                text: 'La contraseña se ha cambiado exitosamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => navigate('/'))
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al cambiar la contraseña',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    return (
        <div className='container-fluid recuperar-page'>
            <div className="recuperar-container">
                <h2 className="text-center mb-4 text">Cambiar Contraseña</h2>
                <form className="recuperar-form" onSubmit={handleSubmit}>
                    <div className='form-group my-3'>
                        <div className="input-with-icon">
                            <i className="fa fa-envelope"></i>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Correo electrónico'
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group my-3'>
                        <div className="input-with-icon">
                            <i className="fa fa-user"></i>
                            <input
                                type='text'
                                className='form-control'
                                value={usernameFromLocation || username}
                                onChange={(e) => setUsername(e.target.value)}
                                readOnly={!!usernameFromLocation}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group my-3'>
                        <div className="input-with-icon">
                            <i className="fa fa-lock"></i>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Contraseña'
                                value={nuevaContrasena}
                                onChange={(e) => setNuevaContrasena(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type='submit' className='btn btn-success w-100 mb-3'>Cambiar Contraseña</button>
                </form>

                <p className='text-center'><a onClick={() => navigate('/')} className="volver-link">Volver a Login</a></p>
            </div>
        </div>
    )
}

export default Upd_pass
