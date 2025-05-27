import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfitTable from '../../../components/ProfitAnalysis/ProfitTable';

test('escapa HTML en nombres de productos', () => {
  const products = [{ id: 1, product: '<img src=x onerror=alert(1) />' }];
  const filteredSales = [{ product_id: 1, price: 100, quantity: 1 }];
  const productCosts = { 1: { totalCost: 0 } };

  render(<ProfitTable products={products} filteredSales={filteredSales} productCosts={productCosts} />);
  expect(screen.getByText('<img src=x onerror=alert(1) />')).toBeInTheDocument();
});