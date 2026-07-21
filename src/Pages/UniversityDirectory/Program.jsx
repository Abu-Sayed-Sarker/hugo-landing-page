import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, DollarSign, Heart, ArrowRight } from "lucide-react";
import { useGetProgramsByUniIdQuery } from "../../Api/universityApi";
import programPlaceholder from "../../assets/images/program1.png";

export default function Program({ onViewDetails }) {
  const { id } = useParams();
  const {
    data: programsData,
    isLoading,
    error,
  } = useGetProgramsByUniIdQuery(id);

  const [levelFilter, setLevelFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getFullUrl = (path) => {
    if (!path) return programPlaceholder;
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  const programs = programsData || [];

  const filtered = programs.filter((p) => {
    const matchesLevel =
      levelFilter === "all" ||
      p.level.toLowerCase() === levelFilter.toLowerCase();
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (isLoading) return <div>Loading programs...</div>;
  if (error) return <div>Error loading programs.</div>;

  return (
    <div className="border p-6 bg-white rounded-xl">
      {/* Programs Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold">Programs</h2>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <input
            type="search"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="college">College</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
            <option value="degree">Degree</option>
            <option value="online-courses">Online Courses</option>
            <option value="professional-formation">Professional Formation</option>
          </select>
        </div>
      </div>

      {/* Program Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((p) => (
            <UniProgramCard
              key={p.id}
              program={p}
              getFullUrl={getFullUrl}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No programs found matching your criteria.
        </div>
      )}
    </div>
  );
}

function UniProgramCard({ program: p, getFullUrl, onViewDetails }) {
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
        {p.image && (
          <div className="sm:w-52 md:w-60 flex-shrink-0">
            <img
              src={getFullUrl(p.image)}
              alt={p.title}
              className="w-full h-48 sm:h-full object-cover"
            />
          </div>
        )}

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
                {formatTuition(p.domestic_tuition) || "N/A"}
              </p>
              <p className="text-xs text-gray-400">Tuition</p>
            </div>
          </div>

          <button
            onClick={() => onViewDetails && onViewDetails(p.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            View program
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
