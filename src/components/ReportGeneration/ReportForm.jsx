import React from 'react';
import { AiOutlineCloudSync } from "react-icons/ai";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { useAuth } from '../../context/AuthContext';

const ReportForm = ({ filters, setFilters, onGenerateReport, resetReportData }) => {
    const { user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'reportType') {
            resetReportData();
        }

        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!filters.startDate || !filters.endDate || !filters.reportType) {
            alert('Por favor complete todos los campos');
            return;
        }
        onGenerateReport();
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
            <div className='d-flex align-items-center gap-4'>
                <div className='col-md-3 filter-item m-0'>
                    <label>Fecha Inicio</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-md-3 filter-item m-0'>
                    <label>Fecha Fin</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='col-md-4 filter-item m-0'>
                    <label>Tipo de Reporte</label>
                    <select
                        className="desplegable"
                        name="reportType"
                        value={filters.reportType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Elija el Tipo de Informe...</option>
                        <option value="ventas">Ventas</option>
                        <option value="compras">Compras</option>
                        {user?.role === "Admin" && (
                            <option value="rentabilidad">Rentabilidad</option>
                        )}
                    </select>
                </div>
                <div className='col-md-1 d-flex align-items-end'>
                    <button
                        type="submit"
                        className="btn w-100"
                        style={{ border: 'none' }}
                    >
                        {/* <HiOutlineDocumentDuplicate
                            color={(!filters.startDate || !filters.endDate || !filters.reportType) ? 'grey' : '#6200ea'}
                            size="30"
                        /> */}
                        <AiOutlineCloudSync
                            color={(!filters.startDate || !filters.endDate || !filters.reportType) ? 'grey' : '#6200ea'}
                            size="30"
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ReportForm;