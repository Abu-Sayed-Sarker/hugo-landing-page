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
    <div className="bg-white text-black p-6 rounded-xl shadow-sm z-[10000] w-72 max-w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-xl">Filters</h3>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-sm font-medium text-blue hover:text-blue-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      {/* Level Filter */}
      <div className="border-b border-gray-100 py-4">
        <button
          onClick={() => toggleSection("level")}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 font-semibold">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Academic Level
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
              { id: "all", label: "All Levels" },
              { id: "college", label: "College" },
              { id: "Master", label: "Master" },
              { id: "PhD", label: "PhD" },
              { id: "degree", label: "Degree" },
              { id: "online-courses", label: "Online Courses" },
              { id: "professional-formation", label: "Professional Formation" },
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
          <span className="flex items-center gap-2 font-semibold">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Field of Study
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
              <span className="text-sm cursor-pointer break-words">All Programs</span>
            </label>
            {[
              { id: "Business Management and Administration", label: "Business Management and Administration" },
              { id: "Legal and Social Sciences", label: "Legal and Social Sciences" },
              { id: "Healthcare", label: "Healthcare" },
              { id: "Natural Sciences and Mathematics", label: "Natural Sciences and Mathematics" },
              { id: "Humanities and Letters", label: "Humanities and Letters" },
              { id: "Education", label: "Education" },
              { id: "Technology and Telecommunications", label: "Technology and Telecommunications" },
              { id: "Economics and Finance", label: "Economics and Finance" },
              { id: "Languages", label: "Languages" },
              { id: "Commerce and Marketing", label: "Commerce and Marketing" },
              { id: "Hospitality and Tourism", label: "Hospitality and Tourism" },
              { id: "Sports and Physical Activity", label: "Sports and Physical Activity" },
              { id: "Agriculture, Mining, and Gardening", label: "Agriculture, Mining, and Gardening" },
              { id: "Image, Film, and Sound", label: "Image, Film, and Sound" },
              { id: "Fine Arts", label: "Fine Arts" },
              { id: "Security and Civil Protection", label: "Security and Civil Protection" },
              { id: "Logistics and Transportation", label: "Logistics and Transportation" },
              { id: "Graphic Arts", label: "Graphic Arts" },
              { id: "Fashion and Textile Production", label: "Fashion and Textile Production" },
              { id: "Music, Performing Arts, and Dance", label: "Music, Performing Arts, and Dance" },
              { id: "Veterinary Medicine and Animals", label: "Veterinary Medicine and Animals" },
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
            <span className="flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-blue-600" />
              Location
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
                { id: "all", label: "All Locations" },
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
          <span className="flex items-center gap-2 font-semibold">
            <Building2 className="w-4 h-4 text-blue-600" />
            Condition
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
              <span className="text-sm cursor-pointer break-words">All Types</span>
            </label>
            <label className="flex items-start cursor-pointer select-none min-w-0">
              <input
                type="radio"
                name="univ_type"
                className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                checked={univ_type === "public"}
                onChange={() => onFilterChange("univ_type", "public")}
              />
              <span className="text-sm cursor-pointer break-words">Public</span>
            </label>
            <label className="flex items-start cursor-pointer select-none min-w-0">
              <input
                type="radio"
                name="univ_type"
                className="mr-2.5 w-4 h-4 cursor-pointer accent-blue-600 mt-0.5 flex-shrink-0"
                checked={univ_type === "private"}
                onChange={() => onFilterChange("univ_type", "private")}
              />
              <span className="text-sm cursor-pointer break-words">Private</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}