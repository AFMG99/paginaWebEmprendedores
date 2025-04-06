import React, { useState } from "react";
import { FaEdit, FaSave, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const PurchaseList = () => {
    // Datos quemados de ejemplo
    const initialPurchases = [
        {
            id: 1,
            productName: "Salchichas",
            supplier: "Zenu",
            quantity: 5,
            unitPrice: 1200.50,
            date: "2023-05-15",
            status: "Completado"
        },
        {
            id: 2,
            productName: "Panes",
            supplier: "Bimbo",
            quantity: 20,
            unitPrice: 25.99,
            date: "2023-06-02",
            status: "Pendiente"
        },
        {
            id: 3,
            productName: "Gaseosas",
            supplier: "Postobon",
            quantity: 10,
            unitPrice: 89.90,
            date: "2023-06-10",
            status: "Completado"
        },
        {
            id: 4,
            productName: "Servilletas",
            supplier: "Familia",
            quantity: 8,
            unitPrice: 199.99,
            date: "2023-06-18",
            status: "Cancelado"
        }
    ];

    const [purchases, setPurchases] = useState(initialPurchases);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            Swal.fire("Éxito", "Compra actualizada correctamente", "success");
            setEditMode(false);
            setSelectedPurchaseId(null);
            setLoading(false);
        }, 1000);
    };

    const handleDelete = async () => {
        if (!selectedPurchaseId) return;

        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la compra permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            setTimeout(() => {
                setPurchases(purchases.filter(p => p.id !== selectedPurchaseId));
                Swal.fire('Eliminado', 'Compra eliminada con éxito.', 'success');
                setLoading(false);
                setSelectedPurchaseId(null);
                setEditMode(false);
            }, 1000);
        }
    };
    
    const handleCancel = () => {
        setEditMode(false);
        setPurchases(initialPurchases); // Restablece los datos originales
    };

    const filteredPurchases = purchases.filter(purchase =>
        purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (field, value) => {
        setPurchases(purchases.map(purchase =>
            purchase.id === selectedPurchaseId ? { ...purchase, [field]: value } : purchase
        ));
    };

    return (
        <div className="purchase-container">
            <h2 className="text-center">Lista de Compras</h2>

            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar por producto o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table className="purchase-table">
                    <thead>
                        <tr>
                        <th>Producto</th>
                        <th>Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPurchases.length > 0 ? (
                            filteredPurchases.map(purchase => (
                                <tr
                                    key={purchase.id}
                                    onClick={() => !editMode && setSelectedPurchaseId(purchase.id)}
                                    className={selectedPurchaseId === purchase.id ? "selected" : ""}
                                >
                                    <td>
                                        {editMode && selectedPurchaseId === purchase.id ? (
                                            <input
                                                type="text"
                                                value={purchase.productName}
                                                onChange={(e) => handleChange("productName", e.target.value)}
                                            />
                                        ) : (
                                            purchase.productName
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedPurchaseId === purchase.id ? (
                                            <input
                                                type="text"
                                                value={purchase.supplier}
                                                onChange={(e) => handleChange("supplier", e.target.value)}
                                            />
                                        ) : (
                                            purchase.supplier
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedPurchaseId === purchase.id ? (
                                            <input
                                                type="number"
                                                value={purchase.quantity}
                                                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                                            />
                                        ) : (
                                            purchase.quantity
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedPurchaseId === purchase.id ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={purchase.unitPrice}
                                                onChange={(e) => handleChange("unitPrice", parseFloat(e.target.value) || 0)}
                                            />
                                        ) : (
                                            `$${purchase.unitPrice.toFixed(2)}`
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedPurchaseId === purchase.id ? (
                                            <input
                                                type="date"
                                                value={purchase.date}
                                                onChange={(e) => handleChange("date", e.target.value)}
                                            />
                                        ) : (
                                            new Date(purchase.date).toLocaleDateString('es-ES')
                                        )}
                                    </td>
                                    <td>
                                        {editMode && selectedPurchaseId === purchase.id ? (
                                            <select
                                                value={purchase.status}
                                                onChange={(e) => handleChange("status", e.target.value)}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Completado">Completado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        ) : (
                                            purchase.status
                                        )}
                                    </td>
                                    <td className="text-right">
                                        ${(purchase.quantity * purchase.unitPrice).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-purchases">No se encontraron compras</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="footer">
                <button
                    onClick={handleEdit}
                    disabled={!selectedPurchaseId || editMode}
                    className="edit-button"
                >
                    <FaEdit /> 
                </button>
                <button
                    onClick={handleSave}
                    disabled={!editMode}
                    className="save-button"
                >
                    <FaSave /> 
                </button>
                <button
                    onClick={handleDelete}
                    disabled={!selectedPurchaseId || editMode}
                    className="delete-button"
                >
                    <FaTrash /> 
                </button>
                <button
                    onClick={handleCancel}
                    disabled={!editMode}
                    className="cancel-button"
                >
                    <FaTimes /> 
                </button>
            </div>
        </div>
    );
};

export default PurchaseList;