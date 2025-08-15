import { Navigate } from "react-router-dom";
import React from 'react';

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al inicio
    return <Navigate to="/" replace />;
  }

  // Si hay token, muestra el contenido
  return children;
}

export default ProtectedRoute;