import React, { useState, useMemo } from "react";
import { Star, ChevronDown, X, Search, MapPin } from "lucide-react";
import programPlaceholder from "../../assets/images/program1.png";
import { Link } from "react-router-dom";
import FiltersContent from "../../components/Shared/FiltersContent";
import { useGetDiscoveryProgramsQuery } from "../../Api/universityApi";
import background from "../../assets/images/background.jpg"
export default function AllUniversityPrograms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    univ_type: "all",
    level: "all",
    field: "all",
  });

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.univ_type !== "all") params.univ_type = filters.univ_type;
    if (filters.level !== "all") params.level = filters.level;
    const effectiveTitle =
      searchTerm || (filters.field !== "all" ? filters.field : "");
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
            className="w-full h-full object-cover "
          />
          {/* Navy gradient overlay so text stays readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002B5B] via-[#002B5B] to-[#0B1E4D]/10"></div>
        </div>

        <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {/* Badge */}
          <span className="inline-block bg-blue text-white text-[11px] mt-10 font-semibold tracking-wide px-3 py-1 rounded mb-4">
            UNIVERSITY DIRECTORY
          </span>

          {/* Heading */}
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 max-w-2xl">
            Discover top universities worldwide
          </h1>

          {/* Subtitle */}
          <p className="text-[#BFDBFE] max-w-xl mb-8">
            Explore our comprehensive directory of universities. Filter by
            location, programs, academic level, and more to find your perfect
            match.
          </p>

      {/* Search and Sort Bar */}
     <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search universities, locations, or programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 outline-none text-sm text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 px-3 sm:border-l sm:border-gray-200">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select className="py-2.5 outline-none text-sm text-slate-600 bg-transparent">
                <option>All locations</option>
              </select>
            </div>

            <button className="bg-blue text-white font-medium px-6 py-2.5 rounded transition-colors text-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile: filter toggle */}
          <div className="lg:hidden w-full mb-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm"
            >
              Filters
            </button>
            <p className="text-sm text-gray-600">
              Showing {programs.length} programs
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
          <div className="flex-1 p-4 md:p-7 bg-[#ECF5FF]">
            {/* Top bar: count + sort */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600 font-medium">
                Showing{" "}
                <span className="text-blue-600 font-semibold">
                  {programs.length.toLocaleString("en-US")}
                </span>{" "}
                programs
              </p>
              <div className="relative inline-flex items-center">
                <select
                  className="appearance-none bg-white border border-gray-200 text-sm text-gray-700 rounded-md pl-3 pr-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  defaultValue="recommended"
                >
                  <option value="recommended">Sort by: Recommended</option>
                  <option value="tuition_asc">Tuition: Low to High</option>
                  <option value="tuition_desc">Tuition: High to Low</option>
                  <option value="duration">Duration</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 text-gray-500"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading programs...
              </div>
            ) : programs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No programs found.
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
                <button className="px-6 py-3 text-lg border-2 border-blue text-blue rounded-md font-medium hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                  Load More
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
    return `$${num.toLocaleString("en-US")} / year`;
  };

  const tags = [p.study_mode || "Full-time", p.delivery_mode || "On campus"].filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row">
        {/* Left: Image */}
        <div className="sm:w-52 md:w-60 flex-shrink-0">
          <img
            src={getFullUrl(p.image)}
            alt={p.title}
            className="w-full h-48 sm:h-full object-cover"
          />
        </div>

        {/* Center: Info */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="mb-2">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              {p.level || "Bachelor"}
            </span>
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
                className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Stats + CTA */}
        <div className="sm:w-44 md:w-48 flex-shrink-0 border-l border-gray-100 p-5 flex flex-col justify-between">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setSaved((s) => !s)}
              className={`p-1.5 rounded-full transition-colors ${
                saved
                  ? "text-red-500 bg-red-50"
                  : "text-gray-300 hover:text-red-400 hover:bg-red-50"
              }`}
              aria-label="Save program"
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-gray-800 leading-tight">
                {p.duration || "N/A"}
              </p>
              <p className="text-xs text-gray-400">Duration</p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-5">
            <DollarSign size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-gray-800 leading-tight">
                {formatTuition(p.international_tuition) || "N/A"}
              </p>
              <p className="text-xs text-gray-400">Tuition</p>
            </div>
          </div>

          <Link to={`/program-details/${p.id}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
              View program
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
