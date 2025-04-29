import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SupplierForm from './SupplierForm';
import InputsTable from './InputsTable';
import PurchasesActions from '../../PurchasesActions';
import { ProductService, ProviderService, InputService } from '../../../../service/Services';
import supabase from '../../../../db/supabaseClient';

const RegisterInputs = () => {
    const [providers, setProviders] = useState([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [formData, setFormData] = useState({
        created_at: new Date().toISOString().split('T')[0],
        provider: '',
        product: '',
        paymentType: '',
        paymentMethod: '',
        term: 0,
        dueDate: '',
    });

    const [allInputs, setAllInputs] = useState([]);
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

    // Cargar proveedores al montar el componente
    useEffect(() => {
        const fetchProviders = async () => {
            setLoadingProviders(true);
            try {
                const providersData = await ProviderService.getAll();
                setProviders(providersData || []);
            } catch (error) {
                console.error("Error al cargar proveedores:", error);
                Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
                setProviders([]);
            } finally {
                setLoadingProviders(false);
            }
        };

        fetchProviders();
    }, []);

    // Cargar productos al montar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const productsData = await ProductService.getAll();
                setProducts(productsData || []);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                Swal.fire("Error", "No se pudieron cargar los productos", "error");
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    // Cargar insumos cuando cambia el proveedor o producto
    useEffect(() => {
        const fetchInputs = async () => {
            try {
                if (formData.product) {
                    // Primero intentamos obtener insumos por producto
                    const inputsByProduct = await InputService.getByProduct(Number(formData.product));

                    if (inputsByProduct.length === 0 && formData.provider) {
                        // Si no hay insumos para el producto, obtenemos insumos del proveedor
                        const inputsByProvider = await InputService.getByProvider(Number(formData.provider));
                        setAllInputs(inputsByProvider);
                    } else {
                        setAllInputs(inputsByProduct);
                    }
                } else if (formData.provider) {
                    // Si solo hay proveedor seleccionado
                    const inputsByProvider = await InputService.getByProvider(Number(formData.provider));
                    setAllInputs(inputsByProvider);
                } else {
                    setAllInputs([]);
                }
            } catch (error) {
                console.error("Error al cargar insumos:", error);
                Swal.fire("Error", "No se pudieron cargar los insumos", "error");
                setAllInputs([]);
            }
        };

        fetchInputs();
    }, [formData.product, formData.provider]);

    // Filtrar insumos para mostrar en la tabla
    useEffect(() => {
        if (formData.product) {
            const filteredByProduct = allInputs.filter(input => input.product_id === Number(formData.product));

            if (filteredByProduct.length === 0 && formData.provider) {
                const providerInputs = allInputs.filter(input => input.provider_id === Number(formData.provider));
                setFilteredInputs(providerInputs);
            } else {
                setFilteredInputs(filteredByProduct);
            }
        } else {
            setFilteredInputs([]);
        }
    }, [formData.product, formData.provider, allInputs]);

    // Calcular fecha de vencimiento
    useEffect(() => {
        if (formData.created_at) {
            const due = calculateDueDate(formData.term);
            setFormData(prev => ({
                ...prev,
                dueDate: due
            }));
        }
    }, [formData.term, formData.created_at]);

    const calculateDueDate = (days) => {
        if (!formData.created_at) return '';
        const created_at = new Date(formData.created_at);
        if (!days || days <= 0) {
            return created_at.toISOString().split('T')[0];
        }
        created_at.setDate(created_at.getDate() + Number(days));
        return created_at.toISOString().split('T')[0];
    };

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
        }));

        // Limpiar insumos seleccionados si cambia el producto
        if (name === 'product') {
            setSelectedInputs([]);
            setNewInputRow({
                input: null,
                quantity: 1,
                price: 0,
            });
        }
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
            subtotal: newInputRow.quantity * newInputRow.price,
            product_id: Number(formData.product),
            provider_id: selected.provider_id
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
            created_at: new Date().toISOString().split('T')[0],
            provider: '',
            product: '',
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
            // 1. Crear la compra
            const { data: purchase, error: purchaseError } = await supabase
                .from('purchases')
                .insert([{
                    provider_id: Number(formData.provider),
                    product_id: Number(formData.product),
                    payment_type: formData.paymentType,
                    payment_method: formData.paymentMethod,
                    term: formData.term,
                    due_date: formData.dueDate,
                    total: totalAmount,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (purchaseError) throw purchaseError;

            // 2. Crear los items de la compra
            const purchaseItems = selectedInputs.map(input => ({
                purchase_id: purchase.id,
                input_id: input.id,
                quantity: input.quantity,
                price: input.price,
                subtotal: input.subtotal,
                product_id: Number(formData.product)
            }));

            const { error: itemsError } = await supabase
                .from('purchase_items')
                .insert(purchaseItems);

            if (itemsError) throw itemsError;

            // 3. Actualizar el stock de los insumos
            // await Promise.all(selectedInputs.map(input =>
            //     InputService.updateStock(input.id, input.quantity)
            // ));

            // 4. Asociar insumos al producto (versión mejorada)
            const updatePromises = selectedInputs.map(async (input) => {
                // Verificar si el insumo ya estaba asociado a este producto
                const currentInput = allInputs.find(i => i.id === input.id);

                if (!currentInput || currentInput.product_id !== Number(formData.product)) {
                    try {
                        await InputService.updateProductAssociation(
                            input.id,
                            Number(formData.product)
                        );
                        console.log(`Insumo ${input.id} asociado correctamente al producto ${formData.product}`);
                    } catch (error) {
                        console.error(`Error al asociar insumo ${input.id}:`, error);
                        // Continuar a pesar del error para no bloquear toda la operación
                    }
                }
            });

            // await Promise.all(inputsToUpdate.map(input =>
            //     InputService.update(input.id, { product_id: Number(formData.product) })
            // ));

            Swal.fire("Éxito", "Compra registrada correctamente", "success");
            handleClean();
        } catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire("Error", "No se pudo guardar la compra", "error");
        }
    };

    const validateForm = () => {
        if (!formData.provider || selectedInputs.length === 0) {
            Swal.fire("Error", "Complete los datos requeridos y agregue al menos un insumo", "error");
            return false;
        }
        return true;
    };

    const isFormComplete = () => {
        return formData.provider && formData.product && formData.paymentType && formData.paymentMethod;
    };

    return (
        <div>
            <h2 className='text-center text-titulo'>Registro de Insumos</h2>

            <SupplierForm
                formData={formData}
                handleChange={handleChange}
                providers={providers}
                loadingProviders={loadingProviders}
                products={products}
                loadingProducts={loadingProducts}
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
                currentProductId={formData.product}
            />

            <div className='d-flex justify-content-end'>
                <div className="col-4 mt-1">
                    <div className="total-container">
                        <div className="total-label col-7">
                            <h4 className="total-text">Total:</h4>
                        </div>
                        <div className="total-value col-5">
                            <h4 className="total-number">${totalAmount.toFixed(2)}</h4>
                        </div>
                    </div>
                </div>
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