import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from './AuthContext';


interface Props {
  onClose: () => void;
}

function LoginModal({ onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");


      const response = await login({ username, password });

      if (response.success) {
        // Guardar token si quieres mantener sesión
        // localStorage.setItem("token", data.token);
        onClose();         // Cierra el modal
      } else {
        setError(response.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red o servidor");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-opacity-80"
      aria-hidden="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-80 dark:bg-gray-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        aria-describedby={error ? "error-message" : undefined}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="login-modal-title" className="text-xl font-bold text-gray-800">
            Iniciar sesión
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        {error && (
          <p id="error-message" className="text-red-500 mb-4" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="sr-only">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:border-gray-400 rounded mb-4 text-gray-700 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            aria-required="true"
            aria-invalid={!!error && !username.trim()}
          />
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:border-gray-400 rounded mb-4 text-gray-700 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            aria-required="true"
            aria-invalid={!!error && !password.trim()}
          />
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Cancelar
            </button>
          </div>
          <Link 
            to="/register" 
            className="bg-slate-700 hover:bg-slate-800 text-sm text-gray-200 dark:text-gray-300 px-4 py-2 mb-4 rounded w-full block text-center"
            aria-label="¿No tienes una cuenta? Regístrate"
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
