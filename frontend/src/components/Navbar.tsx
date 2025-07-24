import { Link } from "react-router-dom"; // Si usas routing

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo o título */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          🧫 ColonyCounter
        </Link>

        {/* Navegación */}
        <div className="space-x-6">
          <Link to="/upload" className="hover:text-gray-300">Subir imagen</Link>
          <Link to="/results" className="hover:text-gray-300">Resultados</Link>
          <Link to="/about" className="hover:text-gray-300">Acerca de</Link>
        </div>

        {/* Botón de login */}
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300">
            Iniciar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
