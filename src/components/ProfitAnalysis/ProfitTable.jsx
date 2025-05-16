import React from 'react';

const ProfitTable = ({
    products,
    filteredSales,
    productCosts
}) => {
    return (
        <div className="table-section">
            <h2>Detalle por Producto</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Ventas ($)</th>
                        <th>Cantidad</th>
                        <th>Costos ($)</th>
                        <th>Utilidad</th>
                        <th>Margen</th>
                    </tr>
                </thead>
                <tbody>
                    {products.filter(product =>
                        filteredSales.some(sale => sale.product_id === product.id)
                    ).map(product => {
                        const productSales = filteredSales.filter(s => s.product_id === product.id);
                        const totalProductSales = productSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
                        const totalQuantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
                        const unitCost = productCosts[product.id] ?
                            productCosts[product.id].totalCost : 0;
                        const totalCost = unitCost;
                        const profit = totalProductSales - totalCost;
                        const margin = totalProductSales > 0 ? ((profit / totalProductSales) * 100).toFixed(2) : 0;

                        return (
                            <tr key={product.id}>
                                <td>{product.product}</td>
                                <td>${totalProductSales.toLocaleString()}</td>
                                <td>{totalQuantity}</td>
                                <td>${unitCost.toFixed(2)}</td>
                                <td>${profit.toLocaleString()}</td>
                                <td>{margin}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProfitTable;