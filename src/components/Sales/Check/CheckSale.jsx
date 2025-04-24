import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SalesFilters from './SalesFilters';
import SalesActions from '../SalesActions';
import Pagination from '../../Paginations/Pagination';
import SaleModal from '../../Modals/SaleModal';
import QueryTable from './QueryTable';
import { SalesService } from '../../../service/Services';

const CheckSale = () => {
    const [sales, setSales] = useState([]);
    const [selectedSaleId, setSelectedSaleId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterPayment, setFilterPayment] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showModalSale, setShowModalSale] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true)
        try {
            const salesData = await SalesService.getAll();
            setSales(salesData);
        } catch (error) {
            console.error('Error fetching sales:', error);
            Swal.fire("Error", "No se pudieron cargar las ventas", "error");
        } finally {
            setLoading(false);
        }

    };

    const handleEdit = () => {
        if (selectedSaleId) {
            setEditMode(true);
        } else {
            Swal.fire("Advertencia", "Seleccione una venta para editar", "warning");
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        fetchSales();
    };
    const handleSave = async () => {
        if (!selectedSaleId) return;
        setLoading(true);
        try {
            const saleToUpdate = sales.find(s => s.id === selectedSaleId);
            const updateData = {
                product_name: saleToUpdate.product_name,
                quantity: saleToUpdate.quantity,
                price: saleToUpdate.price,
                payment_method: saleToUpdate.payment_method,
                created_at: saleToUpdate.created_at
            };

            await SalesService.update(selectedSaleId, updateData);
            Swal.fire("Guardado", "Los cambios han sido guardados", "success");
            setEditMode(false);
            fetchSales();
        } catch (error) {
            console.error("Error updating sale:", error);
            Swal.fire("Error", "No se pudo guardar los cambios", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSaleId) return;
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        });
        if (result.isConfirmed) {
            setLoading(true);
            try {
                await SalesService.delete(selectedSaleId);
                await fetchSales();
                setSelectedSaleId(null);
                Swal.fire("Eliminado", "La venta ha sido eliminada.", "success");
            } catch (error) {
                console.error("Error deleting sale:", error);
                Swal.fire("Error", "No se pudo eliminar la venta", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (field, value) => {
        setSales(sales.map(sale => sale.id === selectedSaleId ? { ...sale, [field]: value } : sale));
    };

    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.created_at);
        const fromDate = startDate ? new Date(startDate) : null;
        const toDate = endDate ? new Date(endDate) : null;
        const matchDate = (!fromDate || saleDate >= fromDate) && (!toDate || saleDate <= toDate);
        const matchPayment = filterPayment ? sale.payment_method.toLowerCase() === filterPayment.toLowerCase() : true;
        const matchProduct = filterProduct ? sale.product_name.toLowerCase().includes(filterProduct.toLowerCase()) : true;
        return matchDate && matchPayment && matchProduct;
    });

    const indexOfLastSale = currentPage * rowsPerPage;
    const indexOfFirstSale = indexOfLastSale - rowsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);
    const totalPages = Math.ceil(filteredSales.length / rowsPerPage);

    const handleRowsChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleRowClick = (sale) => {
        if (!editMode) {
            setSelectedSaleId(sale.id);
            setShowModalSale(sale);
        }
    };

    const handleClean = () => {
        setStartDate('');
        setEndDate('');
        setFilterPayment('');
        setFilterProduct('');
        setCurrentPage(1);
    };

    return (
        <div className="sales-container">
            <h2 className="text-center text-titulo">Historial de Ventas</h2>
            <SalesFilters
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                filterPayment={filterPayment}
                setFilterPayment={setFilterPayment}
                filterProduct={filterProduct}
                setFilterProduct={setFilterProduct}
            />
            {loading ? (
                <div className="text-center py-4">Cargando...</div>
            ) : (
                <>
                    <QueryTable
                        sales={currentSales}
                        selectedSaleId={selectedSaleId}
                        setSelectedSaleId={setSelectedSaleId}
                        editMode={editMode}
                        handleChange={handleChange}
                        handleRowClick={handleRowClick}
                    />

                    {totalPages > 0 && (
                        <div className="pagination-container">
                            <p>Mostrando {currentSales.length} de {filteredSales.length} resultados</p>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                                rowsPerPage={rowsPerPage}
                                handleRowsChange={handleRowsChange}
                            />
                        </div>
                    )}
                </>
            )}
            <SalesActions
                editMode={editMode}
                handleEdit={handleEdit}
                handleCancel={handleCancel}
                handleSave={handleSave}
                handleDelete={handleDelete}
                handleClean={handleClean}
                selectedSaleId={selectedSaleId}
                selectedProduct={selectedSaleId}
                showNewButton={false}
                productExists={!!selectedSaleId}
            />
            <SaleModal
                sale={showModalSale}
                onClose={() => setShowModalSale(null)}
            />
        </div>
    );
};

export default CheckSale;