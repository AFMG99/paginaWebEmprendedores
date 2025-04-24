import React from 'react';

const SupplierForm = ({
    formData,
    handleChange,
    suppliers,
    products
}) => {
    
    return (
        <div className='row'>
            <div className="col-6">
                <div className="d-flex justify-content-between">
                    <div className="col-6 filter-item">
                        <label>Fecha</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='col-12 filter-item'>
                    <label>Proveedor</label>
                    <select
                        className='desplegable'
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                    >
                        <option value="">...</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='col-12 filter-item'>
                    <label>Producto</label>
                    <select
                        className='desplegable'
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        disabled={!formData.supplier}
                    >
                        <option value="">...</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
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
                            disabled={!formData.product || !formData.supplier}
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