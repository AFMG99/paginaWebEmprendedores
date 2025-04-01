import React from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";

const SalesActions = (
    {
        editMode,
        handleEdit,
        handleCancel,
        handleSave,
        handleDelete,
        selectedSaleId,
        selectedProduct,
        showNewButton = true
    }) => (
    <div className="footer">
        {!editMode ? (
            <>
                <button
                    onClick={handleEdit}
                    className='edit-button'
                    disabled={!selectedSaleId || !selectedProduct}
                >
                    <FaEdit />
                </button>
                {showNewButton && (
                    <button
                        onClick={handleSave}
                        className='save-button'
                    >
                        <FaSave />
                    </button>
                )}
            </>
        ) : (
            <>
                <button
                    onClick={handleSave}
                    className='save-button'
                >
                    <FaSave />
                </button>
                <button
                    onClick={handleCancel}
                    className='cancel-button'
                >
                    <FaTimes />
                </button>
            </>
        )}
        <button
            onClick={handleDelete}
            className='delete-button'
            disabled={!selectedSaleId || !selectedProduct || editMode}
        >
            <FaTrash />
        </button>
    </div>
);

export default SalesActions;
