import { useState } from "react";
import {
  RotateCcw,
  GraduationCap,
  BookOpen,
  MapPin,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function FiltersContent({ filters, onFilterChange, isLocation = true }) {
  const { level, location, univ_type, field: selectedField } = filters;

  const [openSections, setOpenSections] = useState({
    level: true,
    field: false,
    location: false,
    univ_type: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearAll = () => {
    onFilterChange("level", "all");
    onFilterChange("field", "all");
    if (isLocation) onFilterChange("location", "all");
    onFilterChange("univ_type", "all");
  };

  return (
    <div className="bg-white text-black p-3 md:p-6 rounded-xl shadow-sm z-[10000] md:w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-5">
        <h3 className="font-bold text-xl">Filtros</h3>
        <button
          onClick={handleClearAll}
          className="flex items-center md:gap-1.5 text-sm font-medium text-blue hover:text-blue-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Borrar todo
        </button>
      </div>

      {/* Level Filter */}
      <div className="border-b border-gray-100 py-2 md:py-4">
        <button
          onClick={() => toggleSection("level")}
          className="w-full flex items-center justify-between text-left text-sm"
        >
          <span className="flex items-center gap-2 font-semibold">
            <GraduationCap className="w-4 h-4 text-blue" />
            Nivel Académico
          </span>
          {openSections.level ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {openSections.level && (
          <div className="space-y-2.5 mt-4">
            {[
              { id: "all", label: "Todos los niveles" },
              { id: "college", label: "Universidad" },
              { id: "Master", label: "Máster" },
              { id: "PhD", label: "Doctorado" },
              { id: "degree", label: "Grado" },
              { id: "online-courses", label: "Cursos en línea" },
              { id: "professional-formation", label: "Formación Profesional" },
            ].map((opt) => (
              <label key={opt.id} className="flex items-start cursor-pointer select-none min-w-0">
                <input
                  type="radio"
                  name="level"
                  className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                  checked={level === opt.id}
                  onChange={() => onFilterChange("level", opt.id)}
                />
                <span className="text-sm cursor-pointer break-words">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Programs Filter */}
      <div className="border-b border-gray-100 py-4">
        <button
          onClick={() => toggleSection("field")}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-blue" />
            Área de Estudio
          </span>
          {openSections.field ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {openSections.field && (
          <div className="space-y-2.5 mt-4 max-h-64 overflow-y-auto pr-1">
            <label className="flex items-start cursor-pointer select-none min-w-0">
              <input
                type="radio"
                name="field"
                className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                checked={selectedField === "all"}
                onChange={() => onFilterChange("field", "all")}
              />
              <span className="text-sm cursor-pointer break-words">Todos los Programas</span>
            </label>
            {[
              { id: "Business Management and Administration", label: "Administración y Dirección de Empresas" },
              { id: "Legal and Social Sciences", label: "Ciencias Jurídicas y Sociales" },
              { id: "Healthcare", label: "Salud" },
              { id: "Natural Sciences and Mathematics", label: "Ciencias Naturales y Matemáticas" },
              { id: "Humanities and Letters", label: "Humanidades y Letras" },
              { id: "Education", label: "Educación" },
              { id: "Technology and Telecommunications", label: "Tecnología y Telecomunicaciones" },
              { id: "Economics and Finance", label: "Economía y Finanzas" },
              { id: "Languages", label: "Idiomas" },
              { id: "Commerce and Marketing", label: "Comercio y Marketing" },
              { id: "Hospitality and Tourism", label: "Hostelería y Turismo" },
              { id: "Sports and Physical Activity", label: "Deportes y Actividad Física" },
              { id: "Agriculture, Mining, and Gardening", label: "Agricultura, Minería y Jardinería" },
              { id: "Image, Film, and Sound", label: "Imagen, Cine y Sonido" },
              { id: "Fine Arts", label: "Bellas Artes" },
              { id: "Security and Civil Protection", label: "Seguridad y Protección Civil" },
              { id: "Logistics and Transportation", label: "Logística y Transporte" },
              { id: "Graphic Arts", label: "Artes Gráficas" },
              { id: "Fashion and Textile Production", label: "Moda y Producción Textil" },
              { id: "Music, Performing Arts, and Dance", label: "Música, Artes Escénicas y Danza" },
              { id: "Veterinary Medicine and Animals", label: "Veterinaria y Animales" },
            ].map((item) => (
              <label key={item.id} className="flex items-start cursor-pointer select-none min-w-0">
                <input
                  type="radio"
                  name="field"
                  className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                  checked={selectedField === item.id}
                  onChange={() => onFilterChange("field", item.id)}
                />
                <span className="text-sm cursor-pointer break-words">{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {isLocation && (
        <div className="border-b border-gray-100 py-4">
          <button
            onClick={() => toggleSection("location")}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="flex items-center gap-2 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-blue" />
              Ubicación
            </span>
            {openSections.location ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {openSections.location && (
            <div className="space-y-2.5 mt-4">
              {[
                { id: "all", label: "Todas las Ubicaciones" },
                { id: "madrid", label: "Comunidad de Madrid" },
                { id: "barcelona", label: "Barcelona" },
                { id: "valencia", label: "Valencia" },
                { id: "alicante", label: "Alicante" },
                { id: "sevilla", label: "Sevilla" },
                { id: "salamanca", label: "Salamanca" },
                { id: "málaga", label: "Málaga" },
                { id: "murcia", label: "Murcia" },
                { id: "cádiz", label: "Cádiz" },
                { id: "vizcaya", label: "Vizcaya" },
                { id: "asturias", label: "Asturias" },
                { id: "zaragoza", label: "Zaragoza" },
              ].map((item) => (
                <label key={item.id} className="flex items-start cursor-pointer select-none min-w-0">
                  <input
                    type="radio"
                    name="location"
                    className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                    checked={location === item.id}
                    onChange={() => onFilterChange("location", item.id)}
                  />
                  <span className="text-sm cursor-pointer break-words">{item.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Condition (Univ Type) Filter */}
      <div className="pt-4">
        <button
          onClick={() => toggleSection("univ_type")}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 font-semibold text-sm">
            <Building2 className="w-4 h-4 text-blue" />
            Condición
          </span>
          {openSections.univ_type ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {openSections.univ_type && (
          <div className="space-y-2.5 mt-4">
            <label className="flex items-start cursor-pointer select-none min-w-0">
              <input
                type="radio"
                name="univ_type"
                className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                checked={univ_type === "all"}
                onChange={() => onFilterChange("univ_type", "all")}
              />
              <span className="text-sm cursor-pointer break-words">Todos los Tipos</span>
            </label>
            <label className="flex items-start cursor-pointer select-none min-w-0">
              <input
                type="radio"
                name="univ_type"
                className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                checked={univ_type === "public"}
                onChange={() => onFilterChange("univ_type", "public")}
              />
              <span className="text-sm cursor-pointer break-words">Pública</span>
            </label>
            <label className="flex items-start cursor-pointer select-none min-w-0">
              <input
                type="radio"
                name="univ_type"
                className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                checked={univ_type === "private"}
                onChange={() => onFilterChange("univ_type", "private")}
              />
              <span className="text-sm cursor-pointer break-words">Privada</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}