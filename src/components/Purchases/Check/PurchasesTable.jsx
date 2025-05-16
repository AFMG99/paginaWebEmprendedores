import React from 'react';

const PurchasesTable = ({
    purchases = [],
    selectedPurchaseId,
    editMode,
    handleChange,
    handleRowClick
}) => {
    // Función para calcular el total de una compra
    const calculateTotal = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + (item.quantity * item.price), 0);
    };

    const getInputNames = (items) => {
        if (!items || !Array.isArray(items)) return 'Sin insumos';
        const names = items.map(item => item.input_name);
        return names.length > 0 ? names.join(', ') : 'Sin insumos';
    };

    return (
        <div className="table-container">
            <table border="1" className="sales-table">
                <thead>
                    <tr>
                        <th>Insumo</th>
                        <th>Producto</th>
                        <th>Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Fecha</th>
                        <th>Método de pago</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.length > 0 ? (
                        purchases.map(purchase => {
                            const items = Array.isArray(purchase.items) ? purchase.items : [];
                            const inputNames = getInputNames(items);
                            const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
                            const averagePrice = items.length > 0
                                ? items.reduce((sum, item) => sum + item.price, 0) / items.length
                                : 0;

                            return (
                                <tr
                                    key={purchase.id}
                                    className={`${purchase.id === selectedPurchaseId ? 'selected' : ''} ${editMode ? 'edit-mode' : ''}`}
                                    onClick={() => !editMode && handleRowClick(purchase)}
                                >
                                    <td>{inputNames}</td>
                                        {/* {editMode && purchase.id === selectedPurchaseId ? (
                                            <input
                                                value={inputNames}
                                                onChange={(e) => handleChange("input_name", e.target.value)}
                                            />
                                        ) : inputNames}
                                    </td> */}
                                    <td>{purchase.product_name}</td>
                                        {/* {editMode && purchase.id === selectedPurchaseId ? (
                                            <input
                                                value={purchase.product_name}
                                                onChange={(e) => handleChange("product_name", e.target.value)}
                                            />
                                        ) : purchase.product_name}
                                    </td> */}
                                    <td>{purchase.provider_name}</td>
                                        {/* {editMode && purchase.id === selectedPurchaseId ? (
                                            <input
                                                value={purchase.provider_name || ''}
                                                onChange={(e) => handleChange("provider_name", e.target.value)}
                                            />
                                        ) : purchase.provider_name || 'Sin proveedor'}
                                    </td> */}
                                    <td>{totalQuantity}</td>
                                        {/* {editMode && purchase.id === selectedPurchaseId ? (
                                            <input
                                                type="number"
                                                min="1"
                                                value={totalQuantity}
                                                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                                            />
                                        ) : totalQuantity}
                                    </td> */}
                                    <td>${averagePrice.toFixed(2)}</td>
                                        {/* {editMode && purchase.id === selectedPurchaseId ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={averagePrice.toFixed(2)}
                                                onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                                            />
                                        ) : `$${averagePrice.toFixed(2)}`}
                                    </td> */}
                                    <td>{purchase.date ? new Date(purchase.date).toLocaleDateString() : 'Sin fecha'}</td>
                                    <td>
                                        {editMode && purchase.id === selectedPurchaseId ? (
                                            <select
                                                value={purchase.payment_method || 'Efectivo'}
                                                onChange={(e) => handleChange("payment_method", e.target.value)}
                                            >
                                                <option value="Efectivo">Efectivo</option>
                                                <option value="Transferencia">Transferencia</option>
                                            </select>
                                        ) : purchase.payment_method || 'Sin método'}
                                    </td>
                                    <td>${calculateTotal(items).toFixed(2)}</td>
                                </tr>
                            );
                        })
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