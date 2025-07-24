import { Link } from "react-router-dom"; // Si usas routing
import LoginModal from "./LoginModal";
import { useState } from "react";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<string | null>(null);
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
          {user ? (
            <span className="text-sm">👤 {user}</span>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(username) => setUser(username)}
        />
      )}
    </nav>
  );
}

export default Navbar;
