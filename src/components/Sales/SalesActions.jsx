import React from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash, FaBroom } from "react-icons/fa";

const SalesActions = (
    {
        editMode,
        handleEdit,
        handleCancel,
        handleSave,
        handleDelete,
        handleClean,
        selectedSaleId,
        selectedProduct,
        showNewButton = true,
        productExists
    }) => (
    <div className="footer">
        {!editMode ? (
            <>
                {showNewButton && (
                    <button
                        onClick={handleClean}
                        className='clean-button'
                    >
                        <FaBroom />
                    </button>
                )}
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
                        disabled={productExists}
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
