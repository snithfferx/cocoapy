import { useState } from "react";

interface FormData {
  name: string;
  quarters: string;
  threshold: string;
  file: File | null;
}


export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quarters: '2',
    threshold: '50',
    file: null
  });

  
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (name === 'file' && files?.[0]) {
      handleFileSelection(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecciona una imagen.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("sensitivity", formData.threshold);
    formDataToSend.append("quarters", formData.quarters);
    formDataToSend.append("name", formData.name);

    setIsLoading(true);
    
    try {
      const res = await fetch("/contar", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al subir la imagen.");
      } else {
        console.log("Resultado:", data);
        // Aquí puedes rediregir o guardar el resultado
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelection(file);
      } else {
        setError('Por favor, sube solo archivos de imagen (PNG, JPG, JPEG)');
      }
      e.dataTransfer.clearData();
    }
  };

  const handleUploadAreaClick = () => {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput?.click();
  };

  const handleFileSelection = (file: File) => {
    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo es demasiado grande. El tamaño máximo es 10MB.");
      return;
    }
    
    // File type validation
    if (!file.type.match('image/.*')) {
      setError('Por favor, sube solo archivos de imagen (PNG, JPG, JPEG)');
      return;
    }
    
    setFile(file);
    setFormData(prev => ({ ...prev, file }));
    
    // Handle image preview
    const previewImage = document.getElementById("previewImage") as HTMLImageElement;
    const filePreview = document.getElementById('filePreview');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    if (previewImage && filePreview && fileUploadArea) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target?.result as string;
        previewImage.onload = () => {
          // Add a nice fade-in effect
          previewImage.style.opacity = '0';
          filePreview.style.display = "block";
          fileUploadArea.style.display = "none";
          // Trigger the fade-in
          setTimeout(() => {
            previewImage.style.transition = 'opacity 0.3s ease-in-out';
            previewImage.style.opacity = '1';
          }, 10);
        };
      };
      reader.readAsDataURL(file);
    }
    
    // Set file name
    const fileNameElement = document.getElementById('fileName');
    if (fileNameElement) {
      // Truncate long file names
      const displayName = file.name.length > 30 
        ? file.name.substring(0, 27) + '...' 
        : file.name;
      fileNameElement.textContent = displayName;
    }
    
    setError("");
  };

  const sensitivitySlider = document.getElementById('threshold') as HTMLInputElement;
  const sensitivityValue = document.getElementById('thresholdValue') as HTMLSpanElement;

  sensitivitySlider?.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (value < 1 || value > 100) {
      target.value = String(Math.min(Math.max(1, value), 100)); // Clamp value between 1-100
    }
    if (sensitivityValue) {
      sensitivityValue.textContent = target.value;
    }
  })

const handleRemoveFile = (e: React.MouseEvent) => {
  e.stopPropagation();
  setFormData(prev => ({ ...prev, file: null }));
  setFile(null);
  setError('');
  const preview = document.getElementById('filePreview');
  const fileUploadArea = document.getElementById('fileUploadArea');
  if (preview) preview.style.display = 'none';
  if (fileUploadArea) fileUploadArea.style.display = 'block';
  
  // Reset file input
  const fileInput = document.getElementById('image') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};
  return (
    <section className="w-full max-w-xl mx-auto mt-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Subir imagen
            </h2>
            <p className="text-gray-600 text-center">
                Sube una imagen para contar automáticamente las colonias
            </p>
        </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <div className="flex flex-col items-center justify-center">
          {/* Configuración del análisis */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Configuración del Análisis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center">
                    <label htmlFor="name" className="text-lg font-semibold text-gray-800 mb-2">Nombre del análisis:</label>
                    <input type="text" id="name" name="name" required placeholder="Ej: Muestra_001" />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <label htmlFor="quarters" className="text-lg font-semibold text-gray-800 mb-2">Cuadrantes:</label>
                    <select id="quarters" name="quarters">
                        <option value="2">2x2 (4 cuadrantes)</option>
                        <option value="3">3x3 (9 cuadrantes)</option>
                        <option value="4">4x4 (16 cuadrantes)</option>
                    </select>
                </div>
            </div>
          </div>
          {/* Subida de imagen */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Imagen para análisis</h3>
              <label htmlFor="image" className="sr-only">
                  Subir imagen
              </label>
              <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-0 h-0 pointer-events-none absolute"
              />
              <div 
                className={`py-5 px-4 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadAreaClick}
                style={{ cursor: 'pointer' }}
              >
                  <div 
                    id="fileUploadArea" 
                    className="flex flex-col items-center justify-center"
                  >
                      <svg className="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <p className="ml-5 text-gray-400">
                          <span className="font-semibold text-gray-600 text-sm text-center">Haz clic para subir una imagen</span>
                          <span className="text-gray-600 text-sm text-center">o arrastra y suelta aquí</span>
                      </p>
                      <p className="block text-gray-600 text-sm text-center">PNG, JPG, JPEG hasta 10MB</p>
                  </div>
                  <div className="hidden flex-col items-center justify-center w-full mt-4" id="filePreview" onClick={(e) => e.stopPropagation()}>
                      <div className="relative w-full max-w-md">
                          <img 
                              id="previewImage" 
                              alt="Vista previa" 
                              className="w-full h-64 object-contain rounded-lg border border-gray-200 shadow-sm" 
                          />
                          <div className="absolute -top-3 -right-3">
                              <button 
                                  type="button" 
                                  id="removeFile" 
                                  className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                                  onClick={handleRemoveFile}
                                  title="Eliminar imagen"
                              >
                                  ×
                              </button>
                          </div>
                      </div>
                      <div className="mt-3 text-center">
                          <span id="fileName" className="text-sm text-gray-600 font-medium"></span>
                          <p className="text-xs text-gray-500 mt-1">Haz clic en la imagen para cambiar</p>
                      </div>
                  </div>
              </div>
          </div>
          {/* Sensibilidad */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Sensibilidad de Detección</h3>
            <div className="flex flex-col items-center justify-center gap-2.5">
              <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">Umbral: <span id="thresholdValue">50</span></label>
              <input type="range" id="threshold" name="threshold" min="1" max="100" value="50" className="w-full h-1.5 rounded-sm bg-white outline-0" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Baja (1)</span>
                  <span>Media (50)</span>
                  <span>Alta (100)</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Analizando...' : 'Analizar'}
          </button>
        </div>
      </form>
    </section>
  );
}
