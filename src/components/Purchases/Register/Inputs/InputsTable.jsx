import React from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

const InputsTable = ({
    inputs,
    selectedInputs,
    newInputRow,
    editingCell,
    handleCellDoubleClick,
    handleCellChange,
    handleAddInput,
    handleRemoveInput,
    isFormComplete
}) => {
    const renderCell = (rowIndex, field, value, isNewRow = false) => {
        const isEditing = editingCell.row === rowIndex && editingCell.field === field;

        if (!isFormComplete) {
            if (field === 'price' || field === 'subtotal') {
                return value ? `$${value.toFixed(2)}` : '';
            }
            return value || '';
        }

        if (isEditing) {
            if (field === 'input') {
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                        className="form-control form-control-sm"
                        autoFocus
                    >
                        <option value="">Seleccione un insumo</option>
                        {inputs.map(input => (
                            <option key={input.id} value={input.id}>
                                {input.name} (${input.price.toFixed(2)})
                            </option>
                        ))}
                    </select>
                );
            } else {
                return (
                    <input
                        type="number"
                        value={value}
                        min={field === 'quantity' ? 1 : 0}
                        step={field === 'price' ? 0.01 : 1}
                        onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                        className="form-control form-control-sm"
                        autoFocus
                    />
                );
            }
        } else {
            if (field === 'price' || field === 'subtotal') {
                return value ? `$${value.toFixed(2)}` : '';
            }
            if (field === 'input') {
                if (rowIndex === -1) {
                    return newInputRow.inputName || '';
                } else {
                    const selectedItem = selectedInputs[rowIndex];
                    return selectedItem ? selectedItem.name : '';
                }
            }
            return value || '';
        }
    };

    const handleDoubleClick = (rowIndex, field) => {
        if (isFormComplete) {
            handleCellDoubleClick(rowIndex, field);
        }
    };

    const handleAdd = () => {
        if (isFormComplete) {
            handleAddInput();
        }
    };

    return (
        <div className='table-container' style={{ height: '250px' }}>
            <table border="1" className="sales-table">
                <thead className="table-light">
                    <tr>
                        <th>Insumo</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Filas de insumos existentes */}
                    {selectedInputs.map((item, rowIndex) => (
                        <tr key={`${item.id}-${rowIndex}`}>
                            <td
                                onDoubleClick={() => handleDoubleClick(rowIndex, 'input')}
                                style={{ cursor: isFormComplete ? 'pointer' : 'default' }}
                            >
                                {renderCell(rowIndex, 'input', item.id)}
                            </td>
                            <td
                                onDoubleClick={() => handleDoubleClick(rowIndex, 'quantity')}
                                style={{ cursor: isFormComplete ? 'pointer' : 'default' }}
                            >
                                {item.id ? renderCell(rowIndex, 'quantity', item.quantity) : ''}
                            </td>
                            <td
                                onDoubleClick={() => handleDoubleClick(rowIndex, 'price')}
                                style={{ cursor: isFormComplete ? 'pointer' : 'default' }}
                            >
                                {item.id ? renderCell(rowIndex, 'price', item.price) : ''}
                            </td>
                            <td>
                                {item.id && item.quantity && item.price
                                    ? `$${item.subtotal.toFixed(2)}`
                                    : ''}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleRemoveInput(rowIndex)}
                                    className="delete-btn"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Fila para nuevo insumo */}
                    <tr>
                        <td
                            onDoubleClick={() => handleDoubleClick(-1, 'input')}
                            style={{ cursor: isFormComplete ? 'pointer' : 'default' }}
                        >
                            {renderCell(-1, 'input', newInputRow.input)}
                        </td>
                        <td
                            onDoubleClick={() => handleDoubleClick(-1, 'quantity')}
                            style={{ cursor: isFormComplete ? 'pointer' : 'default' }}
                        >
                            {newInputRow.input ? renderCell(-1, 'quantity', newInputRow.quantity) : ''}
                        </td>
                        <td
                            onDoubleClick={() => handleDoubleClick(-1, 'price')}
                            style={{ cursor: isFormComplete ? 'pointer' : 'default' }}
                        >
                            {newInputRow.input ? renderCell(-1, 'price', newInputRow.price) : ''}
                        </td>
                        <td>
                            {newInputRow.input && newInputRow.quantity && newInputRow.price
                                ? `$${(newInputRow.quantity * newInputRow.price).toFixed(2)}`
                                : ''}
                        </td>
                        <td>
                            {newInputRow.input ? (
                                <button
                                    onClick={handleAdd}
                                    className="btn"
                                    disabled={!isFormComplete}
                                >
                                    <FaCheck size="15" color={isFormComplete ? "green" : "gray"} />
                                </button>
                            ) : null}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InputsTable;