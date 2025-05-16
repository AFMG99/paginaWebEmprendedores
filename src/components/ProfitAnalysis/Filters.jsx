import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const Filters = ({
    dateRange,
    setDateRange,
    filterPayment,
    setFilterPayment,
    filterProduct,
    setFilterProduct,
    products,
    fetchData
}) => {
    return (
        <div className="filters-section">
            <div className="filter-item">
                <label>Fecha inicio:</label>
                <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
            </div>
            <div className='filter-item'>
                <label>Fecha Fin:</label>
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
            </div>
            <div className="filter-item">
                <label>Método de pago:</label>
                <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className='desplegable'
                >
                    <option value="all">Todos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                </select>
            </div>
            <div className="filter-item">
                <label>Producto:</label>
                <select
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                    className='desplegable'
                >
                    <option value="all">Todos los productos</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.product}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={fetchData} className="btn">
                <FaSyncAlt />
            </button>
        </div>
    );
};

export default Filters;