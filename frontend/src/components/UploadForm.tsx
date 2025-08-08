import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/constants";
import AnalysisResults from "./ResultViewer";

// enum ViewMode {
//   FORM = 'FORM',
//   LOADING = 'LOADING',
//   RESULTS = 'RESULTS',
//   ERROR = 'ERROR',
// }

const ViewMode = {
  FORM: 'FORM',
  LOADING: 'LOADING',
  RESULTS: 'RESULTS',
  ERROR: 'ERROR',
} as const;

interface FormData {
  name: string;
  quarters: string;
  threshold: string;
  file: File | null;
}

interface QuadrantDetail {
  id: number;
  colonies: number;
  segments: {
    value: number;
    imagePath: string; // Ruta de la imagen para cada segmento
  }[];
}

interface AnalysisData {
  averageColonies: number;
  overviewQuadrants: {
    id: number;
    colonies: number;
    imagePath: string; // Ruta de la imagen para el cuadrante general
  }[];
  sampleName: string;
  detailedQuadrants: QuadrantDetail[];
  totalQuadrants: number;
  totalColonies: number;
  maxColoniesPerQuadrant: number;
  minColoniesPerQuadrant: number;
}

type ViewMode = keyof typeof ViewMode;

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quarters: '2',
    threshold: '50',
    file: null
  });
  // Estado para la URL de previsualización de la imagen
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  // Estado para almacenar los datos del análisis una vez que se reciben del backend
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FORM);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // useEffect para limpiar la URL de previsualización cuando el componente se desmonta
  // o cuando la URL de previsualización cambia (ej. se selecciona una nueva imagen)
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log('handleChange llamado. Target:', e.target.name, 'Valor:', e.target.value); // Debug log
    
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
      setViewMode(ViewMode.ERROR);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("sensitivity", formData.threshold);
    formDataToSend.append("quarters", formData.quarters);
    formDataToSend.append("name", formData.name);

    setIsLoading(true);
    setError(null);
    setViewMode(ViewMode.LOADING);

    try {
      const res = await fetch(API_URL + "/contar", {
        method: "POST",
        body: formDataToSend,
      });

      const data: AnalysisData = await res.json();
      if (!res.ok) {
        setError("Error al subir la imagen.");
      } else {
        console.log("Resultado:", data);
        setAnalysisData(data); // Guardar los datos del análisis
        setViewMode(ViewMode.RESULTS);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
      setViewMode(ViewMode.ERROR);
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
    // Usamos una referencia para el input de tipo file
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    console.log('handleUploadAreaClick: Input de archivo encontrado:', fileInput); // Debug log
    fileInput?.click();
  };

  const handleFileSelection = (selectedFile: File) => {
    console.log('handleFileSelection: Archivo seleccionado:', selectedFile?.name, 'Tipo:', selectedFile?.type, 'Tamaño:', selectedFile?.size); // Debug log
    // File size validation
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("El archivo es demasiado grande. El tamaño máximo es 10MB.");
      setFile(null);
      setImagePreviewUrl(null);
      console.log('handleFileSelection: Archivo demasiado grande o tipo inválido. Vista previa limpiada.'); // Debug log
      return;
    }

    // File type validation
    if (!selectedFile.type.match('image/.*')) {
      setError('Por favor, sube solo archivos de imagen (PNG, JPG, JPEG)');
      setFile(null);
      setImagePreviewUrl(null);
      console.log('handleFileSelection: Archivo demasiado grande o tipo inválido. Vista previa limpiada.'); // Debug log
      return;
    }

    setError(null);
    setFile(selectedFile);
    setFormData(prev => ({ ...prev, file: selectedFile }));

    // Crear URL de objeto para la previsualización
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl); // Limpiar URL anterior si existe
      console.log('handleFileSelection: URL de vista previa anterior revocada.'); // Debug log
    }
    const newPreviewUrl = URL.createObjectURL(selectedFile);
    setImagePreviewUrl(newPreviewUrl);
    console.log('handleFileSelection: Nueva URL de vista previa generada:', newPreviewUrl); // Debug log

    // Handle image preview
    // const previewImage = document.getElementById("previewImage") as HTMLImageElement;
    // const filePreview = document.getElementById('filePreview');
    // const fileUploadArea = document.getElementById('fileUploadArea');

    // if (previewImage && filePreview && fileUploadArea) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     previewImage.src = e.target?.result as string;
    //     previewImage.onload = () => {
    //       // Add a nice fade-in effect
    //       previewImage.style.opacity = '0';
    //       filePreview.style.display = "block";
    //       fileUploadArea.style.display = "none";
    //       // Trigger the fade-in
    //       setTimeout(() => {
    //         previewImage.style.transition = 'opacity 0.3s ease-in-out';
    //         previewImage.style.opacity = '1';
    //       }, 10);
    //     };
    //   };
    //   reader.readAsDataURL(file);
    // }

    // Set file name
    // const fileNameElement = document.getElementById('fileName');
    // if (fileNameElement) {
    //   // Truncate long file names
    //   const displayName = file.name.length > 30
    //     ? file.name.substring(0, 27) + '...'
    //     : file.name;
    //   fileNameElement.textContent = displayName;
    // }

    // setError("");
  };

  // const sensitivitySlider = document.getElementById('threshold') as HTMLInputElement;
  // const sensitivityValue = document.getElementById('thresholdValue') as HTMLSpanElement;

  // sensitivitySlider?.addEventListener('input', (e: Event) => {
  //   const target = e.target as HTMLInputElement;
  //   const value = parseInt(target.value, 10);
  //   if (value < 1 || value > 100) {
  //     target.value = String(Math.min(Math.max(1, value), 100)); // Clamp value between 1-100
  //   }
  //   if (sensitivityValue) {
  //     sensitivityValue.textContent = target.value;
  //   }
  // })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, file: null }));
    setFile(null);
    setImagePreviewUrl(null);
    setError(null);
    // const preview = document.getElementById('filePreview');
    // const fileUploadArea = document.getElementById('fileUploadArea');
    // if (preview) preview.style.display = 'none';
    // if (fileUploadArea) fileUploadArea.style.display = 'block';

    // Reset file input
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleNewAnalysisClick = () => {
    setAnalysisData(null);
    setError(null);
    setFile(null);
    setImagePreviewUrl(null);
    setFormData({ // Resetear formData a sus valores iniciales
      name: '',
      quarters: '2',
      threshold: '50',
      file: null
    });
    setViewMode(ViewMode.FORM);
  };

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (viewMode === ViewMode.RESULTS && analysisData) {
  //     navigate('/results', { state: { analysisData } });
  //   }
  // }, [viewMode, navigate, analysisData]);

  return (
    <>
      {viewMode === ViewMode.FORM && (
        <section className="w-full max-w-xl mx-auto mt-10 px-4">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Contador de Colonias
            </h2>
            <p className="text-gray-600 text-center">
              Sube una imagen para contar automáticamente las colonias bacterianas
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6"
          >
            <div className="flex flex-col items-center justify-center">
              {/* Configuración del análisis */}
              <div className="mb-4 lg:mb-6 w-full"> {/* Añadido w-full para ocupar el ancho */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Configuración del Análisis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col w-full">
                    <label htmlFor="name" className="text-base font-semibold text-gray-800 mb-2">Nombre del análisis:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Muestra_001"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="quarters" className="text-base font-semibold text-gray-800 mb-2">Cuadrantes:</label>
                    <select
                      id="quarters"
                      name="quarters"
                      value={formData.quarters}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="2">2x2 (4 cuadrantes)</option>
                      <option value="3">3x3 (9 cuadrantes)</option>
                      <option value="4">4x4 (16 cuadrantes)</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Subida de imagen */}
              <div className="mb-4 lg:mb-6 w-full"> {/* Añadido w-full */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Imagen a Analizar</h3>
                <label htmlFor="imageInput" className="sr-only">
                  Subir imagen
                </label>
                <input
                  id="imageInput" // Cambiado de 'image' a 'imageInput' para evitar conflictos
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-0 h-0 pointer-events-none absolute"
                />
                <div
                  className={`py-5 px-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:border-gray-500 hover:bg-gray-50'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadAreaClick}
                >
                  {imagePreviewUrl ? (
                    <div className="flex flex-col items-center justify-center w-full mt-4" id="filePreview">
                      <div className="relative w-full max-w-md">
                        <img
                          src={imagePreviewUrl}
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
                        <span id="fileName" className="text-sm text-gray-600 font-medium">
                          {file ? (file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name) : ''}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Haz clic en la imagen para cambiar</p>
                      </div>
                    </div>
                  ) : (
                    <div id="fileUploadArea" className="flex flex-col items-center justify-center">
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
                  )}
                </div>
              </div>
              {/* Sensibilidad */}
              <div className="mb-4 lg:mb-6 w-full"> {/* Añadido w-full */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Sensibilidad de Detección</h3>
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">Umbral: <span id="thresholdValue">{formData.threshold}</span></label>
                  <input
                    type="range"
                    id="threshold"
                    name="threshold"
                    min="1"
                    max="100"
                    value={formData.threshold}
                    onChange={handleChange}
                    className="w-full h-1.5 rounded-sm bg-purple-300 outline-0 appearance-none
                    [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between w-full text-xs text-gray-500 mt-1">
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
                disabled={isLoading || !file} // Deshabilitar si está cargando o no hay archivo
                className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out
                  ${(isLoading || !file) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Analizando...' : 'Analizar Imagen'}
              </button>
            </div>
          </form>
        </section>
      )}
      {viewMode === ViewMode.LOADING && (
        <div className="flex items-center justify-center text-blue-600 font-semibold max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando análisis...
        </div>
      )}

      {viewMode === ViewMode.ERROR && error && (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center mt-10">
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button
            onClick={handleNewAnalysisClick}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Volver a intentar
          </button>
        </div>
      )}

      {viewMode === ViewMode.RESULTS && analysisData && (
        // Pasa la función para volver al formulario a AnalysisResults
        <AnalysisResults analysisData={analysisData} onNewAnalysis={handleNewAnalysisClick} />
      )}
    </>
  );
}