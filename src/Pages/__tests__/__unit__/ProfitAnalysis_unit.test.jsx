import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProfitSummary from '../../../components/ProfitAnalysis/ProfitSummary';

describe('ProfitSummary', () => {
  it('Muestra correctamente los valores del resumen', () => {
    render(<ProfitSummary 
      totalSales={1000} 
      totalCosts={400}
      operationalExpenses={100}
      netProfit={500}
      profitMargin={50}
    />);
    expect(screen.getByText(/ventas totales/i)).toBeInTheDocument();
    expect(screen.getByText('$1.000')).toBeInTheDocument();
    expect(screen.getByText('$400')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
})
