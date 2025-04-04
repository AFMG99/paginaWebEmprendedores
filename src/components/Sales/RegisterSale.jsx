import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaSave, FaTrash, FaBroom } from "react-icons/fa";
import SalesTable from './Tables/SalesTable';
import SaleForm from './SaleForm';
import { SalesService, ProductService } from '../../service/Services';

const RegisterSale = () => {
    const [formData, setFormData] = useState({
        product_cod: '',
        price: 0,
        quantity: 1,
        payment_method: '',
        created_at: new Date().toISOString().split('T')[0]
    });
    const [products, setProducts] = useState([]);
    const [currentSaleItems, setCurrentSaleItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const productsData = await ProductService.getAll();
                setProducts(productsData);
            } catch (error) {
                showError("No se pudieron cargar los productos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
    };

    const handleProductChange = (cod) => {
        const product = products.find(p => p.cod === cod);
        if (product) {
            setFormData(prev => ({
                ...prev,
                product_cod: cod,
                price: product.price,
                quantity: 1
            }));
            setSelectedItem(null);
        }
    };

    const handleClean = () => {
        setFormData({
            product_cod: '',
            price: 0,
            quantity: 1,
            payment_method: '',
            created_at: new Date().toISOString().split('T')[0]
        });
        setCurrentSaleItems([]);
        setSelectedItem(null);
    };

    const validateProduct = () => {
        const product = products.find(p => p.cod === formData.product_cod);

        if (!product) {
            Swal.fire("Error", "Seleccione un producto válido", "error");
            return false;
        }

        if (formData.quantity <= 0) {
            Swal.fire("Error", "La cantidad debe ser mayor a cero", "error");
            return false;
        }

        if (formData.quantity > product.current_stock) {
            Swal.fire("Error", `No hay suficiente stock (Disponible: ${product.current_stock})`, "error");
            return false;
        }

        return true;
    };

    const handleAddProduct = () => {
        if (!validateProduct()) return;

        const product = products.find(p => p.cod === formData.product_cod);
        const newItem = {
            ...formData,
            product_name: product.product,
            product: product,
            payment_method: formData.payment_method
        };

        setCurrentSaleItems(prev => [...prev, newItem]);
        setFormData(prev => ({ ...prev, product_cod: '', price: 0, quantity: 1 }));
    };

    const handleRemoveItem = (productCod) => {
        setCurrentSaleItems(prev => prev.filter(item => item.product_cod !== productCod));
        setSelectedItem(null);
    };

    const handleSaveSale = async () => {
        if (currentSaleItems.length === 0) {
            Swal.fire("Error", "Agregue al menos un producto", "error");
            return;
        }
        const itemsWithoutPayment = currentSaleItems.filter(item => !item.payment_method);
        if (itemsWithoutPayment.length > 0) {
            Swal.fire("Error", "Algunos productos no tienen método de pago asignado", "error");
            return;
        }

        setLoading(true);
        try {
            await SalesService.createBatch(currentSaleItems.map(item => ({
                product_cod: item.product_cod,
                product_name: item.product_name,
                price: item.price,
                quantity: item.quantity,
                payment_method: item.payment_method,
                created_at: item.created_at || formData.created_at
            })));

            const updatedProducts = await ProductService.getAll();
            setProducts(updatedProducts);

            Swal.fire("Éxito", "Venta registrada", "success");
            handleClean();
        } catch (error) {
            showError("Error al guardar", error);
        } finally {
            setLoading(false);
        }
    };

    const showError = (message, error) => {
        console.error(error);
        Swal.fire("Error", message, "error");
    };

    const total = currentSaleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="container mt-4">
            <h2 className="text-center text-titulo">Registro de Ventas</h2>

            <SaleForm
                formData={formData}
                products={products}
                onProductChange={handleProductChange}
                onInputChange={handleInputChange}
                onNumberChange={handleNumberChange}
                loading={loading}
                handleAddProduct={handleAddProduct}
            />

            <SalesTable
                items={currentSaleItems}
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
                onRemoveItem={handleRemoveItem}
            />

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex gap-2">
                    <button className="clean-button" onClick={handleClean}>
                        <FaBroom />
                    </button>
                    {selectedItem && (
                        <button
                            className="delete-button"
                            onClick={() => handleRemoveItem(selectedItem.product_cod)}
                        >
                            <FaTrash />
                        </button>
                    )}
                    <button
                        className="save-button"
                        onClick={handleSaveSale}
                        disabled={currentSaleItems.length === 0 || loading}
                    >
                        {loading ? "..." : <FaSave />}
                    </button>
                </div>
                <div className="col-md-3 d-flex filter-item rounded-3 p-0 m-0">
                    <div
                        className="col-md-6 p-2"
                        style={{
                            backgroundColor: '#6200ea',
                            border: '0.5px solid white',
                            borderTopLeftRadius: '5px',
                            borderBottomLeftRadius: '5px',
                        }}
                    >
                        <h4
                            className="mb-0"
                            style={{
                                color: 'white',
                                fontSize: '17px',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >Total: </h4>
                    </div>
                    <div className="col-md-6">
                        <h4
                            className="mb-0"
                            style={{ fontSize: '17px', fontWeight: 'bold', textAlign: 'center' }}
                        >${total.toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterSale;