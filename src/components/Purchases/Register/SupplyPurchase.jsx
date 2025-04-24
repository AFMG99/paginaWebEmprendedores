import React, { useState } from 'react';
import { FaSearch, FaTrash, FaSave } from 'react-icons/fa';

const PurchaseRegister = () => {
  const [supplier, setSupplier] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('contado');
  const [notes, setNotes] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [products, setProducts] = useState([]);

  const availableProducts = [
    { id: 1, name: "Panes", code: "PAN-001" },
    { id: 2, name: "Leche", code: "LEC-002" },
    { id: 3, name: "Huevos", code: "HUE-003" },
    { id: 4, name: "Queso", code: "QUE-004" }
  ];

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (product) => {
    if (quantity <= 0 || unitPrice <= 0) {
      alert("La cantidad y el precio deben ser mayores a cero");
      return;
    }
    
    const newProduct = {
      id: Date.now(),
      name: product.name, 
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      total: quantity * unitPrice
    };
    
    setProducts([...products, newProduct]);
    setQuantity(1);
    setUnitPrice(0);
    setSearchTerm('');
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const total = products.reduce((sum, product) => sum + product.total, 0);

  return (
    <div className="purchase-register-container">
      <h1 className="main-title">Registro de Compras de Insumos</h1>
      
      {/* Sección Proveedor */}
      <div className="supplier-section">
        <h2 className="section-title">Datos del Proveedor</h2>
        
        <div className="supplier-fields">
          <div className="form-row">
            <div className="form-group">
              <label>Proveedor</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder='Nombre Del proveedor'
              />
            </div>
            <div className="form-group">
              <label>N° Factura</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder='Numero de la Factura'
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Compra</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Forma de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="contado">Contado</option>
                <option value="credito">Crédito</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="section-divider"></div>

      {}
      <div className="products-section">
        <h2 className="section-title">Agregar Productos</h2>
        
        <div className="search-container">
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {}
          {searchTerm && (
            <div className="search-results">
              {filteredProducts.length > 0 ? (
                <ul>
                  {filteredProducts.map(product => (
                    <li 
                      key={product.id} 
                      onClick={() => {
                        setSearchTerm(product.name);
                      }}
                    >
                      {product.code} - {product.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-results">No se encontraron productos</div>
              )}
            </div>
          )}
        </div>
        
        <div className="product-controls">
          <div className="control-group">
            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label>Precio Unitario ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          
          <button 
            className="add-button" 
            onClick={() => {
              const selectedProduct = availableProducts.find(
                p => p.name.toLowerCase() === searchTerm.toLowerCase()
              );
              
              if (selectedProduct) {
                addProduct(selectedProduct);
              } else {
                alert("Seleccione un producto válido de la lista");
              }
            }}
          >
            Agregar Producto
          </button>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* Lista de Productos */}
      <div className="products-list-section">
        <h2 className="section-title">Productos a Comprar</h2>
        
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${product.unitPrice.toFixed(2)}</td>
                  <td>${product.total.toFixed(2)}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => removeProduct(product.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="total-section">
          <span>Total de la compra:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="footer">
        <button className="save-button">
          <FaSave /> 
        </button>
      </div>
    </div>
  );
};

export default PurchaseRegister;