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
 * - Pruebas de rendimiento:
 *   Evalúan que el componente Login se renderice eficientemente bajo carga.
*/

describe('Login', () => {
    // Renderiza el componente 100 veces rápidamente
    it('renderiza el componente 100 veces rápidamente', () => {
        const t0 = performance.now();
        for (let i = 0; i < 100; i++) {
            render(<Login />);
        }
        const t1 = performance.now();
        expect(t1 - t0).toBeLessThan(2000);
    });
});