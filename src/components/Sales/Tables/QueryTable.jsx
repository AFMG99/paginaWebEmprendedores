import React from 'react';

const QueryTable = (
    {
        sales,
        selectedSaleId,
        setSelectedSaleId,
        editMode,
        handleChange,
        handleRowClick
    }) => {
    return (
        <div className="table-container">
            <table border="1" className="sales-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map(sale => (
                            <tr
                                key={sale.id}
                                className={`${sale.id === selectedSaleId ? 'selected' : ''} ${editMode ? 'edit-mode' : ''}`}
                                onClick={() => !editMode && setSelectedSaleId(sale.id)}
                            >
                                <td>{new Date(sale.created_at).toLocaleDateString()}</td>
                                <td onClick={() => !editMode && handleRowClick(sale)}>
                                    {editMode && sale.id === selectedSaleId ? (
                                        <input
                                            value={sale.product_name}
                                            onChange={(e) => handleChange("product_name", e.target.value)}
                                        />
                                    ) : sale.product_name}
                                </td>

                                <td>
                                    {editMode && sale.id === selectedSaleId ? (
                                        <input
                                            type="number"
                                            min="1"
                                            value={sale.quantity}
                                            onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                                        />
                                    ) : sale.quantity}
                                </td>

                                <td>
                                    {editMode && selectedSaleId === sale.id ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={sale.price}
                                            onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                                        />
                                    ) : `$${sale.price.toFixed(2)}`}
                                </td>
                                <td> ${(sale.price * sale.quantity).toFixed(2)}</td>
                                <td>
                                    {editMode && sale.id === selectedSaleId ? (
                                        <select
                                            value={sale.payment_method}
                                            onChange={(e) => handleChange("payment_method", e.target.value)}
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia</option>
                                        </select>
                                    ) : sale.payment_method}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="no-sales" colSpan="6">No se encontraron ventas</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default QueryTable;
