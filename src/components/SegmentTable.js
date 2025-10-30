import React from 'react';

// Función de ayuda para formatear los números como moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const SegmentTable = ({ title, data }) => {
  // Encontramos el valor máximo para calcular el 100% de la barra
  const maxSales = Math.max(...data.map(item => item.sales));

  return (
    // Contenedor de la tarjeta
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      
      <div className="space-y-5">
        {data.map((item) => {
          // Calculamos el ancho de la barra como porcentaje
          const barWidth = (item.sales / maxSales) * 100;

          return (
            <div key={item.name}>
              {/* Encabezado: Nombre y Valor */}
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-md font-medium text-gray-300">{item.name}</span>
                <span className="text-md font-bold text-white">
                  {formatCurrency(item.sales)}
                </span>
              </div>
              {/* Barra de Progreso */}
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentTable;