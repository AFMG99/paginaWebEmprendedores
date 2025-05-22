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
 * Pruebas de aceptación para el componente AdminUsers.
 *
 * Tipos de pruebas de aceptación:
 * Simulan el flujo completo de un usuario administrador.
 * - Flujo completo de un admin consultando y registrando usuarios
 */

describe('AdminUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Aceptación: Flujo completo de un admin consultando y registrando usuarios
    it('flujo completo: un admin puede consultar y registrar usuarios', async () => {
        mockRole = 'Admin';
        const AdminUsers = require('../../AdminUsers').default;
        const { rerender } = render(<AdminUsers resetView={false} />);
        fireEvent.click(screen.getByText('Consultar Usuarios'));
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
        render(<AdminUsers resetView={true} />);
        expect(screen.getByText('Consultar Usuarios')).toBeInTheDocument();
        expect(screen.getByText('Registrar Usuario')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Registrar Usuario'));
        await waitFor(() => {
            expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
        });
    });
});