import '@testing-library/jest-dom';
import React from 'react';
import ProfitAnalysis from '../../ProfitAnalysis';
import { render } from '@testing-library/react';
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

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

import Swal from 'sweetalert2';


test('renderiza rápido con muchos datos', () => {
  const start = performance.now();
  render(<ProfitAnalysis />);
  const end = performance.now();
  expect(end - start).toBeLessThan(1000);
});