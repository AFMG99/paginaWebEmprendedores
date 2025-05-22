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
 * Pruebas de integración para el componente AdminUsers.
 *
 * Tipos de pruebas de integración:
 * Verifican la interacción usuario-interfaz (clics y renderizado de subcomponentes).
 * - Al hacer clic en "Consultar Usuarios" se renderiza UserList
 * - Al hacer clic en "Registrar Usuario" se renderiza CreateUser (solo Admin)
 */

describe('AdminUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Al hacer clic en "Consultar Usuarios" se renderiza UserList
    it('renderiza UserList al hacer clic en "Consultar Usuarios"', async () => {
        mockRole = 'Admin';
        const AdminUsers = require('../../AdminUsers').default;
        render(<AdminUsers resetView={false} />);
        const consultarBtn = screen.getByText('Consultar Usuarios');
        fireEvent.click(consultarBtn);
        await waitFor(() => {
            expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
        });
    });

    // Al hacer clic en "Registrar Usuario" se renderiza CreateUser (solo Admin)
    it('renderiza CreateUser al hacer clic en "Registrar Usuario" si es Admin', () => {
        mockRole = 'Admin';
        const AdminUsers = require('../../AdminUsers').default;
        render(<AdminUsers resetView={false} />);
        const registrarBtn = screen.getByText('Registrar Usuario');
        fireEvent.click(registrarBtn);
        expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
    });
});