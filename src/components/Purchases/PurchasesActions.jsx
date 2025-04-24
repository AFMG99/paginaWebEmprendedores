import React from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash, FaBroom } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";

const PurchasesActions = ({
    editMode,
    handleEdit,
    handleCancel,
    handleSave,
    handleDelete,
    handleClean,
    selectedPurchaseId,
    showNewButton = true,
    purchaseExists
}) => (
    <div className="footer">
        {!editMode ? (
            <>
                {showNewButton && (
                    <button
                        onClick={handleClean}
                        className='clean-button'
                        disabled={!purchaseExists}
                    >
                        <MdCleaningServices />
                    </button>
                )}
                <button
                    onClick={handleEdit}
                    className='edit-button'
                    disabled={!selectedPurchaseId}
                >
                    <FaEdit />
                </button>
                {showNewButton && (
                    <button
                        onClick={handleSave}
                        className='save-button'
                        disabled={!purchaseExists}
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
            disabled={!selectedPurchaseId || editMode}
        >
            <FaTrash />
        </button>
    </div>
);

export default PurchasesActions;