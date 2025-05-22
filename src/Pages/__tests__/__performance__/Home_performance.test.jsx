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

import Home from '../../Home';

/**
 * Pruebas para la pantalla Home.
 *
 * Tipos de pruebas incluidas:
 * 
 * - Pruebas de rendimiento:
 *   Evalúan que el componente Home se renderice eficientemente bajo carga.
 */

describe('Home', () => {
    it('renderiza el componente 50 veces rápidamente', () => {
        const t0 = performance.now();
        for (let i = 0; i < 50; i++) {
            render(<Home />);
        }
        const t1 = performance.now();
        expect(t1 - t0).toBeLessThan(2000);
    });
});