import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadImage from "./components/UploadForm";
import LandingPage from "./components/LandingPage";
import About from "./components/About";
// import Login from "./components/LoginModal";
import Register from "./components/Register";

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadImage />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
  );
}

export default App;
