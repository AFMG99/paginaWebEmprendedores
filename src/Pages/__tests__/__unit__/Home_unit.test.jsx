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
 * - Pruebas unitarias:
 *   Verifican el renderizado de los elementos principales y la correcta inicialización de estados.
*/

describe('Home', () => {
    it('renderiza el carrusel de inicio por defecto', () => {
        render(<Home />);
        expect(screen.getByText('HomeCarrouselComponent')).toBeInTheDocument();
    });
});