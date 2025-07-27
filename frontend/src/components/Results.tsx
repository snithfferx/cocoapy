import { useEffect, useState } from "react";

export default function ImageResults() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Resultados del análisis
        </h2>

        {result ? (
          <>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg text-gray-700">
                Colonias detectadas:{" "}
                <span className="text-green-600 font-semibold text-xl">
                  {result.count}
                </span>
              </p>

              {result.image_url && (
                <img
                  src={result.image_url}
                  alt="Resultado del análisis"
                  className="max-w-full rounded border border-gray-300"
                />
              )}

              {result.details && (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {result.details.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            No hay resultados disponibles. Sube una imagen para comenzar.
          </p>
        )}
      </div>
    </section>
  );
}
