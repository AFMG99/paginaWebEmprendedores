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

jest.mock('./../../AdminUsers', () => () => <div>AdminUsersComponent</div>);
jest.mock('./../../ProfitAnalysis', () => () => <div>ProfitAnalysisComponent</div>);
jest.mock('./../../Reports', () => () => <div>ReportsComponent</div>);
jest.mock('./../../Sales', () => () => <div>SalesComponent</div>);
jest.mock('./../../Purchases', () => () => <div>PurchasesComponent</div>);
jest.mock('../../../components/Carrousel/HomeCarrousel', () => () => <div>HomeCarrouselComponent</div>);

import Home from '../../Home';

/**
 * Pruebas para la pantalla Home.
 *
 * Tipos de pruebas incluidas:
 * 
* - Pruebas de aceptación:
 *   Simulan flujos completos de usuario, como la navegación por los diferentes módulos según el rol.
 */

describe('Home', () => {
    // Flujo completo de navegación por módulos
    it('flujo completo: navega por Usuarios, Ventas, Compras e Informes', () => {
        render(<Home />);
        fireEvent.click(screen.getByText('Usuarios'));
        expect(screen.getByText('AdminUsersComponent')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Ventas'));
        expect(screen.getByText('SalesComponent')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Compras'));
        expect(screen.getByText('PurchasesComponent')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Informes'));
        expect(screen.getByText('ReportsComponent')).toBeInTheDocument();
    });
});