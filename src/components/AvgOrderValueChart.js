import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js necesarios
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const AvgOrderValueChart = ({ value, goal }) => {
  // --- DATOS (Mock) ---
  const currentValue = value;
  const goalValue = goal;
  const remainingValue = goalValue - currentValue;

  const data = {
    labels: ['Current AOV', 'Remaining to Goal'],
    datasets: [
      {
        data: [currentValue, remainingValue],
        backgroundColor: [
          'rgb(52, 211, 153)', // Verde para el valor actual
          '#374151',           // Gris oscuro para el restante
        ],
        borderColor: [
          'rgb(52, 211, 153)',
          '#374151',
        ],
        borderWidth: 1,
        circumference: 180, // Media dona
        rotation: 270,      // Empezar desde abajo
      },
    ],
  };

  // --- OPCIONES DE DISEÑO (Estilo Oscuro) ---
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // El grosor de la dona
    plugins: {
      legend: {
        display: false, // Ocultar leyenda
      },
      title: {
        display: true,
        text: 'Avg. Order Value',
        color: '#e5e7eb',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 5,
        },
      },
    },
  };

  return (
    // Contenedor de la tarjeta del gráfico
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96 relative">
      <Doughnut data={data} options={options} />
      {/* Texto superpuesto en el centro */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pt-16">
        <p className="text-5xl font-extrabold text-white">
          ${currentValue}
        </p>
        <p className="text-sm text-gray-400">Goal: ${goalValue}</p>
      </div>
    </div>
  );
};

export default AvgOrderValueChart;