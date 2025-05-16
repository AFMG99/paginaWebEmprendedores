import React from 'react';

const ProviderForm = ({
    handleChange,
    formData,
    loading,
    handleBlur
}) => {
    return (
        <div>
            <div className='col-6'>
                <div className='d-flex justify-content-between'>
                    <div className='col-4 filter-item'>
                        <label>Código Proveedor</label>
                        <input
                            type="text"
                            name="cod_provider"
                            value={formData.cod_provider || ''}
                            onChange={handleChange}
                            autoComplete="off"
                            onBlur={() => handleBlur('cod_provider')}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className='col-4 filter-item'>
                        <label>Fecha:</label>
                        <input
                            type="date"
                            name="created_at"
                            value={formData.created_at.split('T')[0]}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className='col-3 filter-item'>
                        <label>Estado</label>
                        <select
                            className='desplegable'
                            name='state'
                            value={formData.state}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        >
                            <option value="Inactivo">Inactivo</option>
                            <option value="Activo">Activo</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-between'>
                <div className='col-3 filter-item'>
                    <label>Nombre Proveedor</label>
                    <input
                        type="text"
                        name="provider_name"
                        value={formData.provider_name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('provider_name')}
                        disabled={loading}
                        required
                    />
                </div>
                <div className='col-3 filter-item'>
                    <label>Ciudad</label>
                    <input
                        type="text"
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
                <div className='col-3 filter-item'>
                    <label>Dirección</label>
                    <input
                        type="text"
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
                <div className='col-2 filter-item'>
                    <label>Telefono</label>
                    <input
                        type="text"
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
            </div>
        </div>
    )
};

export default ProviderForm;