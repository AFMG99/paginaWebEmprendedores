import React from 'react';
import { FaTrash } from 'react-icons/fa';

const SalesTable = ({ items, selectedItem, onSelectItem, onRemoveItem }) => {
    return (
        <div className="table-container" style={{ height: '300px' }}>
            <table border="1" className="sales-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>metodo de pago</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <tr
                                key={`${item.product_cod}-${index}`}
                                className={selectedItem?.product_cod === item.product_cod ? 'table-active' : ''}
                                onClick={() => onSelectItem(item)}
                            >
                                <td>{item.product_name}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>{item.payment_method || 'No especificado'}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveItem(item.product_cod);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">No hay productos agregados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;