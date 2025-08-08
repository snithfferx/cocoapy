import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos de ejemplo para el gráfico de población
// En una aplicación real, estos datos vendrían de tu backend
const populationData = [
  { name: 'Día 1', population: 400 },
  { name: 'Día 2', population: 450 },
  { name: 'Día 3', population: 420 },
  { name: 'Día 4', population: 500 },
  { name: 'Día 5', population: 550 },
  { name: 'Día 6', population: 530 },
  { name: 'Día 7', population: 600 },
  { name: 'Día 8', population: 580 },
  { name: 'Día 9', population: 650 },
  { name: 'Día 10', population: 700 },
];

const Dashboard = () => {
  // Datos de ejemplo para las métricas
  const numberOfSamples = 125;
  const globalPopulation = 7500; // Total de colonias contadas
  const populationMean = (globalPopulation / numberOfSamples).toFixed(2); // Media de colonias por muestreo

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Dashboard Header */}
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">Panel de Control de Colonias de Algas</h1>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-lg p-3 text-center text-lg sm:text-xl font-semibold shadow-md">
            Resumen General del Análisis de Algas
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">Métricas Clave</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Número de Muestreos */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-gray-600 text-base sm:text-lg mb-2">Número de Muestreos:</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-700">{numberOfSamples}</div>
            </div>

            {/* Población Global */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-gray-600 text-base sm:text-lg mb-2">Población Global (Colonias):</div>
              <div className="text-3xl sm:text-4xl font-bold text-green-700">{globalPopulation}</div>
            </div>

            {/* Media Poblacional */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="text-gray-600 text-base sm:text-lg mb-2">Media Poblacional (Colonias/Muestreo):</div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-700">{populationMean}</div>
            </div>
          </div>
        </div>

        {/* Population Growth/Decrease Chart Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">Tendencia de Crecimiento de la Población</h2>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={populationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: '#4a5568' }} />
                <YAxis tick={{ fill: '#4a5568' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: '#2d3748', fontWeight: 'bold' }}
                  itemStyle={{ color: '#4a5568' }}
                />
                <Line type="monotone" dataKey="population" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons (Optional, similar to previous component) */}
        <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
            Ver Detalles de Muestreos
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;