import React from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";

const SalesActions = (
    {
        editMode,
        handleEdit,
        handleCancel,
        handleSave,
        handleDelete,
        selectedSaleId
    }) => (
    <div className="footer">
        {!editMode ? (
            <button
                onClick={handleEdit}
                className='edit-button'
                disabled={!selectedSaleId}
            >
                <FaEdit />
            </button>
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
            disabled={!selectedSaleId || editMode}
        >
            <FaTrash />
        </button>
    </div>
);

export default SalesActions;
