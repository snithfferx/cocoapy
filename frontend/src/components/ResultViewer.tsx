import { useEffect, useState } from "react";

export default function ResultViewer() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return <p className="text-gray-500">No hay resultados disponibles.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Resultados del análisis</h2>
      <p>Colonias detectadas: <strong>{result.count}</strong></p>
      {/* Puedes mostrar más detalles si están disponibles */}
      {result.details && (
        <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
          {result.details.map((d: string, i: number) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
