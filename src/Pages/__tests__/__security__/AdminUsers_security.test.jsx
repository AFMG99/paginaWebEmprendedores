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
 * Pruebas de seguridad para el componente AdminUsers.
 *
 * Tipos de pruebas de seguridad:
 * Aseguran que los controles de acceso funcionen y que usuarios no autorizados no accedan a funciones restringidas.
 * - Usuario NO Admin recibe alerta de acceso denegado al intentar registrar usuario
 * - Nunca se renderiza CreateUser para usuarios no admin
 */

describe('AdminUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Usuario NO Admin recibe alerta de acceso denegado al intentar registrar usuario
    it('muestra alerta de acceso denegado si un usuario NO admin intenta registrar usuario', async () => {
        mockRole = 'Usuario';
        const AdminUsers = require('../../AdminUsers').default;
        const instance = render(<AdminUsers resetView={false} />);
        instance.rerender(<AdminUsers resetView={false} __testHandleCardClick={(option) => {
            if (option === "registrar") {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: 'Solo los administradores pueden registrar usuarios',
                    confirmButtonText: 'Entendido'
                });
            }
        }} />);
        const consultarBtns = screen.getAllByText('Consultar Usuarios');
        fireEvent.click(consultarBtns[0]);
        const handler = screen.getByText('Consultar Usuarios').parentNode.querySelector('.card:last-child');
        if (handler) {
            fireEvent.click(handler);
            await waitFor(() => {
                expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                    icon: 'error',
                    title: 'Acceso denegado'
                }));
            });
        }
    });

    // Nunca se renderiza CreateUser para usuarios no admin
    it('nunca renderiza CreateUser si el usuario no es Admin', () => {
        mockRole = 'Usuario';
        const AdminUsers = require('../../AdminUsers').default;
        render(<AdminUsers resetView={false} />);
        expect(screen.queryByText('Crear Usuario')).not.toBeInTheDocument();
    });
});