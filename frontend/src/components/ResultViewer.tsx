// import { useNavigate } from "react-router-dom";

interface QuadrantDetail {
  id: number;
  colonies: number;
  segments: {
    value: number;
    imagePath: string; // Ruta de la imagen para cada segmento
  }[];
}

interface AnalysisData {
  averageColonies: number;
  overviewQuadrants: {
    id: number;
    colonies: number;
    imagePath: string; // Ruta de la imagen para el cuadrante general
  }[];
  sampleName: string;
  detailedQuadrants: QuadrantDetail[];
  totalQuadrants: number;
  totalColonies: number;
  maxColoniesPerQuadrant: number;
  minColoniesPerQuadrant: number;
}

// Componente AnalysisResults (sin cambios en su lógica principal, solo en la prop onNewAnalysis)
interface AnalysisResultsProps {
  analysisData: AnalysisData;
  onNewAnalysis: () => void; // Prop para el botón "Nuevo Análisis"
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisData, onNewAnalysis }) => {
  const {
    averageColonies,
    overviewQuadrants,
    sampleName,
    detailedQuadrants,
    totalQuadrants,
    totalColonies,
    maxColoniesPerQuadrant,
    minColoniesPerQuadrant,
  } = analysisData;

  // const navigate = useNavigate();

  // const handleNewAnalysisClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   console.log('Button clicked, attempting navigation to /upload');
  //   console.log('Calling navigate...');
  //   navigate('/upload');
  //   console.log('Navigate called successfully');
  // };

  // console.log('Rendering AnalysisResults component');

  return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">Resultados del Análisis</h1>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg p-3 text-center text-lg sm:text-xl font-semibold shadow-md">
              Promedio de Colonias: {averageColonies}
            </div>
          </div>

          {/* Overview Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Vista General</h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-2 p-2 border-2 border-red-500 max-w-sm w-full">
                {overviewQuadrants.map((quadrant) => (
                  <div key={quadrant.id} className="relative border border-gray-300 flex items-center justify-center bg-gray-50 aspect-square">
                    <img src={quadrant.imagePath} alt={`Quadrant ${quadrant.id} Content`} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <span className="relative z-10 bg-white text-gray-900 px-2 py-1 rounded text-sm font-semibold shadow">{quadrant.colonies}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details by Quadrant Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Detalles por Cuadrante para {sampleName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {detailedQuadrants.map((quadrant) => (
                <div key={quadrant.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Cuadrante {quadrant.id}</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">{quadrant.colonies} colonias</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-1 border-2 border-red-500">
                    {quadrant.segments.map((segment, index) => (
                      <div key={index} className="relative border border-gray-300 flex items-center justify-center bg-gray-100 aspect-square">
                        <img src={segment.imagePath} alt={`Detail ${quadrant.id}-${index}`} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        <span className="relative z-10 bg-white text-gray-900 px-1 py-0.5 rounded text-xs font-semibold shadow">{segment.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-600 text-sm mb-1">Total de Cuadrantes:</div>
                <div className="text-xl font-bold text-gray-800">{totalQuadrants}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-600 text-sm mb-1">Colonias Totales:</div>
                <div className="text-xl font-bold text-gray-800">{totalColonies}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-600 text-sm mb-1">Máximo por Cuadrante:</div>
                <div className="text-xl font-bold text-gray-800">{maxColoniesPerQuadrant}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-600 text-sm mb-1">Mínimo por Cuadrante:</div>
                <div className="text-xl font-bold text-gray-800">{minColoniesPerQuadrant}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out" onClick={onNewAnalysis}>
              Nuevo Análisis
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
              Imprimir Resultados
            </button>
          </div>
        </div>
      </div>
  );
}

export default AnalysisResults;