import React, { useState, useEffect, useMemo } from 'react';
import KPICard from './components/KPICard';
import SalesVolumeChart from './components/SalesVolumeChart';
import ContributionChart from './components/ContributionChart'; 
import './index.css';

const API_URL = "https://script.google.com/macros/s/AKfycbzjJuw9uKVSfUGOvZ3o595GXvwLz-aqQoDqxxn_ncZxdMAuJyGaffodxHhP79SwC2lE/exec";

// --- INICIO DE TU COMPONENTE APP ---
function App() {

  // --- 1. DEFINIR AÑOS DINÁMICOS ---
  const currentYear = new Date().getFullYear(); // 2025
  const previousYear = currentYear - 1; // 2024
  // ---------------------------------

  // --- Funciones de Ayuda (Definidas dentro de App) ---
  const sumColumn = (data, column) => {
    return data.reduce((acc, row) => acc + (Number(row[column]) || 0), 0);
  };
  
  const calculateChange = (actual, anterior) => {
    if (anterior === 0 || anterior == null) return 0;
    const change = ((actual - anterior) / anterior) * 100;
    return Math.round(change * 10) / 10;
  };
  // ------------------------------------

  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setApiData(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []); // El array de dependencias de useEffect está vacío a propósito

  const dashboardData = useMemo(() => {
    if (apiData.length === 0) return null;
    const filteredData = apiData.filter(row => 
      (Number(row.Culiacan_Actual) || 0) > 0 ||
      (Number(row.Mazatlan_Actual) || 0) > 0 ||
      (Number(row.Herramientas_Actual) || 0) > 0
    );
    
    // Cálculos
    const totalCuliacan = sumColumn(filteredData, 'Culiacan_Actual');
    const totalCuliacanAnterior = sumColumn(filteredData, 'Culiacan_Anterior');
    const culiacanChange = calculateChange(totalCuliacan, totalCuliacanAnterior);
    
    const totalMazatlan = sumColumn(filteredData, 'Mazatlan_Actual');
    const totalMazatlanAnterior = sumColumn(filteredData, 'Mazatlan_Anterior');
    const mazatlanChange = calculateChange(totalMazatlan, totalMazatlanAnterior);
    
    const totalHerramientas = sumColumn(filteredData, 'Herramientas_Actual');
    const totalHerramientasAnterior = sumColumn(filteredData, 'Herramientas_Anterior');
    const herramientasChange = calculateChange(totalHerramientas, totalHerramientasAnterior);
    
    const totalVentas = totalCuliacan + totalMazatlan + totalHerramientas;
    const totalVentasAnterior = totalCuliacanAnterior + totalMazatlanAnterior + totalHerramientasAnterior;
    const ventasChange = calculateChange(totalVentas, totalVentasAnterior);
    
    const labels = apiData.map(row => row.Mes);
    
    // --- 2. ACTUALIZAR ETIQUETAS DEL GRÁFICO ---
    const lineChartData = {
      labels: labels,
      datasets: [
        { label: `Culiacán (${currentYear})`, data: apiData.map(row => Number(row.Culiacan_Actual) || 0), borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 },
        { label: `Mazatlán (${currentYear})`, data: apiData.map(row => Number(row.Mazatlan_Actual) || 0), borderColor: 'rgb(16, 185, 129)', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4 },
        { label: `Culiacán (${previousYear})`, data: apiData.map(row => Number(row.Culiacan_Anterior) || 0), borderColor: 'rgb(59, 130, 246)', borderDash: [5, 5], fill: false, tension: 0.4 },
        { label: `Mazatlán (${previousYear})`, data: apiData.map(row => Number(row.Mazatlan_Anterior) || 0), borderColor: 'rgb(16, 185, 129)', borderDash: [5, 5], fill: false, tension: 0.4 },
      ]
    };
    if (apiData[0].Herramientas_Actual !== undefined) {
      lineChartData.datasets.push({ label: `Herramientas (${currentYear})`, data: apiData.map(row => Number(row.Herramientas_Actual) || 0), borderColor: 'rgb(249, 115, 22)', backgroundColor: 'rgba(249, 115, 22, 0.1)', fill: true, tension: 0.4 });
      lineChartData.datasets.push({ label: `Herramientas (${previousYear})`, data: apiData.map(row => Number(row.Herramientas_Anterior) || 0), borderColor: 'rgb(249, 115, 22)', borderDash: [5, 5], fill: false, tension: 0.4 });
    }
    // ----------------------------------------

    const segmentTableData = [
      { name: 'Culiacán', sales: totalCuliacan },
      { name: 'Mazatlán', sales: totalMazatlan },
      { name: 'Herramientas', sales: totalHerramientas },
    ];
    
    return { 
      totalVentas, ventasChange, totalCuliacan, culiacanChange, totalMazatlan, mazatlanChange, totalHerramientas, herramientasChange, lineChartData, segmentTableData,
      totalVentasAnterior, totalCuliacanAnterior, totalMazatlanAnterior, totalHerramientasAnterior
    };

  }, [apiData, calculateChange, sumColumn, currentYear, previousYear]); // <-- Añadimos los años a las dependencias

  // --- Estados de Carga y Error ---
  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 p-8 text-white text-center text-2xl">Cargando datos...</div>;
  }
  if (error || !dashboardData) {
    return <div className="min-h-screen bg-gray-900 p-8 text-red-500 text-center text-2xl">Error: {error || "No se pudieron procesar los datos."}</div>;
  }

  // --- Renderizar el Dashboard ---
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      
      <h1 className="text-4xl font-extrabold text-white mb-10">
        TORNICENTER DE MÉXICO 2025 
      </h1>
      
      {/* --- 3. PASAR EL AÑO ANTERIOR A LAS TARJETAS --- */}
      <div className="flex flex-wrap gap-6 justify-start mb-6">
        <KPICard 
          title="Culiacán (YTD)" 
          value={dashboardData.totalCuliacan.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          unit="$" 
          change={dashboardData.culiacanChange}
          changeType={dashboardData.culiacanChange >= 0 ? "positive" : "negative"}
          previousValue={dashboardData.totalCuliacanAnterior}
          previousYear={previousYear} // <-- Prop nueva
        />
        <KPICard 
          title="Mazatlán (YTD)" 
          value={dashboardData.totalMazatlan.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          unit="$" 
          change={dashboardData.mazatlanChange}
          changeType={dashboardData.mazatlanChange >= 0 ? "positive" : "negative"}
          previousValue={dashboardData.totalMazatlanAnterior}
          previousYear={previousYear} // <-- Prop nueva
        />
        <KPICard 
          title="Herramientas (YTD)" 
          value={dashboardData.totalHerramientas.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          unit="$" 
          change={dashboardData.herramientasChange}
          changeType={dashboardData.herramientasChange >= 0 ? "positive" : "negative"}
          previousValue={dashboardData.totalHerramientasAnterior}
          previousYear={previousYear} // <-- Prop nueva
        />
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-6 justify-start mb-6">
        
        <div className="w-full lg:w-2/3">
          <SalesVolumeChart chartData={dashboardData.lineChartData} />
        </div>
        
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          <KPICard 
            title="Ventas Globales (YTD)" 
            value={dashboardData.totalVentas.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            unit="$" 
            change={dashboardData.ventasChange}
            changeType={dashboardData.ventasChange >= 0 ? "positive" : "negative"}
            previousValue={dashboardData.totalVentasAnterior}
            previousYear={previousYear} // <-- Prop nueva
          />

          <ContributionChart data={dashboardData.segmentTableData} />

        </div>
      </div>
      
    </div>
  );
}

export default App;