import { Link } from "react-router-dom";

function About (){
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">About</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Analiza imágenes de laboratorio y cuenta colonias con precisión.
        <br />
        <br />
        <Link to="/upload" className="text-blue-600 hover:underline">
          Empezar ahora
        </Link>
      </p>
    </div>
  );
}

export default About;
