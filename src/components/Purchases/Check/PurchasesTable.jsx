import React from 'react';

const PurchasesTable = ({
    purchases,
    selectedPurchaseId,
    editMode,
    handleChange,
    handleRowClick
}) => {
    return (
        <div className="table-container">
            <table border="1" className="sales-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Fecha</th>
                        <th>Metodo de pago</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.length > 0 ? (
                        purchases.map(purchase => (
                            <tr
                                key={purchase.id}
                                className={`${purchase.id === selectedPurchaseId ? 'selected' : ''} ${editMode ? 'edit-mode' : ''}`}
                                onClick={() => !editMode && handleRowClick(purchase)}
                            >
                                <td>
                                    {editMode && purchase.id === selectedPurchaseId ? (
                                        <input
                                            value={purchase.product_name}
                                            onChange={(e) => handleChange("product_name", e.target.value)}
                                        />
                                    ) : purchase.product_name}
                                </td>
                                <td>
                                    {editMode && purchase.id === selectedPurchaseId ? (
                                        <input
                                            value={purchase.supplier}
                                            onChange={(e) => handleChange("supplier", e.target.value)}
                                        />
                                    ) : purchase.supplier}
                                </td>
                                <td>
                                    {editMode && purchase.id === selectedPurchaseId ? (
                                        <input
                                            type="number"
                                            min="1"
                                            value={purchase.quantity}
                                            onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                                        />
                                    ) : purchase.quantity}
                                </td>
                                <td>
                                    {editMode && purchase.id === selectedPurchaseId ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={purchase.unit_price}
                                            onChange={(e) => handleChange("unit_price", parseFloat(e.target.value) || 0)}
                                        />
                                    ) : `$${purchase.unit_price.toFixed(2)}`}
                                </td>
                                <td>
                                    {editMode && purchase.id === selectedPurchaseId ? (
                                        <input
                                            type="date"
                                            value={purchase.date}
                                            onChange={(e) => handleChange("date", e.target.value)}
                                        />
                                    ) : new Date(purchase.date).toLocaleDateString('es-ES')}
                                </td>
                                <td>
                                    {editMode && purchase.id === selectedPurchaseId ? (
                                        <select
                                            value={purchase.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Transferencia">Transferencia</option>
                                        </select>
                                    ) : purchase.status}
                                </td>
                                <td>${(purchase.quantity * purchase.unit_price).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="no-sales" colSpan="7">No se encontraron compras</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PurchasesTable;