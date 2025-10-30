import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// 1. Aceptar 'chartData' como prop
const SalesVolumeChart = ({ chartData }) => {
  
  // 2. Usar los datos del prop directamente
  const data = chartData; 

  // --- OPCIONES DE DISEÑO (Estilo Oscuro) ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // <-- Mostrar leyenda para ver Culiacán, Mazatlán...
        position: 'top',
        labels: {
          color: '#e5e7eb', // Color de texto claro
        }
      },
      title: {
        display: true,
        text: 'Ventas Mensuales (Actual vs Anterior)', // <-- Título actualizado
        color: '#e5e7eb',
        font: { size: 16, weight: 'bold' },
        padding: { bottom: 20 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)', borderColor: '#4b5563' },
        ticks: { color: '#d1d5db' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)', borderColor: '#4b5563' },
        ticks: { color: '#d1d5db' },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96">
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesVolumeChart;