import React, { useEffect } from 'react';

const ProductForm = ({
    formData,
    handleChange,
    handleImageChange,
    products,
    setFormData
}) => {
    useEffect(() => {
        if (formData.cod.trim()) {
            const existingProduct = products.find(p => p.cod === formData.cod);
            if (existingProduct) {
                setFormData(prev => ({
                    ...existingProduct,
                    image: prev.image || existingProduct.image
                }));
            }
        }
    }, [formData.cod, products, setFormData]);
    return (
        <div className="row">
            <div className="col-7">
                <div className='d-flex justify-content-between'>
                    <div className="col-5 filter-item">
                        <label>Código</label>
                        <input
                            type="text"
                            name='cod'
                            value={formData.cod}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>
                    <div className="col-6 filter-item">
                        <label>Fecha</label>
                        <input
                            type="date"
                            name='created_at'
                            value={formData.created_at.split('T')[0]}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className='col-12 filter-item'>
                    <label>Nombre Producto</label>
                    <input
                        type="text"
                        name='product'
                        value={formData.product}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12 filter-item">
                    <label>Descripción</label>
                    <textarea
                        rows="3"
                        className='col-12 text-area'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>

            <div className="d-flex col-5">
                <div className="w-100 mb-3 position-relative">
                    <label
                        htmlFor="imageUpload"
                        className='w-100 d-flex flex-colum align-items-center justify-content-center text-center'
                        style={{
                            cursor: formData.cod.trim() ? 'pointer' : 'not-allowed',
                            minHeight: '200px',
                            border: '2px dashed #ccc',
                            opacity: formData.cod.trim() ? 1 : 0.6
                        }}
                        title={!formData.cod.trim() ? "Primero ingrese un código de producto" : ""}
                    >
                        {formData.image ? (
                            <img
                                src={formData.image}
                                className='img-fluid'
                                alt="Vista previa"
                                style={{ maxHeight: "200px", width: '100%' }}
                            />
                        ) : (
                            <p className="text-muted">
                                {formData.cod.trim()
                                    ? "Haz clic aquí para subir una imagen"
                                    : "Ingrese un código para subir imagen"}
                            </p>
                        )}
                    </label>
                    <input
                        type="file"
                        id='imageUpload'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='d-none'
                        disabled={!formData.cod.trim()}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductForm
