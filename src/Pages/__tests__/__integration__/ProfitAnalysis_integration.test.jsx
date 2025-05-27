import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfitAnalysis from '../../ProfitAnalysis';
import * as Services from '../../../service/Services';

jest.mock('../../../db/supabaseClient', () => ({
    __esModule: true,
    default: {},
}));
jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { role: mockRole } })
}));

jest.mock('react-chartjs-2', () => ({
    Bar: () => <canvas data-testid="bar-chart" />,
    Line: () => <canvas data-testid="line-chart" />,
}));

jest.mock('../../../service/Services');

describe('ProfitAnalysis', () => {
    beforeEach(() => {
        Services.ProductService.getAll.mockResolvedValue([
            { id: 1, product: 'Producto A' },
        ]);
        Services.SalesService.getAll.mockResolvedValue([
            { id: 1, product_id: 1, price: 100, quantity: 2, created_at: '2025-05-01T00:00:00Z', payment_method: 'efectivo' }
        ]);
        Services.PurchaseService.getAll.mockResolvedValue([
            { id: 1, date: '2024-05-01', items: [{ input_id: 1, price: 30, quantity: 2 }] }
        ]);
        Services.InputService.getAll.mockResolvedValue([
            { id: 1, product_id: 1, price: 30 }
        ]);
    });

    it('renderiza resumen y graficos despues de cargar datos', async () => {
        render(<ProfitAnalysis />);
        expect(screen.getByText(/Cargando datos/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText(/Ventas Totales/i)).toBeInTheDocument());
        expect(screen.getAllByText('$200').length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Producto A/).length).toBeGreaterThan(0);
    });
});