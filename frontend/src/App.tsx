import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadImage from "./components/UploadImage";
import LandingPage from "./components/LandingPage";
import Results from "./components/Results";

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadImage />} />
          <Route path="/results" element={<Results />} />
          {/* Puedes agregar más rutas como /results o /about */}
        </Routes>
      </div>
  );
}

export default App;
