import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ReportTable from '../components/ReportGeneration/reportTable';
import ReportForm from '../components/ReportGeneration/ReportForm';
import ReportAction from '../components/ReportGeneration/ReportAction';
import { SalesService, PurchaseService, ProductService, InputService } from '../service/Services';
import Swal from 'sweetalert2';

const Reports = () => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        reportType: ''
    })
    const [salesData, setSalesData] = useState([]);
    const [purchasesData, setPurchasesData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [inputsData, setInputsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [sales, purchases, products, inputs] = await Promise.all([
                SalesService.getAll(),
                PurchaseService.getAll(),
                ProductService.getAll(),
                InputService.getAll()
            ]);

            setSalesData(sales);
            setPurchasesData(purchases);
            setInputsData(inputs);
            setProductsData(products);
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos iniciales', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        setLoading(true);
        try {
            const { startDate, endDate, reportType } = filters;

            // Filtrar por fecha
            const filteredByDate = (data, dateField) => {
                return data.filter(item => {
                    const itemDate = new Date(item[dateField]).toISOString().split('T')[0];
                    return itemDate >= startDate && itemDate <= endDate;
                });
            };

            switch (reportType) {
                case 'ventas':
                    const sales = filteredByDate(salesData, 'created_at');
                    setColumns([
                        { header: 'Fecha', accessor: 'created_at', format: (val) => new Date(val).toLocaleDateString() },
                        {
                            header: 'Producto', accessor: 'product_id', format: (val) => {
                                const product = productsData.find(p => p.id === val);
                                return product ? product.product : 'Desconocido';
                            }
                        },
                        {
                            header: 'Descripción', accessor: 'product_id', format: (val) => {
                                const product = productsData.find(p => p.id === val);
                                return product ? product.description : 'Desconocido';
                            }
                        },
                        { header: 'Precio', accessor: 'price', format: (val) => `$${val.toLocaleString()}` },
                        { header: 'Cantidad', accessor: 'quantity' },
                        { header: 'Total', accessor: 'total', format: (val) => `$${val.toLocaleString()}` },
                        { header: 'Método de Pago', accessor: 'payment_method' }
                    ]);
                    setFilteredData(sales.map(sale => ({
                        ...sale,
                        total: sale.price * sale.quantity
                    })));
                    break;

                case 'compras':
                    const purchases = filteredByDate(purchasesData, 'date');
                    const formattedPurchases = purchases.map(purchase => {
                        return purchase.items.map(item => {
                            const input = inputsData.find(i => i.id === item.input_id);

                            return {
                                id: `${purchase.id}-${item.input_id}`,
                                date: purchase.date,
                                input_id: item.input_id,
                                input_name: input?.name || 'Desconocido',
                                provider_name: purchase.provider_name || 'No especificado',
                                quantity: item.quantity,
                                unit_price: item.price,
                                total: item.price * item.quantity,
                                payment_method: purchase.payment_method || 'No especificado'
                            };
                        });
                    }).flat();

                    setColumns([
                        { header: 'Fecha', accessor: 'date', format: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
                        { header: 'Insumo', accessor: 'input_name' },
                        { header: 'Proveedor', accessor: 'provider_name' },
                        { header: 'Cantidad', accessor: 'quantity', format: (val) => val.toLocaleString() },
                        { header: 'Precio Unitario', accessor: 'unit_price', format: (val) => `$${val.toLocaleString()}` },
                        { header: 'Total', accessor: 'total', format: (val) => `$${val.toLocaleString()}` },
                        { header: 'Método de Pago', accessor: 'payment_method' }
                    ]);

                    setFilteredData(formattedPurchases);
                    break;

                case 'rentabilidad':
                    const calculateProfitData = (startDate, endDate) => {
                        // Filtrar ventas y compras por fecha
                        const filteredSales = salesData.filter(sale => {
                            const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
                            return saleDate >= startDate && saleDate <= endDate;
                        });

                        const filteredPurchases = purchasesData.filter(purchase => {
                            const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
                            return purchaseDate >= startDate && purchaseDate <= endDate;
                        });

                        // Calcular rentabilidad por producto
                        const productProfit = {};

                        filteredSales.forEach(sale => {
                            const productId = sale.product_id;
                            const product = productsData.find(p => p.id === productId);
                            const productName = product ? product.product : 'Desconocido';

                            if (!productProfit[productId]) {
                                productProfit[productId] = {
                                    productName,
                                    totalSales: 0,
                                    totalCosts: 0
                                };
                            }

                            // Calcular ventas
                            productProfit[productId].totalSales += sale.price * sale.quantity;

                            // Calcular costos (simplificado - deberías implementar la lógica completa de la pantalla de rentabilidad)
                            const relatedPurchases = filteredPurchases.filter(purchase =>
                                purchase.items.some(item => {
                                    const input = inputsData.find(i => i.id === item.input_id);
                                    return input?.product_id === productId;
                                })
                            );

                            let productCost = 0;
                            relatedPurchases.forEach(purchase => {
                                purchase.items.forEach(item => {
                                    const input = inputsData.find(i => i.id === item.input_id);
                                    if (input?.product_id === productId) {
                                        productCost = item.price * item.quantity;
                                    }
                                });
                            });

                            productProfit[productId].totalCosts += productCost;
                        });

                        // Convertir a array y calcular métricas adicionales
                        return Object.values(productProfit).map(item => ({
                            ...item,
                            grossProfit: item.totalSales - item.totalCosts,
                            profitMargin: ((item.totalSales - item.totalCosts) / item.totalSales * 100).toFixed(2)
                        }));
                    };
                    const profitData = calculateProfitData(startDate, endDate);
                    setFilteredData(profitData);
                    break;

                default:
                    setFilteredData([]);
            }

        } catch (error) {
            console.error('Error generating report:', error);
            Swal.fire('Error', 'No se pudo generar el reporte', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        if (filteredData.length === 0) {
            Swal.fire('Advertencia', 'No hay datos para mostrar', 'warning');
            return;
        }
        setPreviewMode(!previewMode);
    };

    const resetReportData = () => {
        setFilteredData([]);
        setColumns([]);
        setPreviewMode(false);
    }

    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            Swal.fire('Advertencia', 'No hay datos para exportar', 'warning');
            return;
        }

        try {
            let dataToExport = [];

            if (filters.reportType === 'rentabilidad') {
                dataToExport = filteredData.map(item => ({
                    'Producto': item.productName,
                    'Ventas Totales': item.totalSales,
                    'Costos Totales': item.totalCosts,
                    'Utilidad Bruta': item.grossProfit,
                    'Margen de Ganancia': `${item.profitMargin}%`
                }));
            } else {
                dataToExport = filteredData.map(item => {
                    const row = {};
                    columns.forEach(col => {
                        row[col.header] = col.format ? col.format(item[col.accessor]) : item[col.accessor];
                    });
                    return row;
                });
            }

            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte");

            // Generar nombre de archivo con el tipo de reporte y fecha
            const reportName = `Reporte_${filters.reportType}_${new Date().toISOString().split('T')[0]}`;
            XLSX.writeFile(wb, `${reportName}.xlsx`);

            Swal.fire('Éxito', 'Reporte exportado a Excel correctamente', 'success');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            Swal.fire('Error', 'No se pudo exportar a Excel', 'error');
        }
    };

    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            Swal.fire('Advertencia', 'No hay datos para exportar', 'warning');
            return;
        }

        try {
            const doc = new jsPDF();
            const reportTitle = `Reporte de ${filters.reportType.toUpperCase()}`;
            const dateRangeText = `Del ${filters.startDate} al ${filters.endDate}`;

            // Agregar título
            doc.setFontSize(18);
            doc.text(reportTitle, 14, 15);
            doc.setFontSize(12);
            doc.text(dateRangeText, 14, 22);

            // Preparar datos para la tabla
            let headers = [];
            let rows = [];

            if (filters.reportType === 'rentabilidad') {
                headers = ['Producto', 'Ventas Totales', 'Costos Totales', 'Utilidad Bruta', 'Margen'];
                rows = filteredData.map(item => [
                    item.productName,
                    `$${item.totalSales.toLocaleString()}`,
                    `$${item.totalCosts.toLocaleString()}`,
                    `$${item.grossProfit.toLocaleString()}`,
                    `${item.profitMargin}%`
                ]);
            } else {
                headers = columns.map(col => col.header);
                rows = filteredData.map(item =>
                    columns.map(col => col.format ? col.format(item[col.accessor]) : item[col.accessor])
                );
            }

            // Agregar tabla
            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: 30,
                styles: {
                    fontSize: 9,
                    cellPadding: 2,
                    halign: 'center'
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                }
            });

            // Guardar PDF
            const reportName = `Reporte_${filters.reportType}_${new Date().toISOString().split('T')[0]}`;
            doc.save(`${reportName}.pdf`);

            Swal.fire('Éxito', 'Reporte exportado a PDF correctamente', 'success');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            Swal.fire('Error', 'No se pudo exportar a PDF', 'error');
        }
    };

    return (
        <div>
            <h2 className='text-center text-titulo'>Generación de Informes</h2>
            <ReportForm
                filters={filters}
                setFilters={setFilters}
                onGenerateReport={handleGenerateReport}
                resetReportData={resetReportData}
            />

            <ReportTable
                data={filteredData}
                columns={columns}
                reportType={filters.reportType}
                previewMode={previewMode}
            />

            <ReportAction
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                onPreview={handlePreview}
                previewMode={previewMode}
                hasData={filteredData.length > 0}
            />
        </div>
    );
};

export default Reports;