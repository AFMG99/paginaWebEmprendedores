import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SupplierForm from './SupplierForm';
import InputsTable from './InputsTable';
import PurchasesActions from '../../PurchasesActions';

const RegisterInputs = () => {
    // Datos quemados de proveedores
    const mockSuppliers = [
        { id: 1, name: "Proveedor A" },
        { id: 2, name: "Proveedor B" },
        { id: 3, name: "Proveedor C" }
    ];

    // Datos quemados de productos
    const mockProducts = [
        { id: 1, name: 'Producto X' },
        { id: 2, name: 'Producto Y' },
        { id: 3, name: 'Producto Z' },
    ];

    // Datos quemados de insumos
    const mockInputs = [
        { id: 1, name: "Insumo 1", price: 10.50, productId: 1 },
        { id: 2, name: "Insumo 2", price: 15.75, productId: 1 },
        { id: 3, name: "Insumo 3", price: 8.20, productId: 2 },
        { id: 4, name: "Insumo 4", price: 12.30, productId: 2 },
        { id: 5, name: "Insumo 5", price: 9.50, productId: 3 }
    ];

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        product: '',
        paymentType: '',
        paymentMethod: '',
        term: 0,
        dueDate: '',
    });

    const [allInputs, setAllInputs] = useState(mockInputs);
    const [filteredInputs, setFilteredInputs] = useState([]);
    const [selectedInputs, setSelectedInputs] = useState([]);
    const [editingCell, setEditingCell] = useState({ row: null, field: null });
    const [newInputRow, setNewInputRow] = useState({
        input: null,
        quantity: 1,
        price: 0,
    });

    const totalAmount = selectedInputs.reduce((sum, item) => {
        return sum + (item.quantity * item.price);
    }, 0);

    useEffect(() => {
        if (formData.date) {
            const due = calculateDueDate(formData.term);
            setFormData(prev => ({
                ...prev,
                dueDate: due
            }));
        }
    }, [formData.term, formData.date]);

    useEffect(() => {
        if (formData.product) {
            const filtered = allInputs.filter(input => input.productId === Number(formData.product));
            setFilteredInputs(filtered);
        } else {
            setFilteredInputs([]);
        }
    }, [formData.product, allInputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const numericFields = ['term'];
        const processedValue = numericFields.includes(name) 
            ? Number(value) || 0 
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: processedValue,
            ...(name === 'term' && {
                dueDate: calculateDueDate(value)
            }),
            // Limpiar insumos seleccionados si cambia el producto
            ...(name === 'product' && {
                selectedInputs: []
            })
        }));

        // Si cambia el producto, limpiamos los insumos seleccionados
        if (name === 'product') {
            setSelectedInputs([]);
            setNewInputRow({
                input: null,
                quantity: 1,
                price: 0,
            });
        }
    };


    const calculateDueDate = (days) => {
        if (!formData.date) return '';
    
        const date = new Date(formData.date);
    
        if (!days || days <= 0) {
            return date.toISOString().split('T')[0];
        }
    
        date.setDate(date.getDate() + Number(days));
        return date.toISOString().split('T')[0];
    };

    const handleCellDoubleClick = (rowIndex, field) => {
        setEditingCell({ row: rowIndex, field });
    };

    const handleCellChange = (rowIndex, field, value) => {
        if (rowIndex === -1) {
            // Es la nueva fila
            setNewInputRow(prev => ({
                ...prev,
                [field]: field === 'quantity' || field === 'price' ? Number(value) || 0 : value,
                ...(field === 'input' && {
                    price: filteredInputs.find(i => i.id === Number(value))?.price || 0,
                    inputName: filteredInputs.find(i => i.id === Number(value))?.name || ''
                })
            }));
        } else {
            // Es una fila existente
            const updatedInputs = [...selectedInputs];
            updatedInputs[rowIndex] = {
                ...updatedInputs[rowIndex],
                [field]: field === 'quantity' || field === 'price' ? Number(value) || 0 : value,
                ...(field === 'input' && {
                    name: filteredInputs.find(i => i.id === Number(value))?.name || '',
                    price: filteredInputs.find(i => i.id === Number(value))?.price || 0
                })
            };
            
            if (field === 'quantity' || field === 'price' || field === 'input') {
                updatedInputs[rowIndex].subtotal = 
                    updatedInputs[rowIndex].quantity * updatedInputs[rowIndex].price;
            }
            
            setSelectedInputs(updatedInputs);
        }
    };

    const handleAddInput = () => {
        if (!newInputRow.input) {
            Swal.fire("Error", "Seleccione un insumo", "error");
            return;
        }

        const selected = filteredInputs.find(i => i.id === Number(newInputRow.input));
        if (!selected) return;

        const inputToAdd = {
            id: selected.id,
            name: selected.name,
            quantity: newInputRow.quantity,
            price: newInputRow.price,
            subtotal: newInputRow.quantity * newInputRow.price
        };

        setSelectedInputs(prev => [...prev, inputToAdd]);
        setNewInputRow({
            input: null,
            quantity: 1,
            price: 0,
        });
        setEditingCell({ row: null, field: null });
    };

    const handleRemoveInput = (rowIndex) => {
        const updatedInputs = [...selectedInputs];
        updatedInputs.splice(rowIndex, 1);
        setSelectedInputs(updatedInputs);
    };

    const handleClean = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            supplier: '',
            category: '',
            paymentType: '',
            paymentMethod: '',
            term: 0,
            dueDate: '',
        });
        setSelectedInputs([]);
        setEditingCell({ row: null, field: null });
        setNewInputRow({
            input: null,
            quantity: 1,
            price: 0,
        });
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const purchaseData = {
                ...formData,
                items: selectedInputs,
                total: totalAmount
            };

            Swal.fire("Guardado", "Compra registrada correctamente", "success");
            handleClean();
        } catch (error) {
            console.error("Error al guardar:", error);
            showError("Error al guardar la compra", error);
        }
    };

    const validateForm = () => {
        if (!formData.supplier || selectedInputs.length === 0) {
            Swal.fire("Error", "Complete los datos requeridos y agregue al menos un insumo", "error");
            return false;
        }
        return true;
    };

    const showError = (message, error) => {
        Swal.fire("Error", message, "error");
        console.error(error);
    };

    const isFormComplete = () => {
        return formData.supplier && formData.product && formData.paymentType && formData.paymentMethod;
    };

    return (
        <div>
            <h2 className='text-center text-titulo'>Registro de Insumos</h2>
            <SupplierForm
                formData={formData}
                handleChange={handleChange}
                suppliers={mockSuppliers}
                products={mockProducts}
            />
            
            <InputsTable
                inputs={filteredInputs}
                selectedInputs={selectedInputs}
                newInputRow={newInputRow}
                editingCell={editingCell}
                handleCellDoubleClick={handleCellDoubleClick}
                handleCellChange={handleCellChange}
                handleAddInput={handleAddInput}
                handleRemoveInput={handleRemoveInput}
                isFormComplete={isFormComplete()}
            />
            
            <div className="total-section">
                <span>Total de la compra:</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
            
            <PurchasesActions
                handleClean={handleClean}
                handleSave={handleSave}
                purchaseExists={selectedInputs.length > 0}
            />
        </div>
    );
};

export default RegisterInputs;