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
 * - Pruebas unitarias:
 *   Verifican el renderizado de los campos y botones principales, la validación de campos requeridos,
 *   el llamado correcto a la función de login y la visualización de mensajes de error.
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

    // Verifica que los campos y botones principales se renderizan correctamente
    it('renderiza campos de email, password y botones', () => {
        render(<Login />);
        expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Registrar')).toBeInTheDocument();
        expect(screen.getByText('¿Olvidaste tu Contraseña?')).toBeInTheDocument();
    });

    // Muestra alerta si falta email o password al intentar iniciar sesión
    it('muestra alerta si falta email o password', async () => {
        render(<Login />);
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                icon: 'warning',
                title: 'Campos incompletos',
            }));
        });
    });

    // Llama a login con los datos ingresados
    it('llama a login con email y password', async () => {
        mockLogin.mockResolvedValue(false);
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'test@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123456' } });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@mail.com', '123456');
        });
    });

    // Prueba unitaria: Muestra mensaje de error si login falla
    it('muestra mensaje de error si login falla', async () => {
        mockLogin.mockResolvedValue(false);
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'test@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'badpass' } });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(screen.getByText('Correo o contraseña incorrectos')).toBeInTheDocument();
        });
    });
});