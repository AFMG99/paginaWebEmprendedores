import React from 'react';

const ReportTable = ({ data, columns, reportType, previewMode }) => {
    // Mostrar los datos de rentabilidad.
    if (reportType === 'rentabilidad') {
        return (
            <div className="table-container">
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Ventas Totales</th>
                            <th>Costos Totales</th>
                            <th>Utilidad Bruta</th>
                            <th>Margen de Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {previewMode && data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productName}</td>
                                <td>${item.totalSales}</td>
                                <td>${item.totalCosts.toLocaleString()}</td>
                                <td>${item.grossProfit.toLocaleString()}</td>
                                <td>{item.profitMargin}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Mostrar los datos de Ventas y/o compras.
    return (
        <div className="table-container">
            <table className="sales-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {previewMode && data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.format ? col.format(item[col.accessor]) : item[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;