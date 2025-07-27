import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
}

function LoginModal({ onClose, onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username, password);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-opacity-80">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:border-gray-400 rounded mb-4 text-gray-700 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 focus:border-gray-400 rounded mb-4 text-gray-700 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mb-4 rounded"
            >
              Entrar
            </button>
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
          <a href="/register" className="bg-slate-700 hover:bg-slate-800 text-sm text-gray-200 dark:text-gray-300 px-4 py-2 mb-4 rounded w-full">
            ¿No tienes una cuenta? Regístrate
          </a>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
