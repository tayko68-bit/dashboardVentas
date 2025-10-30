import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ContributionChart = ({ data }) => {
  // Preparamos los datos para el gráfico de dona
  const chartData = {
    labels: data.map(item => item.name), // Culiacán, Mazatlán, etc.
    datasets: [
      {
        label: 'Ventas',
        data: data.map(item => item.sales), // Los valores de ventas
        backgroundColor: [
          'rgb(59, 130, 246)',  // Azul (para Culiacán)
          'rgb(16, 185, 129)',   // Verde (para Mazatlán)
          'rgb(249, 115, 22)', // Naranja (para Herramientas)
          '#6b7280', // Gris
        ],
        borderColor: '#1f2937', // Color del fondo para el borde
        borderWidth: 2,
      },
    ],
  };

 const options = {
    responsive: true,
    maintainAspectRatio: false, 
    
    // 1. ANTES: cutout: '60%' -> AHORA: '50%' (anillo más grueso)
    cutout: '50%', 

    plugins: {
      legend: {
        position: 'bottom', 
        labels: {
          color: '#e5e7eb', 
          
          // 2. ANTES: padding: 20 -> AHORA: 10 (menos espacio entre items)
          padding: 10, 
        },
      },
      title: {
        display: true,
        text: 'Mix de Ventas (YTD)',
        color: '#e5e7eb',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 15,
        },
      },
    },
  };

  return (
    // Contenedor de la tarjeta (quitamos altura fija)
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ContributionChart;