import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

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