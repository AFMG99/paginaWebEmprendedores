import React, { useState, useEffect } from 'react';
import { SalesService, ProductService } from '../../service/Services';

const SalesRegister = () => {
    const [sale, setSale] = useState({
        product_cod: '',
        price: 0,
        quantity: 1,
        payment_method: 'efectivo'
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await ProductService.getAll();
            setProducts(data);
        };
        loadProducts();
    }, []);

    const handleProductChange = (cod) => {
        const product = products.find(p => p.cod === cod);
        setSelectedProduct(product);
        setSale(prev => ({
            ...prev,
            product_cod: cod,
            price: product ? product.price : 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newSale = await SalesService.create(sale);
            await SalesService.updateStock(sale.product_cod, sale.quantity);
            setSale({
                product_cod: '',
                price: 0,
                quantity: 1,
                payment_method: 'efectivo'
            });
            setSelectedProduct(null);
            
            Swal.fire('Éxito', 'Venta registrada correctamente', 'success');
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo registrar la venta', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sales-form">
            <h2>Registro de Ventas</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Producto:</label>
                    <select
                        value={sale.product_cod}
                        onChange={(e) => handleProductChange(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un producto</option>
                        {products.map(product => (
                            <option key={product.cod} value={product.cod}>
                                {product.product} - ${product.price} (Stock: {product.current_stock})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={sale.price}
                        onChange={(e) => setSale({...sale, price: parseFloat(e.target.value) || 0})}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        value={sale.quantity}
                        onChange={(e) => setSale({...sale, quantity: parseInt(e.target.value) || 0})}
                        required
                        min="1"
                        max={selectedProduct?.current_stock || 1}
                    />
                </div>

                <div className="form-group">
                    <label>Método de Pago:</label>
                    <select
                        value={sale.payment_method}
                        onChange={(e) => setSale({...sale, payment_method: e.target.value})}
                        required
                    >
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>

                <div className="total-section">
                    <h3>Total: ${(sale.price * sale.quantity).toFixed(2)}</h3>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Procesando...' : 'Registrar Venta'}
                </button>
            </form>
        </div>
    );
};

export default SalesRegister;