import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FaChartBar, FaSyncAlt } from 'react-icons/fa';
import { SalesService, ProductService } from '../service/Services';
Chart.register(...registerables);

const ProfitAnalysisDashboard = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');

  useEffect(() => {
    fetchData();
    fetchProducts();
  }, [dateRange]);

  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getAll();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener ventas
      const salesData = await SalesService.getAll();
      const filteredSales = salesData.filter(sale => {
        const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
        return saleDate >= dateRange.start && saleDate <= dateRange.end;
      });
      setSales(filteredSales);

      // Simular compras basadas en las ventas (para análisis de rentabilidad)
      const simulatedPurchases = simulatePurchases(filteredSales);
      setPurchases(simulatedPurchases);

    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función para simular compras basadas en las ventas
  const simulatePurchases = (salesData) => {
    // Agrupar ventas por producto
    const productSales = {};
    salesData.forEach(sale => {
      if (!productSales[sale.product_name]) {
        productSales[sale.product_name] = {
          quantity: 0,
          totalSales: 0
        };
      }
      productSales[sale.product_name].quantity += sale.quantity;
      productSales[sale.product_name].totalSales += sale.price * sale.quantity;
    });

    // Crear compras simuladas (asumiendo que compramos el 130% de lo vendido para tener stock)
    const simulatedPurchases = [];
    let idCounter = 1;

    for (const [productName, data] of Object.entries(productSales)) {
      // Precio de compra estimado (70% del precio de venta)
      const purchasePricePerUnit = (data.totalSales / data.quantity) * 0.7;

      simulatedPurchases.push({
        id: idCounter++,
        product_name: productName,
        supplier: "Proveedor Simulado",
        quantity: Math.ceil(data.quantity * 1.3), // Compramos 30% más de lo vendido
        unit_price: purchasePricePerUnit,
        date: dateRange.start, // Usamos la fecha inicial del rango
        status: "Simulado"
      });
    }

    // Añadir gastos operativos simulados (20% de las ventas totales)
    const totalSales = salesData.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
    const operationalExpenses = totalSales * 0.2;

    simulatedPurchases.push({
      id: idCounter++,
      product_name: "Gastos Operativos",
      supplier: "Varios",
      quantity: 1,
      unit_price: operationalExpenses,
      date: dateRange.start,
      status: "Gastos"
    });

    return simulatedPurchases;
  };

  // Filtrar datos basados en los filtros
  const filteredSales = sales.filter(sale => {
    const paymentMatch = filterPayment === 'all' || sale.payment_method.toLowerCase() === filterPayment.toLowerCase();
    const productMatch = filterProduct === 'all' || sale.product_name.toLowerCase() === filterProduct.toLowerCase();
    return paymentMatch && productMatch;
  });

  // Calcular métricas de rentabilidad
  const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);

  // Calcular costos basados en compras simuladas (solo productos, excluyendo gastos)
  const productPurchases = purchases.filter(p => p.status !== "Gastos");
  const totalCosts = productPurchases.reduce((sum, purchase) => sum + (purchase.unit_price * purchase.quantity), 0);

  // Calcular gastos operativos (los marcados como "Gastos")
  const operationalExpenses = purchases.find(p => p.status === "Gastos")?.unit_price || 0;

  const netProfit = totalSales - totalCosts - operationalExpenses;
  const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(2) : 0;

  // Preparar datos para gráficos
  const getChartData = () => {
    // Datos para gráfico de tendencia diaria
    const dailyData = {};
    filteredSales.forEach(sale => {
      const date = sale.created_at.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          sales: 0,
          profit: 0
        };
      }
      const productPurchase = productPurchases.find(p => p.product_name === sale.product_name);
      const cost = productPurchase ? (sale.quantity * productPurchase.unit_price) : 0;

      dailyData[date].sales += sale.price * sale.quantity;
      dailyData[date].profit += (sale.price * sale.quantity) - cost;
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
    const productNames = [...new Set(filteredSales.map(sale => sale.product_name))];

    const productPerformanceData = {
      labels: productNames,
      datasets: [
        {
          label: 'Ventas',
          data: productNames.map(name =>
            filteredSales.filter(s => s.product_name === name)
              .reduce((sum, sale) => sum + (sale.price * sale.quantity), 0)
          ),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Utilidad',
          data: productNames.map(name => {
            const productSales = filteredSales.filter(s => s.product_name === name);
            const productPurchase = productPurchases.find(p => p.product_name === name);
            const purchasePrice = productPurchase ? productPurchase.unit_price : 0;

            return productSales.reduce((sum, sale) =>
              sum + ((sale.price * sale.quantity) - (sale.quantity * purchasePrice)), 0);
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
        <div className="filters-section">
          <div className="filter-item">
            <label>Fecha inicio:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className='filter-item'>
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="filter-item">
            <label>Método de pago:</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className='desplegable'
            >
              <option value="all">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <div className="filter-item">
            <label>Producto:</label>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className='desplegable'
            >
              <option value="all">Todos los productos</option>
              {products.map(product => (
                <option key={product.id} value={product.product.toLowerCase()}>
                  {product.product}
                </option>
              ))}
            </select>
          </div>
          <button onClick={fetchData} className="btn">
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Cargando datos...</div>
      ) : (
        <>
          {/* Resumen */}
          <div className="summary-section">
            <div className="metric-card">
              <h3>Ventas Totales</h3>
              <p>${totalSales.toLocaleString()}</p>
            </div>
            <div className="metric-card">
              <h3>Costos de Productos</h3>
              <p>${totalCosts.toLocaleString()}</p>
            </div>
            <div className="metric-card">
              <h3>Gastos Operativos</h3>
              <p>${operationalExpenses.toLocaleString()}</p>
            </div>
            <div className="metric-card highlight">
              <h3>Utilidad Neta</h3>
              <p>${netProfit.toLocaleString()}</p>
            </div>
            <div className="metric-card highlight">
              <h3>Margen de Ganancia</h3>
              <p>{profitMargin}%</p>
            </div>
          </div>

          {/* Gráficos */}
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

          {/* Tabla detallada */}
          <div className="table-section">
            <h2>Detalle por Producto</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Ventas ($)</th>
                  <th>Cantidad</th>
                  <th>Costo Unitario</th>
                  <th>Utilidad</th>
                  <th>Margen</th>
                </tr>
              </thead>
              <tbody>
                {[...new Set(filteredSales.map(sale => sale.product_name))].map(productName => {
                  const productSales = filteredSales.filter(s => s.product_name === productName);
                  const totalProductSales = productSales.reduce((sum, sale) => sum + (sale.price * sale.quantity), 0);
                  const totalQuantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);

                  const productPurchase = productPurchases.find(p => p.product_name === productName);
                  const unitCost = productPurchase ? productPurchase.unit_price : 0;
                  const totalCost = unitCost * totalQuantity;
                  const profit = totalProductSales - totalCost;
                  const margin = totalProductSales > 0 ? ((profit / totalProductSales) * 100).toFixed(2) : 0;

                  return (
                    <tr key={productName}>
                      <td>{productName}</td>
                      <td>${totalProductSales.toLocaleString()}</td>
                      <td>{totalQuantity}</td>
                      <td>${unitCost.toFixed(2)}</td>
                      <td>${profit.toLocaleString()}</td>
                      <td>{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfitAnalysisDashboard;