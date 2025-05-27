import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfitAnalysis from '../../ProfitAnalysis';
import * as Services from '../../../service/Services';

jest.mock('../../../db/supabaseClient', () => ({
    __esModule: true,
    default: {},
}));

let mockRole = 'Admin';
jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { role: mockRole } })
}));

jest.mock('react-chartjs-2', () => ({
    Bar: () => <canvas data-testid="bar-chart" />,
    Line: () => <canvas data-testid="line-chart" />,
}));

jest.mock('../../../service/Services', () => ({
    ProductService: {
        getAll: jest.fn()
    },
    SalesService: {
        getAll: jest.fn()
    },
    PurchaseService: {
        getAll: jest.fn()
    },
    InputService: {
        getAll: jest.fn()
    }
}));

test('el usuario puede filtrar por producto', async () => {
    Services.ProductService.getAll.mockResolvedValue([
        { id: 1, product: 'Producto A' },
        { id: 2, product: 'Producto B' }
    ]);
    Services.SalesService.getAll.mockResolvedValue([
        { id: 1, product_id: 1, price: 100, quantity: 2, created_at: '2024-05-01', payment_method: 'efectivo' },
        { id: 2, product_id: 2, price: 50, quantity: 1, created_at: '2024-05-01', payment_method: 'tarjeta' }
    ]);
    Services.PurchaseService.getAll.mockResolvedValue([]);
    Services.InputService.getAll.mockResolvedValue([]);

    render(<ProfitAnalysis />);
    
    await waitFor(() => {
        expect(screen.getByText(/Producto A/)).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    const productFilter = selects[1];
    fireEvent.change(productFilter, { target: { value: '2' } });

    await waitFor(() => {
        expect(screen.getByText(/Producto B/)).toBeInTheDocument();
    });
});