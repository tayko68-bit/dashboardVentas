import React from 'react';

// --- HEMOS ELIMINADO LA FUNCIÓN 'formatShortCurrency' ---

const KPICard = ({ title, value, unit, change, changeType, previousValue }) => {
  const changeColor = changeType === 'positive' ? 'text-green-400' : 'text-red-400';
  const arrow = changeType === 'positive' ? '▲' : '▼';

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex-1 min-w-[280px]">
      
      <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-400">{title}</h3>
      
      <div className="flex items-baseline mt-2">
        <p className="text-4xl font-extrabold text-white">
          {/* El 'value' ya viene formateado (sin decimales) desde App.js */}
          {unit}{value}
        </p>
        
        {change != null && (
          <p className={`ml-4 text-lg font-bold ${changeColor}`}>
            {arrow} {Math.abs(change)}%
          </p>
        )}
      </div>
      
      {/* --- ESTA ES LA LÍNEA MODIFICADA --- */}
      {previousValue != null && (
        <p className="text-xs text-gray-500 mt-1">
          {/* Formateamos el número completo aquí, 
            igual que en App.js, y añadimos el signo '$' 
          */}
          vs ${previousValue.toLocaleString('es-MX', { maximumFractionDigits: 0 })} (Año Ant. YTD)
        </p>
      )}
      {/* ---------------------------------- */}

    </div>
  );
};

export default KPICard;