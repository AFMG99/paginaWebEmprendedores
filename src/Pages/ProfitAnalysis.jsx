import React, { useState, useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';
import { SalesService, ProductService, PurchaseService, InputService } from '../service/Services';
import ProfitTable from '../components/ProfitAnalysis/ProfitTable';
import ProfitChart from '../components/ProfitAnalysis/ProfitChart';
import ProfitSummary from '../components/ProfitAnalysis/ProfitSummary';
import Swal from 'sweetalert2';
import Filters from '../components/ProfitAnalysis/Filters';

const ProfitAnalysis = () => {
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [products, setProducts] = useState([]);
    const [inputs, setInputs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [filterPayment, setFilterPayment] = useState('all');
    const [filterProduct, setFilterProduct] = useState('all');

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Obtener productos
            const productsData = await ProductService.getAll();
            setProducts(productsData);

            // 2. Obtener ventas en el rango de fechas
            const salesData = await SalesService.getAll();
            const filteredSales = salesData.filter(sale => {
                const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
                return saleDate >= dateRange.start && saleDate <= dateRange.end;
            });
            setSales(filteredSales);

            // 3. Obtener compras en el rango de fechas
            const purchasesData = await PurchaseService.getAll();
            const filteredPurchases = purchasesData.filter(purchase => {
                const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
                return purchaseDate >= dateRange.start && purchaseDate <= dateRange.end;
            });
            setPurchases(filteredPurchases);

            // 4. Obtener todos los insumos para calcular costos
            const inputsData = await InputService.getAll();
            setInputs(inputsData);

        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire("Error", "No se pudieron cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    // Calcular costos reales basados en insumos y compras
    const calculateRealCosts = () => {
        const productCosts = {};

        // 1. Para cada producto, obtener sus insumos asociados
        products.forEach(product => {
            const productInputs = inputs.filter(input => input?.product_id === product.id);

            productCosts[product.id] = {
                name: product.product,
                inputs: productInputs,
                costPerUnit: 0,
                totalCost: 0
            };

            let totalCost = 0;
            let totalQuantity = 0;

            // 2. Calcular costos reales basados en purchases
            const productPurchases = purchases.filter(purchase =>
                purchase.items.some(item => {
                    const input = inputs.find(i => i.id === item.input_id);
                    return input?.product_id === product.id;
                })
            );

            productPurchases.forEach(purchase => {
                purchase.items.forEach(item => {
                    const input = inputs.find(i => i.id === item.input_id);
                    if (input && input.product_id === product.id) {
                        totalCost += item.price * item.quantity;
                        totalQuantity += item.quantity;
                    }
                });
            });

            const costPerUnit = totalQuantity > 0 ? totalCost / totalQuantity : 0;

            productCosts[product.id].costPerUnit = costPerUnit;
            productCosts[product.id].totalCost = totalCost;
        });

        return productCosts;
    };


    // Filtrar datos basados en los filtros
    const filteredSales = sales.filter(sale => {
        const paymentMatch = filterPayment === 'all' || sale.payment_method.toLowerCase() === filterPayment.toLowerCase();
        const productMatch = filterProduct === 'all' || sale.product_id === Number(filterProduct);
        return paymentMatch && productMatch;
    });

    // Calcular métricas de rentabilidad
    const productCosts = calculateRealCosts();

    // Calcular ventas totales
    const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);

    // Calcular costos reales de los productos vendidos
    const totalCosts = filteredSales.reduce((sum, sale) => {
        let costPerUnit = 0;
        const productId = sale.product_id;

        const productPurchases = purchases.filter(purchase =>
            purchase.items.some(item => {
                const input = inputs.find(i => i.id === item.input_id);
                return input?.product_id === productId;
            })
        );

        productPurchases.forEach(purchase => {
            purchase.items.forEach(item => {
                const input = inputs.find(i => i.id === item.input_id);
                if (input.product_id === sale.product_id) {
                    costPerUnit = item.price * item.quantity;
                }
            });
        });

        return sum + costPerUnit;
    }, 0);

    // Calcular gastos operativos (compras no asociadas a productos)
    const operationalExpenses = purchases.reduce((sum, purchase) => {
        const isOperationalExpense = purchase.items.some(item => {
            const input = inputs.find(i => i.id === item.input_id);
            return !input?.product_id;
        });
        return isOperationalExpense ? sum + (purchase.total || 0) : sum;
    }, 0);

    const netProfit = totalSales - totalCosts - operationalExpenses;
    const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(2) : 0;

    // Preparar datos para gráficos
    const getChartData = () => {
        const dailyData = {};
        filteredSales.forEach(sale => {
            const date = sale.created_at.split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { sales: 0, profit: 0 };
            }

            let costPerUnit = 0;

            const productPurchases = purchases.filter(purchase =>
                purchase.items.some(item => {
                    const input = inputs.find(i => i.id === item.input_id);
                    return input?.product_id === sale.product_id;
                })
            );

            let totalCost = 0;
            let totalQuantity = 0;

            productPurchases.forEach(purchase => {
                purchase.items.forEach(item => {
                    const input = inputs.find(i => i.id === item.input_id);
                    if (input.product_id === sale.product_id) {
                        totalCost += item.price * item.quantity;
                        totalQuantity += item.quantity;
                    }
                });
            });

            if (totalQuantity > 0) {
                costPerUnit = totalCost;
            } else {
                const productInputs = inputs.filter(input => input.product_id === sale.product_id);
                costPerUnit = productInputs.reduce((sum, input) => sum + input.price, 0);
            }

            dailyData[date].sales += sale.price * sale.quantity;
            dailyData[date].profit += (sale.price * sale.quantity) - (costPerUnit);
        });

        const sortedDates = Object.keys(dailyData).sort();

        const salesTrendData = {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Ventas',
                    data: sortedDates.map(date => dailyData[date].sales),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Utilidad',
                    data: sortedDates.map(date => dailyData[date].profit),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.1
                }
            ]
        };

        // Datos para gráfico de productos
        const productNames = [...new Set(filteredSales.map(sale => {
            const product = products.find(p => p.id === sale.product_id);
            return product ? product.product : 'Desconocido';
        }))];

        const productPerformanceData = {
            labels: productNames,
            datasets: [
                {
                    label: 'Ventas',
                    data: productNames.map(name => {
                        const product = products.find(p => p.product === name);
                        return filteredSales
                            .filter(s => s.product_id === product?.id)
                            .reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
                    }),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                    label: 'Utilidad',
                    data: productNames.map(name => {
                        const product = products.find(p => p.product === name);
                        if (!product) return 0;

                        const sales = filteredSales.filter(s => s.product_id === product.id);

                        return sales.reduce((sum, sale) => {
                            const productId = sale.product_id;
                            let totalCost = 0;

                            const productPurchases = purchases.filter(purchase =>
                                purchase.items.some(item => {
                                    const input = inputs.find(i => i.id === item.input_id);
                                    return input?.product_id === productId;
                                })
                            );

                            productPurchases.forEach(purchase => {
                                purchase.items.forEach(item => {
                                    const input = inputs.find(i => i.id === item.input_id);
                                    if (input?.product_id === productId) {
                                        totalCost = item.price * item.quantity;
                                    }
                                });
                            });

                            const costPerUnit = totalCost;
                            const saleRevenue = sale.price * sale.quantity;

                            return sum + (saleRevenue - costPerUnit);
                        }, 0);
                    }),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                }
            ]
        };

        return { salesTrendData, productPerformanceData };
    };

    const { salesTrendData, productPerformanceData } = getChartData();

    return (
        <div className="dashboard-container w-100">
            <div className='d-flex align-items-center'>
                <h2 className='text-titulo'><FaChartBar /> Análisis de Rentabilidad</h2>

                {/* Filtros */}
                <Filters
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    filterPayment={filterPayment}
                    setFilterPayment={setFilterPayment}
                    filterProduct={filterProduct}
                    setFilterProduct={setFilterProduct}
                    products={products}
                    fetchData={fetchData}
                />
            </div>

            {loading ? (
                <div className="text-center py-4">Cargando datos...</div>
            ) : (
                <>
                    {/* Resumen */}
                    <ProfitSummary
                        totalSales={totalSales}
                        totalCosts={totalCosts}
                        operationalExpenses={operationalExpenses}
                        netProfit={netProfit}
                        profitMargin={profitMargin}
                    />

                    {/* Gráficos */}
                    <ProfitChart
                        salesTrendData={salesTrendData}
                        productPerformanceData={productPerformanceData}
                        dateRange={dateRange}
                    />

                    {/* Tabla detallada */}
                    <ProfitTable
                        products={products}
                        filteredSales={filteredSales}
                        productCosts={productCosts}
                    />
                </>
            )}
        </div>
    );
};

export default ProfitAnalysis;