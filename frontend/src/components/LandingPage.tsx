import { Link } from "react-router-dom";

function LandingPage (){
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-br from-gray-200 to-gray-300">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        🧫 Colony Counter
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Analiza imágenes de laboratorio y cuenta colonias con precisión usando procesamiento avanzado en Python.
      </p>
      <Link
        to="/upload"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300"
      >
        Empezar ahora
      </Link>
    </section>
  );
}

export default LandingPage;