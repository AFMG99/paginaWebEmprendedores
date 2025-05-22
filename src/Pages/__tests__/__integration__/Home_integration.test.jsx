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
jest.mock('../../../components/Sidebar/MenuList', () => ({ menuItems, onItemClick, selectedItem }) => (
    <div>
        {menuItems.map(item => (
            <button key={item.name} onClick={() => onItemClick(item)}>
                {item.name}
            </button>
        ))}
    </div>
));

import Home from '../../Home';

/**
 * Pruebas para la pantalla Home.
 *
 * Tipos de pruebas incluidas:
 * 
 * - Pruebas de integración:
 *   Simulan la interacción del usuario con el menú lateral y la navegación entre subcomponentes.
*/

describe('Home', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    // Al hacer clic en "Usuarios" se muestra el componente AdminUsers
    it('muestra AdminUsers al hacer clic en "Usuarios"', () => {
        render(<Home />);
        fireEvent.click(screen.getByText('Usuarios'));
        expect(screen.getByText('AdminUsersComponent')).toBeInTheDocument();
    });

    // Al hacer clic en "Rentabilidad" se muestra ProfitAnalysis (solo Admin)
    it('muestra ProfitAnalysis solo si el usuario es Admin', () => {
        mockRole = 'Admin';
        render(<Home />);
        fireEvent.click(screen.getByText('Rentabilidad'));
        expect(screen.getByText('ProfitAnalysisComponent')).toBeInTheDocument();
    });
});