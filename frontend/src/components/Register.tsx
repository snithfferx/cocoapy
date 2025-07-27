import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL, API_KEY, API_VERSION, API_DEBUG, API_TOKEN } from "../config/constants";

interface FormData {
    username: string;
    email: string;
    password: string;
}
export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "x-api-version": String(API_VERSION),
        "x-api-debug": String(API_DEBUG),
        "x-api-token": API_TOKEN,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      navigate("/login");
    } else {
      setError(data.message || "Registro fallido");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dark:bg-opacity-80">

    <div className="bg-white p-6 rounded-lg shadow-lg w-80 dark:bg-gray-900">
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold text-center text-white">Crear Cuenta</h2>

      {["username", "email", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          value={form[field as keyof FormData]}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full px-4 py-2 border border-gray-300 focus:border-gray-400 rounded mb-4 text-gray-700 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required
        />
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between items-center">
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Registrarme
      </button>
      <button type="button" className="text-sm text-gray-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded" onClick={() => navigate("/")}>Cancelar</button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes una cuenta?
        <Link to="/login" className="text-sm text-gray-500 dark:text-gray-300 ml-2 hover:underline hover:text-blue-500">
          Inicia sesión
        </Link>
      </p>
    </form>
    </div>
    </div>
  );
}
