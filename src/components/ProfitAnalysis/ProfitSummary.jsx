import React from 'react';

const ProfitSummary = ({
    totalSales,
    totalCosts,
    operationalExpenses,
    netProfit,
    profitMargin
}) => {
    return (
        <div className="summary-section">
            <div className="metric-card">
                <h3>Ventas Totales</h3>
                <p>${totalSales.toLocaleString()}</p>
            </div>
            <div className="metric-card">
                <h3>Costos de Productos</h3>
                <p>${totalCosts.toLocaleString()}</p>
            </div>
            <div className="metric-card">
                <h3>Gastos Operativos</h3>
                <p>${operationalExpenses.toLocaleString()}</p>
            </div>
            <div className="metric-card highlight">
                <h3>Utilidad Neta</h3>
                <p>${netProfit.toLocaleString()}</p>
            </div>
            <div className="metric-card highlight">
                <h3>Margen de Ganancia</h3>
                <p>{profitMargin}%</p>
            </div>
        </div>
    );
};

export default ProfitSummary;