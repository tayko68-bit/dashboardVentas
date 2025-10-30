import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// La URL de tu API
const API_URL = "https://script.google.com/macros/s/AKfycbzjJuw9uKVSfUGOvZ3o595GXvwLz-aqQoDqxxn_ncZxdMAuJyGaffodxHhP79SwC2lE/exec";

// --- INICIO DEL COMPONENTE ---
const DesgloseSucursal = ({ sucursal, onBackClick }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Llamar a la API con el filtro de sucursal
    fetch(`${API_URL}?sucursal=${encodeURIComponent(sucursal)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);

        // 2. Procesar los datos recibidos (porVendedor)
        const vendedores = Object.keys(data.porVendedor);
        const ventas = Object.values(data.porVendedor);

        setChartData({
          labels: vendedores,
          datasets: [
            {
              label: 'Ventas por Vendedor',
              data: ventas,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
          ],
        });
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [sucursal]); // Se ejecuta cada vez que la 'sucursal' cambia

  // --- Opciones del Gráfico de Barras ---
  const options = {
    indexAxis: 'y', // <-- Gráfico de barras horizontal (mejor para nombres)
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Desglose de Ventas: ${sucursal}`,
        color: '#e5e7eb',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#d1d5db' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#d1d5db' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
    },
  };

  // --- Renderizado del componente ---
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96 relative">
      {/* Botón para volver a la vista general */}
      <button 
        onClick={onBackClick}
        className="absolute top-4 left-6 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        &larr; Volver a General
      </button>

      {/* Contenedor del gráfico (con estados de carga/error) */}
      <div className="h-full pt-8">
        {isLoading && <p className="text-center text-gray-400">Cargando desglose...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {chartData && (
          <Bar options={options} data={chartData} />
        )}
      </div>
    </div>
  );
};

export default DesgloseSucursal;