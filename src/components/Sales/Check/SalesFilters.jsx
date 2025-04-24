import React from 'react';

const SalesFilters = (
    {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        filterPayment,
        setFilterPayment,
        filterProduct,
        setFilterProduct
    }) => (
    <div className="row filters-container">
        <div className="col-2 filter-item">
            <label>Fecha inicial:</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
        </div>
        <div className="col-2 filter-item">
            <label>Fecha Fin:</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
        </div>
        <div className="col-2 filter-item">
            <label>Método de Pago:</label>
            <select
                value={filterPayment}
                className="desplegable"
                onChange={(e) => setFilterPayment(e.target.value)}
            >
                <option value="">Todos</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
            </select>
        </div>
        <div className="col-5 filter-item">
            <label>Producto:</label>
            <input
                type="text"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                placeholder="Buscar producto"
            />
        </div>
    </div>
);

export default SalesFilters;
