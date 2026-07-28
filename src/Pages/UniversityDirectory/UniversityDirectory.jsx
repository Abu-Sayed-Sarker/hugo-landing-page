import {
  Star,
  ChevronDown,
  X,
  Search,
  MapPin,
  Heart,
  Landmark,
  ArrowRight,
  GraduationCap,
  Users,
} from "lucide-react";
import { Link, ScrollRestoration, useSearchParams } from "react-router-dom";
import FiltersContent from "../../components/Shared/FiltersContent";
import { useGetAllUniversitiesQuery } from "../../Api/universityApi";
import { useState, useEffect } from "react";
import uni_default from "../../assets/images/uni_default.jpg";
import background from "../../assets/images/backgrounds.png";
export default function UniversityDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState({
    univ_type: "all",
    location: "all",
    level: "all",
    field: "all",
  });

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Mapping the UI filters to the API query parameters
  const apiParams = {
    univ_type: filters.univ_type === "all" ? "" : filters.univ_type,
    location: filters.location === "all" ? "" : filters.location,
    level: filters.level === "all" ? "" : filters.level,
    search: searchQuery,
  };

  const { data: universitiesData, isLoading } =
    useGetAllUniversitiesQuery(apiParams);

  const universities = universitiesData || [];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-inter">
      <ScrollRestoration />
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
      <div className="w-11/12 mx-auto px-0 md:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-0 md:gap-4 xl:gap-8">
          {/* Mobile: filter toggle (visible on small screens) */}
          <div className="md:hidden w-full mb-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm"
            >
              Filters
            </button>
            <div>
              <p className="text-sm text-gray-600">
                Showing {universities.length} universities
              </p>
            </div>
          </div>

          {/* Desktop sidebar (hidden on small) */}
          <div className="w-68 flex-shrink-0 hidden md:block">
            <FiltersContent
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile filter panel (overlay) */}
          {showFilters && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setShowFilters(false)}
              />
              <div className="fixed left-0 pt-10 top-0 bottom-0 w-72 z-50 overflow-auto bg-[#ECF5FF] px-2">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2">
                    <X />
                  </button>
                </div>
                <FiltersContent
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </>
          )}

          {/* University Grid */}

          <div className="flex-1 xl:px-7">
            <div className="mb-4 hidden md:block">
              <p className="text-sm text-gray-600">
                Showing {universities.length} universities
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {universities.map((uni) => (
                  <div
                    key={uni.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 lg:gap-6"
                  >
                    {/* Image with save button + ranking badge */}
                    <div className="relative w-full col-span-2 xl:col-span-1">
                      <img
                        src={getFullUrl(uni?.picture) || uni_default}
                        className="w-full md:h-full rounded-lg object-cover"
                        alt={uni.univ_name}
                      />
                      <button
                        aria-label="Save university"
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <Heart className="w-4 h-4 text-slate-500" />
                      </button>
                      {uni.world_ranking && (
                        <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                          #{uni.world_ranking} World Ranking
                        </span>
                      )}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 col-span-2 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {uni.logo && (
                            <img
                              src={getFullUrl(uni?.logo)}
                              alt={uni.univ_name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">
                            {uni.univ_name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate">
                            {uni.address || "Location not specified"}
                          </p>
                        </div>
                      </div>

                      {uni.about && (
                        <p className="text-sm text-slate-500 mt-1 md:mt-3 leading-relaxed line-clamp-2">
                          {uni.about}
                        </p>
                      )}

                      {Array.isArray(uni.tags) && uni.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1 md:mt-3">
                          {uni.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {uni.univ_type && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
                              {uni.univ_type}
                            </span>
                          )}
                        </div>
                      ) : (
                        uni.univ_type && (
                          <span className="inline-block text-xs bg-sky/50 text-blue px-3 py-1 rounded-full capitalize my-2 md:mt-3 md:mb-0">
                            {uni.univ_type}
                          </span>
                        )
                      )}
                    </div>

                    {/* Stats column */}
                    <div className="flex flex-col justify-between md:justify-center gap-3 md:gap-4 md:w-40 flex-shrink-0 md:border-l md:border-gray md:pl-5">
                      {uni.total_students && (
                        <div className="flex items-center gap-4 text-sm text-slate-700">
                          <GraduationCap className="text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">
                              {uni.total_students}
                            </p>
                            <p>Students</p>
                          </div>
                        </div>
                      )}

                      {uni.total_faculty && (
                        <div className="flex items-center gap-4 text-sm text-slate-700">
                          <Users className="text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">{uni.total_faculty}</p>
                            <p>Faculty</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-slate-700">
                        <Landmark className="text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">{uni.programs_count}</p>{" "}
                          Programs
                        </div>
                      </div>
                    </div>

                    {/* Rating + CTAs */}
                    <div className="flex flex-col items-center justify-between md:justify-center gap-3 flex-shrink-0 md:border-l md:border-gray md:pl-5">
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-current"
                        />
                        <span className="text-slate-900 font-semibold">
                          {uni.average_rating || 0}
                        </span>
                        {uni.reviews_count && (
                          <span className="text-xs text-slate-400">
                            ({uni.reviews_count} reviews)
                          </span>
                        )}
                      </div>

                      <Link to={`/universities/${uni.id}`} className="w-full">
                        <button className="w-full bg-blue text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors">
                          View Profile
                        </button>
                      </Link>

                      <Link
                        to={`/universities/${uni.id}`}
                        className="flex items-center gap-1 text-sm text-blue hover:text-blue-700 font-medium"
                      >
                        See Programs
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button className="px-6 py-1 md:py-3 md:text-lg text-sm border-2 border-blue text-blue rounded-md font-medium hover:bg-blue-50 transition-colors inline-flex items-center">
                Load More
                <ChevronDown size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
