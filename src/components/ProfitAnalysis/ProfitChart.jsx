import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ProfitChart = ({
    salesTrendData,
    productPerformanceData,
    dateRange
}) => {
    return (
        <div className="charts-section">
            <div className="chart-container">
                <h2>Tendencia de Ventas y Utilidad</h2>
                <Line
                    data={salesTrendData}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `Del ${dateRange.start} al ${dateRange.end}`
                            },
                        },
                    }}
                />
            </div>
            <div className="chart-container">
                <h2>Desempeño por Producto</h2>
                <Bar
                    data={productPerformanceData}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `Ventas vs Utilidad por Producto`
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ProfitChart;