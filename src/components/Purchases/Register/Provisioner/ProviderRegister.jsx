import React, { useState, useEffect } from 'react';
import PurchasesActions from '../../PurchasesActions';
import Pagination from '../../../Paginations/Pagination';
import { FaFileExcel, FaCheck, FaTrash } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const ProviderRegister = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        cod_provider: '',
        provider_name: '',
    });

    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        quantity: 1,
        price: 0,
        subtotal: 0
    });
    const [existingProviders, setExistingProviders] = useState([
        {
            id: 1,
            date: '2023-05-15',
            cod_provider: 'PV001',
            provider_name: 'Ferretería Central',
            products: [
                { name: 'Martillo 16oz', quantity: 10, price: 8.99, subtotal: 89.90 },
                { name: 'Destornilladores', quantity: 15, price: 3.50, subtotal: 52.50 }
            ]
        },
        {
            id: 2,
            date: '2023-05-18',
            cod_provider: 'PV002',
            provider_name: 'Pinturas del Norte',
            products: [
                { name: 'Pintura Blanca', quantity: 5, price: 12.50, subtotal: 62.50 },
                { name: 'Rodillo 4"', quantity: 8, price: 4.75, subtotal: 38.00 }
            ]
        }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const savedProviders = JSON.parse(localStorage.getItem('providers')) || [];
        setExistingProviders(savedProviders);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        const numericValue = ['quantity', 'price', 'subtotal'].includes(name)
            ? parseFloat(value) || 0
            : value;

        setNewProduct(prev => ({
            ...prev,
            [name]: numericValue,
            ...(name === 'quantity' && {
                subtotal: numericValue * prev.price
            }),
            ...(name === 'price' && {
                subtotal: prev.quantity * numericValue
            })
        }));
    };

    const handleAddProduct = () => {
        if (!newProduct.name) {
            Swal.fire("Error", "Debe ingresar un nombre de producto", "error");
            return;
        }

        setProducts(prev => [...prev, newProduct]);
        setNewProduct({
            name: '',
            quantity: 1,
            price: 0,
            subtotal: 0
        });
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            // Mapear los datos del Excel a nuestro formato
            const importedProducts = jsonData.map(item => ({
                name: item['Producto'] || item['producto'] || '',
                quantity: parseFloat(item['Cantidad'] || item['cantidad'] || 1),
                price: parseFloat(item['Precio'] || item['precio'] || 0),
                subtotal: parseFloat(item['Subtotal'] || item['subtotal'] || 0)
            })).filter(p => p.name); // Filtrar productos con nombre

            setProducts(importedProducts);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSaveProvider = () => {
        if (!formData.cod_provider || !formData.provider_name) {
            Swal.fire("Error", "Debe completar los datos del proveedor", "error");
            return;
        }

        if (products.length === 0) {
            Swal.fire("Error", "Debe agregar al menos un producto", "error");
            return;
        }

        const providerData = {
            ...formData,
            products: products,
            id: Date.now() // ID único
        };

        setExistingProviders(prev => [...prev, providerData]);

        Swal.fire("Éxito", "Proveedor registrado correctamente", "success");
        // Limpiar formulario
        setFormData({
            date: new Date().toISOString().split('T')[0],
            cod_provider: '',
            provider_name: '',
        });
        setProducts([]);
    };

    const handleClean = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            cod_provider: '',
            provider_name: '',
        });
        setProducts([]);
        setNewProduct({
            name: '',
            quantity: 1,
            price: 0,
            subtotal: 0
        });
    };

    const totalAmount = products.reduce((sum, product) => sum + product.subtotal, 0);

    // Calcular insumos paginados
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / rowsPerPage);

    const handleRowsChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Resetear a la primera página
    };

    return (
        <div>
            <h2 className='text-center text-titulo'>Registro de Proveedores</h2>

            {/* Formulario de proveedor */}
            <div>
                <div className='col-3 filter-item'>
                    <label>Fecha:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='col-5 filter-item'>
                        <label>Código Proveedor</label>
                        <input
                            type="text"
                            name="cod_provider"
                            value={formData.cod_provider}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='col-6 filter-item'>
                        <label>Nombre Proveedor</label>
                        <input
                            type="text"
                            name="provider_name"
                            value={formData.provider_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className='table-container flex-grow-1' style={{ height: '270px' }}>
                <table border="1" className='sales-table'>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                            <th>Subtotal</th>
                            <th>
                                <div className='d-flex align-items-center'>
                                    Acciones
                                    <div style={{ marginLeft: 'auto' }}>
                                        <label
                                            className="btn"
                                            data-tooltip-id="excelImportTooltip"
                                        >
                                            <FaFileExcel color='white' />
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls, .csv"
                                                onChange={handleFileUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        <ReactTooltip
                                            id="excelImportTooltip"
                                            place="left"
                                            effect="solid"
                                        >
                                            <h6>Formato requerido para importación:</h6>
                                            <ul className="text-start">
                                                <li><strong>Columna A:</strong> Nombre del producto (texto)</li>
                                                <li><strong>Columna B:</strong> Cantidad (número)</li>
                                                <li><strong>Columna C:</strong> Precio unitario (número)</li>
                                                <li><strong>Opcional:</strong> Subtotal (número)</li>
                                            </ul>
                                            <p className="mb-0">El archivo debe tener encabezados en la primera fila.</p>
                                            <p className="mb-0">Formatos soportados: .xlsx, .xls, .csv</p>
                                        </ReactTooltip>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        style={{
                            maxHeight: 'calc(270px - 60px)',
                            overflowY: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        {/* Productos existentes PAGINADOS */}
                        {currentItems.map((product, index) => {
                            // Calculamos el índice real en el array completo
                            const realIndex = indexOfFirstItem + index;
                            return (
                                <tr key={realIndex}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>${product.subtotal.toFixed(2)}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleRemoveProduct(realIndex)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Fila para nuevo producto (siempre visible) */}
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleProductChange}
                                    className="form-control form-control-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={newProduct.quantity}
                                    onChange={handleProductChange}
                                    className="form-control form-control-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={handleProductChange}
                                    className="form-control form-control-sm"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="subtotal"
                                    min="0"
                                    step="0.01"
                                    value={newProduct.subtotal.toFixed(2)}
                                    readOnly
                                    className="form-control form-control-sm"
                                />
                            </td>
                            <td>
                                <button
                                    className="btn"
                                    onClick={handleAddProduct}
                                    disabled={!currentItems}
                                >
                                    <FaCheck size="15" color='green' />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Paginación para la tabla de insumos */}
            <div className='d-flex justify-content-between'>
                <div className="d-flex justify-content-between align-items-center mt-1 col-7">
                    <p>Mostrando {currentItems.length} de {products.length} resultados</p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        handleRowsChange={handleRowsChange}
                    />
                </div>

                {/* Total */}
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

            {/* Acciones */}
            <PurchasesActions
                handleClean={handleClean}
                handleSave={handleSaveProvider}
                purchaseExists={products.length > 0}
            />
        </div >
    );
};

export default ProviderRegister;