import { Navigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import { API_URL } from "../config/constants";
import { useAuth } from './AuthContext';

interface Props {
  children: React.ReactNode;
}

// interface TokenPayload {
//   role: string;
//   exp: number;
//   [key: string]: any;
// }

function AdminRoute({ children }: Props) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  // const token = localStorage.getItem("token");

  // if (!token) {
  //   return <Navigate to="/" replace />;
  // }

  // Check if Token is valid or expired
  // const isTokenExpired = async (token: string) => {
  //   try {
  //     // Check if token is expired using API
  //     const response = await fetch(API_URL + "/auth/validate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token }),
  //     });

  //     const data = await response.json();

  //     if (response.ok && data.valid) {
  //       return false;
  //     } else {
  //       return true;
  //     }

  //     const decoded = jwtDecode<TokenPayload>(token);
  //     return decoded.exp < Date.now() / 1000;
  //   } catch (error) {
  //     console.error("Token inválido:", error);
  //     return true;
  //   }
  // };

  // if (isTokenExpired(token)) {
  //   return <Navigate to="/" replace />;
  // }


  // try {
  //   const decoded = jwtDecode<TokenPayload>(token);
  //   if (decoded.role !== "admin") {
  //     return <Navigate to="/" replace />;
  //   }
  // } catch (error) {
  //   console.error("Token inválido:", error);
  //   return <Navigate to="/" replace />;
  // }

  // return children;
  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="text-gray-600">Verificando permisos de administrador...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;