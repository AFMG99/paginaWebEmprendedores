import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import PurchasesFilters from './PurchasesFilters';
import PurchasesActions from '../PurchasesActions';
import Pagination from '../../Paginations/Pagination';
import PurchasesTable from './PurchasesTable';
import { PurchaseService } from '../../../service/Services';

const PurchaseList = () => {
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filterStatus, setFilterStatus] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showModalPurchase, setShowModalPurchase] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const purchasesData = await PurchaseService.getAll();
            setPurchases(purchasesData || []);
        } catch (error) {
            console.error('Error fetching purchases:', error);
            Swal.fire("Error", "No se pudieron cargar las compras", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (selectedPurchaseId) {
            setEditMode(true);
        } else {
            Swal.fire("Advertencia", "Seleccione una compra para editar", "warning");
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        fetchPurchases();
    };

    const handleSave = async () => {
        if (!selectedPurchaseId) return;
        setLoading(true);
        try {
            const purchaseToUpdate = purchases.find(p => p.id === selectedPurchaseId);
            const purchaseData = {
                payment_method: purchaseToUpdate.payment_method,
            };

            const providerData = {
                provider_name: purchaseToUpdate.product_name
            };

            const itemsData = purchaseToUpdate.items.map(item => ({
                input_id: item.input_id,
                quantity: item.quantity,
                price: item.price
            }));

            // Actualizar todo
            const updatedPurchase = await PurchaseService.updateComplete(
                selectedPurchaseId,
                purchaseData,
                providerData,
                itemsData
            );

            // Actualizar el estado con los nuevos datos
            setPurchases(purchases.map(p =>
                p.id === selectedPurchaseId ? {
                    ...updatedPurchase,
                    showItems: p.showItems
                } : p
            ));

            Swal.fire("Guardado", "Los cambios han sido guardados", "success");
            setEditMode(false);
            fetchPurchases();
        } catch (error) {
            console.error("Error updating purchase:", error);
            Swal.fire("Error", "No se pudo guardar los cambios", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPurchaseId) return;
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la compra permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await PurchaseService.delete(selectedPurchaseId);
                Swal.fire('Eliminado', 'Compra eliminada con éxito.', 'success');
                setSelectedPurchaseId(null);
                setEditMode(false);
                fetchPurchases();
            } catch (error) {
                console.error("Error deleting purchase:", error);
                Swal.fire("Error", "No se pudo eliminar la compra", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (field, value) => {
        setPurchases(purchases.map(purchase =>
            purchase.id === selectedPurchaseId ? { ...purchase, [field]: value } : purchase
        ));
    };

    const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        const fromDate = startDate ? new Date(startDate) : null;
        const toDate = endDate ? new Date(endDate) : null;
        const matchDate = (!fromDate || purchaseDate >= fromDate) && (!toDate || purchaseDate <= toDate);
        const matchStatus = filterStatus ? purchase.payment_method.toLowerCase() === filterStatus.toLowerCase() : true;
        const matchProduct = filterProduct ?
            purchase.product_name.toLowerCase().includes(filterProduct.toLowerCase()) ||
            purchase.provider_name.toLowerCase().includes(filterProduct.toLowerCase()) : true;
        return matchDate && matchStatus && matchProduct;
    });

    const indexOfLastPurchase = currentPage * rowsPerPage;
    const indexOfFirstPurchase = indexOfLastPurchase - rowsPerPage;
    const currentPurchases = filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);
    const totalPages = Math.ceil(filteredPurchases.length / rowsPerPage);

    const handleRowsChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleRowClick = (purchase) => {
        if (!editMode) {
            setSelectedPurchaseId(purchase.id);
            setShowModalPurchase(purchase);
        }
    };

    const handleClean = () => {
        setStartDate('');
        setEndDate('');
        setFilterStatus('');
        setFilterProduct('');
        setCurrentPage(1);
    };

    return (
        <div className="sales-container">
            <h2 className="text-center text-titulo">Lista de Compras</h2>

            <PurchasesFilters
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterProduct={filterProduct}
                setFilterProduct={setFilterProduct}
            />

            {loading ? (
                <div className="text-center py-4">Cargando...</div>
            ) : (
                <>
                    <PurchasesTable
                        purchases={currentPurchases}
                        selectedPurchaseId={selectedPurchaseId}
                        editMode={editMode}
                        handleChange={handleChange}
                        handleRowClick={handleRowClick}
                    />

                    {totalPages > 0 && (
                        <div className="pagination-container">
                            <p>Mostrando {currentPurchases.length} de {filteredPurchases.length} resultados</p>
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

            <PurchasesActions
                editMode={editMode}
                handleEdit={handleEdit}
                handleCancel={handleCancel}
                handleSave={handleSave}
                handleDelete={handleDelete}
                handleClean={handleClean}
                showNewButton={false}
                selectedPurchaseId={selectedPurchaseId}
                purchaseExists={!!selectedPurchaseId}
            />
        </div>
    );
};

export default PurchaseList;