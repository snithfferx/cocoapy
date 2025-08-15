import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { API_URL } from "../config/constants";

interface Props {
  children: React.ReactNode;
}

interface TokenPayload {
  role: string;
  exp: number;
  [key: string]: any;
}

function AdminRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check if Token is valid or expired
  const isTokenExpired = async (token: string) => {
    try {
      // Check if token is expired using API
      const response = await fetch(API_URL + "/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        return false;
      } else {
        return true;
      }

      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error("Token inválido:", error);
      return true;
    }
  };

  if (isTokenExpired(token)) {
    return <Navigate to="/" replace />;
  }


  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Token inválido:", error);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;