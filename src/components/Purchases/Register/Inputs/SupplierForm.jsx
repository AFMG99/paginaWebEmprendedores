import React from 'react';

const SupplierForm = ({
    formData,
    handleChange,
    providers,
    products,
    loadingProducts,
    loadingProviders
}) => {

    return (
        <div className='row'>
            <div className="col-6">
                <div className="d-flex justify-content-between">
                    <div className="col-6 filter-item">
                        <label>Fecha</label>
                        <input
                            type="date"
                            name="created_at"
                            value={formData.created_at}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='col-12 filter-item'>
                    <label>Proveedor</label>
                    <select
                        className='desplegable'
                        name="provider"
                        value={formData.provider}
                        onChange={handleChange}
                        disabled={loadingProviders}
                    >
                        <option value="">
                            {loadingProviders
                                ? "Cargando proveedores..."
                                : providers.length === 0
                                    ? "No hay proveedores disponibles"
                                    : "..."}
                        </option>
                        {Array.isArray(providers) && providers.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.provider_name || `Proveedor ${provider.id}`}
                            </option>
                        ))}
                    </select>
                    {!loadingProviders && providers.length === 0 && (
                        <p className="text-danger small">No se encontraron proveedores</p>
                    )}
                </div>
                <div className='col-12 filter-item'>
                    <label>Producto</label>
                    <select
                        className='desplegable'
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        disabled={!formData.provider || loadingProducts}
                    >
                        <option value="">
                            {loadingProducts
                                ? "Cargando productos..."
                                : products.length === 0
                                    ? "No hay productos disponibles"
                                    : "..."}
                        </option>
                        {Array.isArray(products) && products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.product || `Producto ${product.id}`}
                            </option>
                        ))}
                    </select>
                    {!loadingProducts && products.length === 0 && (
                        <p className="text-danger small">No se encontraron productos</p>
                    )}
                </div>
            </div>
            <div className='col-6'>
                <div style={{ marginTop: '3.5rem' }}></div>
                <div className='d-flex justify-content-between'>
                    <div className='col-6 filter-item'>
                        <label>Pago de:</label>
                        <select
                            className='desplegable'
                            name="paymentType"
                            value={formData.paymentType}
                            onChange={handleChange}
                            disabled={!formData.product || !formData.provider}
                        >
                            <option value="">...</option>
                            <option value="Contado">Contado</option>
                            <option value="Credito">Credito</option>
                        </select>
                    </div>
                    <div className='col-2 filter-item'>
                        <label>Plazo</label>
                        <input
                            type="number"
                            name="term"
                            value={formData.term}
                            onChange={handleChange}
                            min="0"
                            disabled={formData.paymentType === 'Contado' || !formData.paymentType}
                        />
                    </div>
                    <div className='col-3 filter-item'>
                        <label>Vence</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            disabled={!formData.term || formData.term < 0}
                        />
                    </div>
                </div>
                <div className="col-12 filter-item">
                    <label>Medio de pago</label>
                    <select
                        className='desplegable'
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        disabled={!formData.paymentType}
                    >
                        <option value="">...</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SupplierForm;