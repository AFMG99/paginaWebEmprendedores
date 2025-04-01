import React from 'react';

const ProductsTable = ({
    formData,
    products,
    filteredProducts,
    editMode,
    selectedProduct,
    handleChange,
    setSelectedProduct,
    tempQuantity,
    setTempQuantity,
    calculatedCurrentStock
}) => {

    const renderTableContent = () => {
        if (formData.cod.trim() && filteredProducts.length === 0) {
            return (
                <tr className="table-warning">
                    <td>
                        <input
                            type="number"
                            value={tempQuantity}
                            min="1"
                            onChange={(e) => setTempQuantity(Math.max(1, Number(e.target.value)))}
                            className="form-control form-control-sm"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            min="0"
                            step="0.01"
                            onChange={handleChange}
                            className="form-control form-control-sm"
                        />
                    </td>
                    <td>
                        {calculatedCurrentStock}
                    </td>
                    <td>
                        <input
                            type="number"
                            name="min_stock"
                            value={formData.min_stock}
                            min="0"
                            onChange={handleChange}
                            className="form-control form-control-sm"
                        />
                    </td>
                    <td>${(tempQuantity * formData.price).toFixed(2)}</td>
                    <td>${(calculatedCurrentStock * formData.price).toFixed(2)}</td>
                </tr>
            );
        }

        if (!formData.cod.trim()) {
            return (
                <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                        Ingrese un código para buscar o registrar un producto
                    </td>
                </tr>
            );
        }

        return filteredProducts.map((product) => {
            const productCalculatedStock = product.current_stock + tempQuantity;
            return (
                <tr
                    key={product.cod}
                    className={`${selectedProduct?.cod === product.cod ? 'table-primary' : ''} ${editMode && selectedProduct?.cod === product.cod ? 'editing-row' : ''
                        }`}
                    onClick={() => setSelectedProduct(product)}
                >
                    <td>
                        {editMode && selectedProduct?.cod === product.cod ? (
                            <input
                                type="number"
                                value={tempQuantity}
                                min="1"
                                onChange={(e) => setTempQuantity(Math.max(1, Number(e.target.value)))}
                                className="form-control form-control-sm"
                            />
                        ) : (
                            tempQuantity
                        )}
                    </td>
                    <td>
                        {editMode && selectedProduct?.cod === product.cod ? (
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                min="0"
                                step="0.01"
                                onChange={handleChange}
                                className="form-control form-control-sm"
                            />
                        ) : (
                            `$${product.price.toFixed(2)}`
                        )}
                    </td>
                    <td>
                        {editMode && selectedProduct?.cod === product.cod ? (
                            <input
                                type="number"
                                name="current_stock"
                                value={formData.current_stock}
                                min="0"
                                onChange={handleChange}
                                className="form-control form-control-sm"
                            />
                        ) : (
                            product.current_stock + tempQuantity
                        )}
                    </td>
                    <td>
                        {editMode && selectedProduct?.cod === product.cod ? (
                            <input
                                type="number"
                                name="min_stock"
                                value={formData.min_stock}
                                min="0"
                                onChange={handleChange}
                                className="form-control form-control-sm"
                            />
                        ) : (
                            product.min_stock
                        )}
                    </td>
                    <td>
                        {editMode && selectedProduct?.cod === product.cod
                            ? `$${(tempQuantity * formData.price).toFixed(2)}`
                            : `$${(tempQuantity * product.price).toFixed(2)}`}
                    </td>
                    <td>
                        {editMode && selectedProduct?.cod === product.cod
                            ? `$${(calculatedCurrentStock * formData.price).toFixed(2)}`
                            : `$${(productCalculatedStock * product.price).toFixed(2)}`}
                    </td>
                </tr>
            );
        });
    };
    return (
        <div className='table-container' style={{ height: '300px' }}>
            <table border="1" className='sales-table'>
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Stock Actual</th>
                        <th>Stock mínimo</th>
                        <th>Subtotal</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableContent()}
                </tbody>
            </table>
        </div>
    )
}

export default ProductsTable
