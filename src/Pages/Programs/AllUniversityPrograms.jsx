import React, { useState, useMemo } from "react";
import {
  Star,
  ChevronDown,
  X,
  Search,
  MapPin,
  Heart,
  Clock,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import programPlaceholder from "../../assets/images/program1.png";
import { Link } from "react-router-dom";
import FiltersContent from "../../components/Shared/FiltersContent";
import { useGetDiscoveryProgramsQuery } from "../../Api/universityApi";
import background from "../../assets/images/backgrounds.png";
export default function AllUniversityPrograms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    univ_type: "all",
    level: "all",
    field: "all",
    location: "all",
  });

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.univ_type !== "all") params.univ_type = filters.univ_type;
    if (filters.level !== "all") params.level = filters.level;
    const effectiveTitle =
      searchTerm || (filters.field !== "all" ? filters.field : "");
    if (filters.location !== "all") params.location = filters.location;
    if (effectiveTitle) params.title = effectiveTitle;
    return params;
  }, [filters, searchTerm]);

  const {
    data: programsData,
    isLoading,
    error,
  } = useGetDiscoveryProgramsQuery(queryParams);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const programs = programsData || [];

  const getFullUrl = (path) => {
    if (!path) return programPlaceholder;
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Error loading programs.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-inter">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-primary">
        {/* Background image on the right, matching the reference */}
        <div className="absolute inset-0">
          <img
            src={background}
            alt="University campus"
            className="w-full h-full object-cover object-top"
          />
          {/* Navy gradient overlay so text stays readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002B5B] via-[#002B5B]/90 to-[#0B1E4D]/10"></div>
        </div>

        <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {/* Badge */}
          <span className="inline-block bg-blue text-white text-[11px] mt-10 font-semibold tracking-wide px-3 py-1 rounded mb-4">
            DIRECTORIO DE PROGRAMAS
          </span>

          {/* Heading */}
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 max-w-2xl">
            Descubre los mejores programas del mundo
          </h1>

          {/* Subtitle */}
          <p className="text-[#BFDBFE] max-w-xl mb-8">
            Explora nuestro completo directorio de programas. Filtra por
            ubicación, área de estudio, nivel académico y más para encontrar tu opción
            ideal.
          </p>

          {/* Search and Sort Bar */}
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Buscar universidades, ubicaciones o programas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 outline-none text-sm text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 px-3 sm:border-l sm:border-gray-200">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="py-2.5 outline-none text-sm text-slate-600 bg-transparent"
              >
                <option value="all">Todas las ubicaciones</option>
                <option value="madrid">Comunidad de Madrid</option>
                <option value="barcelona">Barcelona</option>
                <option value="valencia">Valencia</option>
                <option value="alicante">Alicante</option>
                <option value="sevilla">Sevilla</option>
                <option value="salamanca">Salamanca</option>
                <option value="málaga">Málaga</option>
                <option value="murcia">Murcia</option>
                <option value="cádiz">Cádiz</option>
                <option value="vizcaya">Vizcaya</option>
                <option value="asturias">Asturias</option>
                <option value="zaragoza">Zaragoza</option>
              </select>
            </div>

            <button className="bg-blue text-white font-medium px-6 py-2.5 rounded transition-colors text-sm">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 mx-auto lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Mobile: filter toggle */}
          <div className="lg:hidden w-full mb-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm"
            >
              Filtros
            </button>
            <p className="text-sm text-gray-600">
              Mostrando {programs.length} programas
            </p>
          </div>

          {/* Desktop sidebar */}
          <div className="w-68 flex-shrink-0 hidden lg:block">
            <FiltersContent
              isLocation={false}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-[10000]"
                onClick={() => setShowFilters(false)}
              />
              <div className="fixed left-0 top-0 bottom-0 w-72 z-[10000] overflow-auto bg-[#ECF5FF] p-4">
                <div className="flex absolute right-2 items-center justify-end">
                  <button onClick={() => setShowFilters(false)} className="p-2">
                    <X />
                  </button>
                </div>
                <FiltersContent
                  isLocation={false}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </>
          )}

          {/* Program List */}
          <div className="flex-1">
            {/* Top bar: count + sort */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600 font-medium hidden md:block">
                Mostrando{" "}
                <span className="text-blue font-semibold">
                  {programs.length.toLocaleString("en-US")}
                </span>{" "}
                programas
              </p>
              <div className="relative inline-flex items-center">
                <select
                  className="appearance-none bg-white border border-gray-200 text-sm text-gray-700 rounded-md pl-3 pr-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue cursor-pointer"
                  defaultValue="recommended"
                >
                  <option value="recommended">Ordenar por: Recomendado</option>
                  <option value="tuition_asc">Matrícula: Menor a Mayor</option>
                  <option value="tuition_desc">Matrícula: Mayor a Menor</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 text-gray-500"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Cargando programas...
              </div>
            ) : programs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No se encontraron programas.
              </div>
            ) : (
              <div className="space-y-4">
                {programs.map((p) => (
                  <ProgramCard key={p.id} program={p} getFullUrl={getFullUrl} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!isLoading && programs.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-6 py-3 text-lg border-2 border-blue text-blue rounded-md font-medium transition-colors inline-flex items-center gap-2">
                  Cargar Más
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ program: p, getFullUrl }) {
  const [saved, setSaved] = React.useState(false);

  const formatTuition = (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `$${num.toLocaleString("en-US")} / año`;
  };

  const tags = [
    p.study_mode || "Tiempo completo",
    p.delivery_mode || "Presencial",
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center">
        {/* Left: Image */}
        <div className="lg:col-span-1 p-2 flex-shrink-0 h-48">
          <img
            src={getFullUrl(p.image)}
            alt={p.title}
            className="w-full rounded-lg h-full object-cover"
          />
        </div>

        {/* Center: Info */}
        <div className="flex-1 p-5 py-0 sm:py-5 lg:col-span-2 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block bg-blue/10 text-blue text-xs font-semibold px-3 py-1 rounded-full">
              {p.level || "Bachelor"}
            </span>
            <div className="flex justify-end lg:hidden">
              <button
                onClick={() => setSaved((s) => !s)}
                className={`p-1.5 rounded-full transition-colors ${saved
                  ? "text-red-500 bg-red-50"
                  : "text-gray-300 hover:text-red-400 hover:bg-red-50"
                  }`}
                aria-label="Save program"
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
            {p.title}
          </h3>

          {p.university_name && (
            <div className="flex items-center gap-2 mb-2">
              {p.university_logo ? (
                <img
                  src={getFullUrl(p.university_logo)}
                  alt={p.university_name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                  {p.university_name?.[0] ?? "U"}
                </div>
              )}
              <span className="text-sm text-gray-600">{p.university_name}</span>
            </div>
          )}

          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {p.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border bg-sky/40 text-blue px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Stats + CTA */}
        <div className="flex-shrink-0 border-l border-gray p-5 flex flex-col justify-between relative">
          <div className="lg:flex justify-end hidden absolute right-2 top-2">
            <button
              onClick={() => setSaved((s) => !s)}
              className={`p-1.5 rounded-full transition-colors ${saved
                ? "text-red-500 bg-red-50"
                : "text-gray-300 hover:text-red-400 hover:bg-red-50"
                }`}
              aria-label="Save program"
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-start gap-2 mb-2 md:mb-4">
            <Clock size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-gray-800 leading-tight">
                {p.duration || "N/A"}
              </p>
              <p className="text-xs lg:text-sm text-gray-400">Duración</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-3">
            <DollarSign
              size={16}
              className="text-gray-400 flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-sm text-gray-800 leading-tight">
                {formatTuition(p.international_tuition) || "N/A"}
              </p>
              <p className="text-xs lg:text-sm text-gray-400">Matrícula</p>
            </div>
          </div>

          <Link to={`/program-details/${p.id}`}>
            <button className="w-fit ml-auto bg-blue hover:bg-blue text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              Ver programa
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
