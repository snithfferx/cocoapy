import { Link } from "react-router-dom"; // Si usas routing
import LoginModal from "./LoginModal";
import { useState } from "react";
import { useAuth } from './AuthContext';


function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const {user, isAuthenticated, isAdmin, logout} = useAuth();

  const handleLogout = () => {
    logout();
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo o título */}
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          🧫 ColonyCounter
        </Link>

        {/* Navegación */}
        <div className="space-x-6">
          { isAuthenticated ? (
            <>
            <Link to="/upload" className="hover:text-gray-300">Subir imagen</Link>
            <Link to="/results" className="hover:text-gray-300">Resultados</Link>
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-gray-300">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
            <Link to="/about" className="hover:text-gray-300">Acerca de</Link>
            <Link to="/contact" className="hover:text-gray-300">Contacto</Link>
            </>
          )}
        </div>

        {/* Botón de login/logout */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">👤</span>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">{user?.username}</span>
                  {isAdmin && (
                    <span className="text-xs text-yellow-400">Admin</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300 text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300"
              >
                Iniciar sesión
              </button>
              <Link
                to="/register"
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition duration-300"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={() => setShowLogin(false)}
        />
      )}
    </nav>

  );
}

export default Navbar;
