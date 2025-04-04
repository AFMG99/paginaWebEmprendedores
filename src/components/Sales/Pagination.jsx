import React from 'react';

const Pagination = (
    {
        currentPage,
        totalPages,
        setCurrentPage,
        rowsPerPage,
        handleRowsChange,
        filteredSales,
    }) => (
    <>
        <div className="pagination">
            <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || totalPages <= 1}
            >⏮</button>
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || totalPages <= 1}
            >⮜</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages <= 1}
            >⮞</button>
            <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages <= 1}
            >⏭</button>
        </div>
        <div>
            <label>Filas: </label>
            <select
                value={rowsPerPage}
                className='desplegable-paginacion'
                onChange={handleRowsChange}
            >
                {[5, 10, 15, 20, 50, 100].map(num => <option key={num} value={num}>{num}</option>)}
            </select>
        </div>
    </>
);

export default Pagination
