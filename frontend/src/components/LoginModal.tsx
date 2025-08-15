import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/constants";

interface Props {
  onClose: () => void;
  onLogin: (username: string) => void;
}

function LoginModal({ onClose, onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Guardar token si quieres mantener sesión
        localStorage.setItem("token", data.token);
        onLogin(username); // Actualiza el estado en Navbar
        onClose();         // Cierra el modal
      } else {
        setError(data.message || "Credenciales incorrectas");
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
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-80 dark:bg-gray-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        aria-describedby={error ? "error-message" : undefined}
      >
        <h2 id="login-modal-title" className="text-xl font-bold mb-4">Iniciar sesión</h2>
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
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mb-4 rounded"
              aria-label="Iniciar sesión"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded"
              aria-label="Cancelar y cerrar el modal"
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
