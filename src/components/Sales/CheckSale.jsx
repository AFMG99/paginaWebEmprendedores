import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SalesFilters from './SalesFilters';
import SalesTable from './SalesTable';
import SalesActions from './SalesActions';
import Pagination from './Pagination';
import SaleModal from '../Modals/SaleModal';

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

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = () => {
        setSales([
            { id: 1, fecha: "2025-01-15", producto: "Hamburguesa clásica", cantidad: 2, subtotal: 12000, total: 24000, metodo_pago: "Contado" },
            { id: 2, fecha: "2025-01-20", producto: "Perro caliente", cantidad: 3, subtotal: 8000, total: 24000, metodo_pago: "Credito" },
            { id: 3, fecha: "2025-02-05", producto: "Arepa rellena", cantidad: 1, subtotal: 10000, total: 10000, metodo_pago: "Contado" },
            { id: 4, fecha: "2025-02-07", producto: "Empanadas de carne", cantidad: 5, subtotal: 2500, total: 12500, metodo_pago: "Contado" },
            { id: 5, fecha: "2025-02-15", producto: "Churros con chocolate", cantidad: 2, subtotal: 6000, total: 12000, metodo_pago: "Credito" },
            { id: 6, fecha: "2025-03-01", producto: "Tacos mexicanos", cantidad: 4, subtotal: 7000, total: 28000, metodo_pago: "Contado" },
            { id: 7, fecha: "2025-03-03", producto: "Papas rellenas", cantidad: 3, subtotal: 5500, total: 16500, metodo_pago: "Credito" },
            { id: 8, fecha: "2025-03-10", producto: "Chorizo al carbón", cantidad: 2, subtotal: 9000, total: 18000, metodo_pago: "Contado" },
            { id: 9, fecha: "2025-03-15", producto: "Mazorca desgranada", cantidad: 1, subtotal: 12000, total: 12000, metodo_pago: "Contado" },
            { id: 10, fecha: "2025-04-01", producto: "Buñuelos", cantidad: 10, subtotal: 1000, total: 10000, metodo_pago: "Credito" },
            { id: 11, fecha: "2025-04-05", producto: "Choripán", cantidad: 2, subtotal: 8000, total: 16000, metodo_pago: "Contado" },
            { id: 12, fecha: "2025-04-10", producto: "Almojábanas", cantidad: 6, subtotal: 1500, total: 9000, metodo_pago: "Credito" },
            { id: 13, fecha: "2025-04-15", producto: "Arepa de choclo", cantidad: 3, subtotal: 4000, total: 12000, metodo_pago: "Contado" },
            { id: 14, fecha: "2025-05-02", producto: "Salchipapas", cantidad: 4, subtotal: 6000, total: 24000, metodo_pago: "Credito" },
            { id: 15, fecha: "2025-05-05", producto: "Patacón con todo", cantidad: 2, subtotal: 11000, total: 22000, metodo_pago: "Contado" },
            { id: 16, fecha: "2025-05-10", producto: "Tamal colombiano", cantidad: 1, subtotal: 15000, total: 15000, metodo_pago: "Credito" },
            { id: 17, fecha: "2025-05-15", producto: "Chuzo de pollo", cantidad: 3, subtotal: 7000, total: 21000, metodo_pago: "Contado" },
            { id: 18, fecha: "2025-06-01", producto: "Chicharrón con yuca", cantidad: 2, subtotal: 13000, total: 26000, metodo_pago: "Contado" },
            { id: 19, fecha: "2025-06-05", producto: "Obleas", cantidad: 5, subtotal: 4000, total: 20000, metodo_pago: "Credito" },
            { id: 20, fecha: "2025-06-10", producto: "Mango biche", cantidad: 7, subtotal: 2000, total: 14000, metodo_pago: "Contado" },
            { id: 21, fecha: "2025-06-15", producto: "Perrito doble queso", cantidad: 2, subtotal: 10000, total: 20000, metodo_pago: "Credito" },
            { id: 22, fecha: "2025-06-20", producto: "Torta de choclo", cantidad: 3, subtotal: 6000, total: 18000, metodo_pago: "Contado" },
            { id: 23, fecha: "2025-07-01", producto: "Crispetas", cantidad: 8, subtotal: 3000, total: 24000, metodo_pago: "Credito" },
            { id: 24, fecha: "2025-07-05", producto: "Jugos naturales", cantidad: 4, subtotal: 5000, total: 20000, metodo_pago: "Contado" }
        ]);
    };

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => setEditMode(false);
    const handleSave = () => {
        setEditMode(false);
        Swal.fire("Guardado", "Los cambios han sido guardados", "success");
    };
    const handleDelete = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                setSales(sales.filter(sale => sale.id !== selectedSaleId));
                setSelectedSaleId(null);
                Swal.fire("Eliminado", "La venta ha sido eliminada.", "success");
            }
        });
    };

    const handleChange = (field, value) => {
        setSales(sales.map(sale => sale.id === selectedSaleId ? { ...sale, [field]: value } : sale));
    };

    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.fecha);
        const fromDate = startDate ? new Date(startDate) : null;
        const toDate = endDate ? new Date(endDate) : null;
        const matchDate = (!fromDate || saleDate >= fromDate) && (!toDate || saleDate <= toDate);
        const matchPayment = filterPayment ? sale.metodo_pago.toLowerCase() === filterPayment.toLowerCase() : true;
        const matchProduct = filterProduct ? sale.producto.toLowerCase().includes(filterProduct.toLowerCase()) : true;
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

    return (
        <div className="sales-container">
            <h2 className="text-center text-titulo">Historial de Ventas</h2>
            <SalesFilters
                {...{
                    startDate,
                    setStartDate,
                    endDate,
                    setEndDate,
                    filterPayment,
                    setFilterPayment,
                    filterProduct,
                    setFilterProduct
                }}
            />
            <SalesTable
                {...{
                    sales: currentSales,
                    selectedSaleId,
                    setSelectedSaleId,
                    editMode,
                    handleChange,
                    handleRowClick,
                }}
            />
            {totalPages > 0 && (
                <div className="pagination-container">
                    <p>Mostrando {currentSales.length} de {filteredSales.length} resultados</p>
                    <Pagination
                        {...{
                            currentPage,
                            totalPages,
                            setCurrentPage,
                            rowsPerPage,
                            handleRowsChange
                        }}
                    />
                </div>
            )}
            <SalesActions
                {...{
                    editMode,
                    handleEdit,
                    handleCancel,
                    handleSave,
                    handleDelete,
                    selectedSaleId
                }}
            />
            <SaleModal sale={showModalSale} onClose={() => setShowModalSale(null)} />
        </div>
    );
};

export default CheckSale;