import { useEffect, useState } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "./AuthContext";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const { user: currentUser } = useAuth();

  const token = localStorage.getItem("token");

  // 🔄 Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError("No tienes permisos para acceder a esta página.");
          return;
        }
        if (currentUser?.role !== 'admin') {
          setError("No tienes permisos para acceder a esta página.");
          return;
        }
        setLoading(true);


        const response = await fetch(API_URL + "/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data.data)) {
          setUsers(data.data);
          setError("");
        } else {
          setError(data.message || "No se pudo cargar la lista de usuarios.");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error de red o servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔄 Cambiar rol de usuario
  const handleRoleChange = async (userId: number, newRole: string) => {
    // Prevenir que el usuario se modifique a sí mismo
    if (currentUser?.id === userId) {
      alert("No puedes cambiar tu propio rol.");
      return;
    }

    setUpdatingUserId(userId);
    try {
      if (!token) {
        alert("No tienes permisos para realizar esta acción.");
        return;
      }
      if (currentUser?.role !== 'admin') {
        alert("No tienes permisos para realizar esta acción.");
        return;
      }

      const response = await fetch(API_URL + `/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar estado local
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        alert(data.message || "No se pudo cambiar el rol.");
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error de red o servidor.");
      }
    } finally {
      setUpdatingUserId(null);
    }
  };
if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Administración de Usuarios</h1>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Cargando usuarios...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Administración de Usuarios</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administración de Usuarios</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Usuario</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rol</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                {user.role === "user" ? (
                  <button
                    onClick={() => handleRoleChange(user.id, "admin")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Hacer admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(user.id, "user")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                  >
                    Hacer usuario
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
