import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock de supabaseClient para evitar errores con import.meta.env
jest.mock('../../../db/supabaseClient', () => ({
    __esModule: true,
    default: {},
}));

let mockRole = 'Admin';

jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { role: mockRole } })
}));

/**
 * Pruebas unitarias para el componente AdminUsers.
 *
 * Tipos de pruebas unitarias:
 * - Verifica que un usuario Admin vea las tarjetas de "Consultar Usuarios" y "Registrar Usuario".
 * - Verifica que un usuario NO Admin solo vea la tarjeta de "Consultar Usuarios".
 */

describe('AdminUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Verifica que un usuario Admin vea ambas tarjetas
    it('muestra las tarjetas para consultar y registrar usuarios si el usuario es Admin', () => {
        mockRole = 'Admin';
        const AdminUsers = require('../../AdminUsers').default;
        render(<AdminUsers resetView={false} />);
        expect(screen.getByText('Consultar Usuarios')).toBeInTheDocument();
        expect(screen.getByText('Registrar Usuario')).toBeInTheDocument();
    });

    // Verifica que un usuario NO Admin solo vea la tarjeta de consulta
    it('solo muestra la tarjeta de consultar usuarios si el usuario NO es Admin', () => {
        mockRole = 'User';
        const AdminUsers = require('../../AdminUsers').default;
        render(<AdminUsers resetView={false} />);
        expect(screen.getByText('Consultar Usuarios')).toBeInTheDocument();
        expect(screen.queryByText('Registrar Usuario')).not.toBeInTheDocument();
    });
});