import React, { useEffect, useState } from 'react';
import { 
    FaCalendarAlt, 
    FaTag, 
    FaDollarSign, 
    FaQrcode, 
    FaBoxes, 
    FaBoxOpen, 
    FaRegStickyNote 
} from "react-icons/fa";
import { ProductService } from '../../service/Services';

const SaleModal = ({ sale, onClose }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sale?.product_id) {
            fetchProductDetails();
        }
    }, [sale]);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const productData = await ProductService.getById(sale.product_id);
            setProduct(productData);
        } catch (error) {
            console.error("Error al cargar el producto:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!sale) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content animate" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h3 className='text-titulo fs-1'>Detalles del Producto</h3>
                
                {loading ? (
                    <p>Cargando detalles del producto...</p>
                ) : (
                    <div className="modal-body d-flex gap-5">
                        <div className='col-5'>
                            <img
                                src={product?.image || 'ruta-a-imagen-por-defecto.png'}
                                alt={sale.product_name}
                                className="modal-img"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        <div className='col-7'>
                            <div className='d-flex align-items-center mb-3'>
                                <FaQrcode color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Código:</strong>
                                <span className='ms-2 fs-4'>{product?.cod || 'N/A'}</span>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <FaTag color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Producto:</strong>
                                <span className='ms-2 fs-4'>{sale.product_name}</span>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <FaDollarSign color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Precio:</strong>
                                <span className='ms-2 fs-4'>${sale.price}</span>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <FaCalendarAlt color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Fecha de venta:</strong>
                                <span className='ms-2 fs-4'>{sale.created_at.split('T')[0]}</span>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <FaBoxes color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Stock Actual:</strong>
                                <span className='ms-2 fs-4'>{product?.current_stock || 'N/A'}</span>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <FaBoxOpen color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Stock Mínimo:</strong>
                                <span className='ms-2 fs-4'>{product?.min_stock || 'N/A'}</span>
                            </div>
                            <div className='d-flex align-items-start mb-3'>
                                <FaRegStickyNote color='rgba(79, 17, 166, 0.9)' size="25" />
                                <strong className='fs-4 ms-2'>Descripción:</strong>
                                <span className='ms-2 fs-4'>{product?.description || 'Sin descripción'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SaleModal;