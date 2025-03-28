import React from 'react';

const SalesTable = (
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
                        <th>Subtotal</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map(sale => (
                            <tr
                                key={sale.id}
                                className={sale.id === selectedSaleId ? 'selected' : ''}
                                // onClick={() => handleRowClick(sale)}
                                onClick={() => setSelectedSaleId(sale.id)}
                            >
                                <td>
                                    {editMode && selectedSaleId === sale.id ? (
                                        <input
                                            type="date"
                                            value={sale.fecha}
                                            onChange={(e) => handleChange("fecha", e.target.value)}
                                        />
                                    ) : sale.fecha}
                                </td>
                                <td onClick={() => !editMode && handleRowClick(sale)}>
                                    {editMode && sale.id === selectedSaleId ?
                                        <input
                                            value={sale.producto}
                                            onChange={(e) => handleChange("producto", e.target.value)}
                                        /> : sale.producto}
                                </td>
                                <td>
                                    {editMode && sale.id === selectedSaleId ?
                                        <input
                                            value={sale.cantidad}
                                            onChange={(e) => handleChange("cantidad", e.target.value)}
                                        /> : sale.cantidad}
                                </td>
                                <td>
                                    {editMode && selectedSaleId === sale.id ? (
                                        <input
                                            type="number"
                                            value={sale.subtotal}
                                            onChange={(e) => handleChange("subtotal", e.target.value)}
                                        />
                                    ) : sale.subtotal}
                                </td>
                                <td>
                                    {editMode && selectedSaleId === sale.id ? (
                                        <input
                                            type="number"
                                            value={sale.total}
                                            onChange={(e) => handleChange("total", e.target.value)}
                                        />
                                    ) : sale.total}
                                </td>
                                <td>
                                    {editMode && sale.id === selectedSaleId ? (
                                        <select
                                            value={sale.metodo_pago}
                                            onChange={(e) => handleChange("metodo_pago", e.target.value)}
                                        >
                                            <option value="Contado">Contado</option>
                                            <option value="Credito">Crédito</option>
                                        </select>
                                    ) : sale.metodo_pago}
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

export default SalesTable;
