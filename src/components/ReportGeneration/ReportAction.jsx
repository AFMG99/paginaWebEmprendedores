import React from 'react';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const ReportAction = ({ onExportExcel, onExportPDF, onPreview, previewMode, hasData }) => {
    return (
        <div className="d-flex justify-content-center gap-3 mb-2 mt-2">
            <button
                onClick={onPreview}
                className={`btn ${previewMode ? 'btn' : 'btn'}`}
                disabled={!hasData}
                style={{ border: 'none' }}
            >
                {previewMode ? <MdVisibilityOff color='#514660' size="35" /> :
                    <MdVisibility color={!hasData ? 'grey' : '#6200ea'} size="35" />}
            </button>
            <button
                onClick={onExportExcel}
                className="btn btn-outline-success"
                disabled={!hasData}
            >
                Exportar a Excel
            </button>
            <button
                onClick={onExportPDF}
                className="btn btn-outline-danger"
                disabled={!hasData}
            >
                Exportar a PDF
            </button>
        </div>
    );
};

export default ReportAction;