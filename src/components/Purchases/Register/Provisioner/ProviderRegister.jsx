import React, { useState, useEffect } from 'react';
import PurchasesActions from '../../PurchasesActions';
import Pagination from '../../../Paginations/Pagination';
import ProviderForm from './ProviderForm';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ProviderTable from './ProviderTable';
import { ProviderService, InputService } from '../../../../service/Services';
import { showAddInputSwal } from '../../../Modals/AddInputSwal';

const ProviderRegister = () => {
    const [formData, setFormData] = useState({
        cod_provider: '',
        provider_name: '',
        state: 'Activo',
        city: '',
        address: '',
        phone: '',
        email: '',
        created_at: new Date().toISOString().split('T')[0]
    });

    const [providers, setProviders] = useState([]);
    const [inputs, setInputs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProviderId, setCurrentProviderId] = useState(null);
    const [searchTriggered, setSearchTriggered] = useState(false);

    // Cargar proveedores al inicio
    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const data = await ProviderService.getAll();
                setProviders(data);
            } catch (error) {
                showError("Error al cargar proveedores", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, []);

    // Buscar proveedor cuando cambia el código o nombre
    const handleSearchProvider = () => {
        const searchTerm = formData.cod_provider || formData.provider_name;

        if (searchTerm && searchTerm.length >= 3) {
            const searchCod = formData.cod_provider?.toLowerCase().trim();
            const searchName = formData.provider_name?.toLowerCase().trim();

            // Priorizar búsqueda por código si ambos campos tienen contenido
            const searchField = searchCod ? 'cod_provider' :
                searchName ? 'provider_name' : null;

            if (!searchField) return;

            const foundProvider = providers.find(provider => {
                const fieldValue = provider[searchField]?.toLowerCase().trim();
                const searchValue = searchField === 'cod_provider' ? searchCod : searchName;
                return fieldValue === searchValue;
            });

            if (foundProvider) {
                setFormData({
                    ...formData,
                    cod_provider: foundProvider.cod_provider,
                    provider_name: foundProvider.provider_name,
                    state: foundProvider.state,
                    city: foundProvider.city,
                    address: foundProvider.address,
                    phone: foundProvider.phone,
                    email: foundProvider.email,
                    created_at: foundProvider.created_at
                });
                setCurrentProviderId(foundProvider.id);
                setEditMode(true);
                fetchProviderInputs(foundProvider.id);
            } else if (formData.cod_provider?.length >= 3) {
                setFormData({
                    provider_name: '',
                    state: 'Activo',
                    city: '',
                    address: '',
                    phone: '',
                    email: '',
                    created_at: new Date().toISOString().split('T')[0]
                });
                setCurrentProviderId(null);
                setEditMode(false);
                setInputs([]);
            }
        }
        setSearchTriggered(true);
    };

    const fetchProviderInputs = async (providerId) => {
        setLoading(true);
        try {
            const data = await InputService.getByProvider(providerId);
            setInputs(data);
        } catch (error) {
            showError("Error al cargar insumos del proveedor", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchTriggered(false);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur = (fieldName) => {
        if (!searchTriggered && (fieldName === 'cod_provider' || fieldName === 'provider_name')) {
            handleSearchProvider();
        }
    };

    const handleAddInput = async () => {
        if (!formData.cod_provider || !formData.provider_name) {
            Swal.fire("Error", "Primero complete los datos del proveedor", "error");
            return;
        }
        await showAddInputSwal(currentProviderId, InputService, setInputs, showError);
    };

    const handleRemoveInput = async (inputId) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar insumo?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        });

        if (isConfirmed) {
            try {
                await InputService.delete(inputId);
                setInputs(prev => prev.filter(input => input.id !== inputId));
                Swal.fire("Eliminado", "El insumo ha sido eliminado", "success");
            } catch (error) {
                showError("Error al eliminar insumo", error);
            }
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                const inputsToCreate = jsonData.map(item => ({
                    name: item['Producto'] || item['producto'] || item['Nombre'] || '',
                    price: parseFloat(item['Precio'] || item['precio'] || 0),
                    current_stock: parseFloat(item['Cantidad'] || item['cantidad'] || item['Stock'] || item['stock'] || 0),
                    min_stock: parseFloat(item['Stock Mínimo'] || item['stock_minimo'] || 0),
                    unit: item['Unidad'] || item['unidad'] || 'unidad',
                    provider_id: currentProviderId,
                    required_quantity: parseFloat(item['Cantidad'] || item['cantidad'] || item['Stock'] || item['stock'] || 0)
                })).filter(input => input.name);

                if (inputsToCreate.length === 0) {
                    Swal.fire("Error", "No se encontraron datos válidos en el archivo", "error");
                    return;
                }

                const createdInputs = await Promise.all(
                    inputsToCreate.map(input => InputService.create(input))
                );

                setInputs(prev => [...prev, ...createdInputs]);
                Swal.fire("Éxito", `${createdInputs.length} insumos importados correctamente`, "success");
            } catch (error) {
                showError("Error al importar archivo", error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSaveProvider = async () => {
        if (!formData.cod_provider || !formData.provider_name) {
            Swal.fire("Error", "Debe completar los datos del proveedor", "error");
            return;
        }

        setLoading(true);
        try {
            if (editMode && currentProviderId) {
                // Actualizar proveedor existente
                const updatedProvider = await ProviderService.update(currentProviderId, formData);
                setProviders(prev => prev.map(p => p.id === currentProviderId ? updatedProvider : p));
                Swal.fire("Actualizado", "Proveedor actualizado correctamente", "success");
            } else {
                // Crear nuevo proveedor
                const newProvider = await ProviderService.create(formData);
                setProviders(prev => [...prev, newProvider]);
                setCurrentProviderId(newProvider.id);
                setEditMode(true);
                Swal.fire("Registrado", "Proveedor registrado correctamente", "success");
            }
        } catch (error) {
            showError("Error al guardar proveedor", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClean = () => {
        setFormData({
            cod_provider: '',
            provider_name: '',
            state: 'Activo',
            city: '',
            address: '',
            phone: '',
            email: '',
            created_at: new Date().toISOString().split('T')[0]
        });
        setInputs([]);
        setCurrentProviderId(null);
        setEditMode(false);
    };

    // Paginación
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = inputs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(inputs.length / rowsPerPage);

    const showError = (message, error) => {
        Swal.fire("Error", message, "error");
        console.error(error);
    };

    const handleUpdateStock = async (inputId) => {
        try {
            const inputToUpdate = inputs.find(input => input.id === inputId);
            const updatedInput = await InputService.update(inputId, {
                ...inputToUpdate,
                current_stock: inputToUpdate.required_quantity
            });

            setInputs(prev => prev.map(input =>
                input.id === inputId ? updatedInput : input
            ));
            Swal.fire("Éxito", "Stock actualizado correctamente", "success");
        } catch (error) {
            showError("Error al actualizar stock", error);
        }
    };

    const totalAmount = inputs.reduce((sum, item) => {
        return sum + (item.required_quantity || 0) * (item.price || 0);
    }, 0);

    return (
        <div>
            <h2 className='text-center text-titulo'>Registro de Proveedores</h2>

            <ProviderForm
                handleChange={handleChange}
                formData={formData}
                loading={loading}
                handleBlur={handleBlur}
            />

            <ProviderTable
                inputs={currentItems}
                handleFileUpload={handleFileUpload}
                handleAddInput={handleAddInput}
                handleRemoveInput={handleRemoveInput}
                loading={loading}
                isFormComplete={formData.cod_provider && formData.provider_name}
                handleUpdateStock={handleUpdateStock}
            />

            <div className='d-flex justify-content-between'>
                <div className="d-flex justify-content-between align-items-center mt-1 col-7">
                    <p>Mostrando {currentItems.length} de {inputs.length} insumos</p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        handleRowsChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    />
                </div>
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
                handleSave={handleSaveProvider}
                purchaseExists={inputs.length > 0 || formData.cod_provider}
                loading={loading}
            />
        </div>
    );
};

export default ProviderRegister;