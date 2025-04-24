import React from 'react';
import { FaCheck } from "react-icons/fa";

const SaleForm = ({
    formData,
    products,
    onProductChange,
    onInputChange,
    onNumberChange,
    handleAddProduct,
    loading
}) => {
    return (
        <div className="d-flex justify-content-between">
            <div className="col-md-2 filter-item">
                <label>Fecha</label>
                <input
                    type="date"
                    name="created_at"
                    value={formData.created_at}
                    onChange={onInputChange}
                    className='w-100'
                    required
                />
            </div>

            <div className="col-md-5 filter-item">
                <label className="form-label">Producto</label>
                <select
                    className="desplegable"
                    value={formData.product_cod}
                    onChange={(e) => onProductChange(e.target.value)}
                    disabled={loading}
                    required
                >
                    <option value="">Seleccione un producto</option>
                    {products.map(product => (
                        <option
                            key={product.cod}
                            value={product.cod}
                            disabled={product.current_stock <= 0}
                        >
                            {product.product} (Stock: {product.current_stock}) - ${product.price}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-1 filter-item">
                <label>Cantidad</label>
                <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={onNumberChange}
                    className="w-100 text-center"
                    required
                    disabled={!formData.product_cod || loading}
                />
            </div>
            <div className='col-md-2 filter-item'>
                <select
                    name='payment_method'
                    value={formData.payment_method}
                    onChange={onInputChange}
                    className='desplegable'
                    disabled={loading || !formData.product_cod}
                    required
                >
                    <option value="">Método de pago *</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                </select>
            </div>

            <div className="align-items-end">
                <button
                    className="btn btn-success"
                    onClick={handleAddProduct}
                    disabled={(!formData.product_cod || !formData.payment_method) || loading}
                    style={{ backgroundColor: 'transparent' }}
                > 
                    <FaCheck
                        size={20}
                        color={(loading || (!formData.product_cod || !formData.payment_method)) ? 'gray' : 'green'}
                    />
                </button>
            </div>
        </div>
    );
};

export default SaleForm;