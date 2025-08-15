import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadImage from "./components/UploadForm";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
import Register from "./components/Register";
import Dashboard from "./components/dashboard";
import AdminRoute from "./components/AdminRoute";
import AdminUsers from "./components/AdminUsers";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadImage />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
