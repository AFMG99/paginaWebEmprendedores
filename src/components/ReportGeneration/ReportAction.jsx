import React from 'react';
import { MdOutlineVisibilityOff, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { PiFilePdfDuotone } from "react-icons/pi";

const ReportAction = ({ onExportExcel, onExportPDF, onPreview, previewMode, hasData }) => {
    return (
        <div className="d-flex justify-content-center gap-3 mb-2 mt-2">
            <button
                onClick={onPreview}
                className={`btn ${previewMode ? 'btn' : 'btn'}`}
                disabled={!hasData}
            >
                {previewMode ? <MdVisibilityOff color='#514660' size="35" /> :
                    <MdVisibility color={!hasData ? 'grey' : '#6200ea'} size="35" />}
            </button>
            <button
                onClick={onExportExcel}
                className="btn"
                disabled={!hasData}
            >
                {previewMode ? <RiFileExcel2Fill color='#4CAF50' size="35" /> :
                    <RiFileExcel2Fill color={!hasData ? 'grey' : '#4CAF50'} size="35" />}
            </button>
            <button
                onClick={onExportPDF}
                className="btn"
                disabled={!hasData}
            >
                {previewMode ? <PiFilePdfDuotone color='#F44336' size="35" /> :
                    <PiFilePdfDuotone color={!hasData ? 'grey' : '#F44336'} size="35" />}
            </button>
        </div>
    );
};

export default ReportAction;