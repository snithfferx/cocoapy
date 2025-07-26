import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, API_KEY, API_VERSION, API_DEBUG, API_TOKEN } from "../config/constants";

console.log(API_URL);

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
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">Crear Cuenta</h2>

      {["username", "email", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          value={form[field as keyof FormData]}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full p-2 border rounded"
          required
        />
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Registrarme
      </button>
    </form>
  );
}
