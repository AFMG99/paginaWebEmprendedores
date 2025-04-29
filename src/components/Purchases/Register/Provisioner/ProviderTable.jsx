import React from 'react';
import { FaFileExcel, FaPlus, FaTrash, FaSyncAlt } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const ProviderTable = ({
    inputs,
    handleFileUpload,
    handleAddInput,
    handleRemoveInput,
    loading,
    isFormComplete,
    handleUpdateStock
}) => {
    return (
        <div className='table-container flex-grow-1' style={{ height: '270px' }}>
            <table border="1" className='sales-table'>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Stock</th>
                        <th>Stock Mínimo</th>
                        <th>Unidad</th>
                        <th>
                            <div className='d-flex align-items-center'>
                                Acciones
                                <div style={{ marginLeft: 'auto' }}>
                                    <label
                                        className="btn"
                                        data-tooltip-id="excelImportTooltip"
                                        disabled={!isFormComplete || loading}
                                    >
                                        <FaFileExcel color={isFormComplete ? 'green' : 'gray'} />
                                        <input
                                            type="file"
                                            accept=".xlsx, .xls, .csv"
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                            disabled={!isFormComplete || loading}
                                        />
                                    </label>
                                    <ReactTooltip
                                        id="excelImportTooltip"
                                        place="left"
                                        effect="solid"
                                    >
                                        <h6>Formato requerido para importación:</h6>
                                        <ul className="text-start">
                                            <li><strong>Nombre:</strong> Nombre del insumo</li>
                                            <li><strong>Precio:</strong> Precio unitario</li>
                                            <li><strong>Stock:</strong> Cantidad actual</li>
                                            <li><strong>Cantidad:</strong> Cantidad necesaria</li>
                                            <li><strong>Stock Mínimo:</strong> Stock mínimo requerido</li>
                                            <li><strong>Unidad:</strong> Unidad de medida (opcional)</li>
                                        </ul>
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
                    {inputs.map((input) => (
                        <tr key={input.id} className={input.current_stock < input.required_quantity ? 'low-stock' : ''}>
                            <td>{input.name}</td>
                            <td>${input.price.toFixed(2)}</td>
                            <td>{input.required_quantity}</td>
                            <td>{input.current_stock}</td>
                            <td>{input.min_stock}</td>
                            <td>{input.unit}</td>
                            <td>
                                <button
                                    className="update-btn"
                                    onClick={() => handleUpdateStock(input.id)}
                                    disabled={loading}
                                    data-tooltip-id="updateStockTooltip"
                                >
                                    <FaSyncAlt />
                                </button>
                                <ReactTooltip id="updateStockTooltip">
                                    Actualizar stock a la cantidad requerida
                                </ReactTooltip>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleRemoveInput(input.id)}
                                    disabled={loading}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Fila para agregar nuevo insumo */}
                    <tr>
                        <td colSpan="5"></td>
                        <td>
                            <button
                                className="btn"
                                onClick={handleAddInput}
                                disabled={!isFormComplete || loading}
                                data-tooltip-id="addInputTooltip"
                            >
                                <FaPlus color={isFormComplete ? 'green' : 'gray'} />
                            </button>
                            <ReactTooltip
                                id="addInputTooltip"
                                place="left"
                                effect="solid"
                            >
                                Agregar nuevo insumo
                            </ReactTooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProviderTable;