import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock de supabaseClient para evitar errores con import.meta.env
jest.mock('../../../db/supabaseClient', () => ({
    __esModule: true,
    default: {},
}));

let mockRole = 'Admin';

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

import Swal from 'sweetalert2';

jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { role: mockRole } })
}));

/**
 * Pruebas de rendimiento para el componente AdminUsers.
 *
 * Tipos de pruebas de rendimiento:
 * Evalúan el tiempo de renderizado con una gran cantidad de datos mockeados.
 * - Renderiza rápido con muchos usuarios
 */

describe('AdminUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Renderiza rápido con muchos usuarios
    it('renderiza rápido con muchos usuarios (mock)', () => {
        mockRole = 'Admin';
        jest.doMock('../../../components/AdminUsers/UserList', () => () => (
            <div>userlist: {Array(1000).fill('usuario').join(',')}</div>
        ));
        const AdminUsers = require('../../AdminUsers').default;
        const start = performance.now();
        render(<AdminUsers resetView={false} />);
        fireEvent.click(screen.getByText('Consultar Usuarios'));
        const end = performance.now();
        expect(screen.getByText(/userlist/i)).toBeInTheDocument();
        expect(end - start).toBeLessThan(500);
    });
});