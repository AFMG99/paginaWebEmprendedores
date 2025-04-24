import React from 'react';

const PurchasesFilters = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filterStatus,
    setFilterStatus,
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
            <label>Medio de pago:</label>
            <select
                value={filterStatus}
                className="desplegable"
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="">Todos</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
            </select>
        </div>
        <div className="col-5 filter-item">
            <label>Buscar:</label>
            <div>
                <input
                    type="text"
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                    placeholder="Producto o proveedor"
                />
            </div>
        </div>
    </div>
);

export default PurchasesFilters;