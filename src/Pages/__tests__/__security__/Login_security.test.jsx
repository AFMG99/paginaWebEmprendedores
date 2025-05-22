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

import Login from '../../Login';

/**
 * Pruebas para la pantalla Login.
 *
 * Tipos de pruebas incluidas:
 * 
 * - Pruebas de seguridad:
 *   Verifican que el campo de contraseña esté protegido correctamente en la interfaz.
 */

describe('Login', () => {

    // El campo de contraseña tiene type="password"
    it('el campo de contraseña tiene type="password"', () => {
        render(<Login />);
        const passInput = screen.getByPlaceholderText('Contraseña');
        expect(passInput).toHaveAttribute('type', 'password');
    });
});