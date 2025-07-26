import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadImage from "./components/UploadImage";
import LandingPage from "./components/LandingPage";
import Results from "./components/Results";
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
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
  );
}

export default App;
