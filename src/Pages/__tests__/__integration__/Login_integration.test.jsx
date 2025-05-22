import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();
const mockLocation = { state: undefined };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
}));

jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        isAuthenticated: false,
    }),
}));
jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve({})),
}));

import Login from '../../Login';
import Swal from 'sweetalert2';

/**
 * Pruebas para la pantalla Login.
 *
 * Tipos de pruebas incluidas:
 * 
* - Pruebas de integración:
 *   Simulan interacciones completas del usuario, como el flujo de login exitoso, navegación al registro,
 *   y recuperación de contraseña, verificando la integración entre componentes y navegación.
 */

describe('Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLogin.mockReset();
        mockNavigate.mockReset();
        mockLocation.state = undefined;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Login exitoso muestra SweetAlert y navega
    it('login exitoso muestra SweetAlert y navega', async () => {
        mockLogin.mockResolvedValue(true);
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'ok@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'goodpass' } });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
            }));
        });
    });

    // Click en Registrar navega a la pantalla de registro
    it('click en Registrar navega a /Registro', () => {
        render(<Login />);
        fireEvent.click(screen.getByText('Registrar'));
        expect(mockNavigate).toHaveBeenCalledWith('/Registro');
    });

    // Click en ¿Olvidaste tu Contraseña? sin email muestra alerta
    it('click en ¿Olvidaste tu Contraseña? sin email muestra alerta', async () => {
        render(<Login />);
        fireEvent.click(screen.getByText('¿Olvidaste tu Contraseña?'));
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                icon: 'info',
                title: 'Correo requerido',
            }));
        });
    });

    // Click en ¿Olvidaste tu Contraseña? con email navega a recuperación
    it('click en ¿Olvidaste tu Contraseña? con email navega', () => {
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'test@mail.com' } });
        fireEvent.click(screen.getByText('¿Olvidaste tu Contraseña?'));
        expect(mockNavigate).toHaveBeenCalledWith('/Cambio-de-contrasena', { state: { email: 'test@mail.com' } });
    });
});