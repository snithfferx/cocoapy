import { useEffect, useState } from "react";

function Results() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suponiendo que guardas el resultado en el backend o lo recibes directamente
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:8000/results"); // Ajusta endpoint si es necesario
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error al obtener resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Resultados del análisis</h2>

      {loading ? (
        <p className="text-gray-500">Cargando resultados...</p>
      ) : results ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg font-medium">
            Colonias detectadas:{" "}
            <span className="text-blue-600 font-bold">{results.count}</span>
          </p>
          {/* Puedes agregar más detalles si tu API lo devuelve */}
          {results.details && (
            <ul className="mt-4 text-sm text-gray-700 list-disc list-inside">
              {results.details.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-red-500">No se encontraron resultados o hubo un error en el análisis.</p>
      )}
    </div>
  );
}

export default Results;
