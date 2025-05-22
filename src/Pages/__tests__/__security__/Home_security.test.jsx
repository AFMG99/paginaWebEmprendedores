import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

let mockRole = 'Admin';
jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { role: mockRole } })
}));

jest.mock('../../../db/supabaseClient', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('./../../Reports', () => () => <div>ReportsComponent</div>);
jest.mock('../../../components/Carrousel/HomeCarrousel', () => () => <div>HomeCarrouselComponent</div>);

import Home from '../../Home';

/**
 * Pruebas para la pantalla Home.
 *
 * Tipos de pruebas incluidas:
 * 
 * - Pruebas de seguridad:
 *   Verifican que solo los usuarios con rol adecuado puedan ver y acceder a ciertos módulos.
 */

describe('Home', () => {
    it('no muestra Rentabilidad si el usuario no es Admin', () => {
        mockRole = 'User';
        render(<Home />);
        expect(screen.queryByText('Rentabilidad')).toBeNull();
    });
});