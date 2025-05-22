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
 * - Pruebas de aceptación:
 *   Simulan flujos completos de usuario, asegurando que los caminos críticos de autenticación
*/

describe('Login', () => {
    it('flujo completo de login exitoso', async () => {
        mockLogin.mockResolvedValue(true);
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'ok@mail.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'goodpass' } });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                icon: 'success',
            }));
        });
    });
});