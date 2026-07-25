import { Bookmark, GraduationCap } from "lucide-react";
import { useState, useMemo } from "react";
import { BiDollarCircle } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { MdOutlineWatchLater } from "react-icons/md";
import { useGetDiscoveryJobsQuery, useGetJobDetailsQuery } from "../../Api/universityApi";
import logoPlaceholder from "../../assets/icons/uni_logo.png";
import background from "../../assets/images/uniBanner.png";
import ApplyJobModal from "../../Layouts/University/Modal/ApplyJobModal";

export default function JobList({ onViewDetails }) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [searchTerm, setSearchTerm] = useState("");
  const [postedWithin, setPostedWithin] = useState("Any Time");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const queryParams = useMemo(() => {
    const params = {};
    if (selectedCategory !== "All Categories")
      params.category = selectedCategory;
    if (selectedType !== "All Types") params.job_type = selectedType;
    if (postedWithin !== "Any Time") params.posted_within = postedWithin;
    if (searchTerm) params.search = searchTerm;
    return params;
  }, [selectedCategory, selectedType, postedWithin, searchTerm]);

  const {
    data: jobsData,
    isLoading,
    error,
  } = useGetDiscoveryJobsQuery(queryParams);

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "full time":
        return "bg-blue/10 text-blue";
      case "part time":
        return "bg-[#DCFCE7] text-[#16A34A]";
      case "internship":
        return "bg-yellow/10 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-gray-500">
        Loading jobs...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-red-500">
        Error loading jobs.
      </div>
    );

  const jobs = jobsData || [];

  return (
    <div className="min-h-screen bg-base">
      <div className="relative overflow-hidden h-[50vh] bg-primary">
        {/* Background image on the right, matching the reference */}
        <div className="absolute inset-0">
          <img
            src={background}
            alt="University campus"
            className="w-full h-full object-cover object-top"
          />
          {/* Navy gradient overlay so text stays readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002B5B] to-transparent"></div>
        </div>

        <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">


          {/* Heading */}
          <h1 className="text-white mt-20 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-2xl">
            Jobs & Internships
          </h1>

          {/* Subtitle */}
          <p className="text-[#BFDBFE] max-w-xl lg:text-lg mb-8">
            Find career opportunities and internships from top universities and
            partner companies. Kickstart your career with positions tailored for
            students and graduates.
          </p>


        </div>
      </div>
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <input
            type="text"
            placeholder="Search for job title, company, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-68 flex-shrink-0 text-sm">
            <div className="bg-[#ECF5FF] rounded p-6">
              <h3 className="font-semibold mb-4 text-xl">Filters</h3>

              {/* Job Type */}
              <div className="mb-5">
                <h4 className=" font-medium mb-3 text-gray-900 text-base">
                  Job Type
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center  text-gray-700">
                    <input
                      type="radio"
                      name="jobType"
                      className="mr-2 text-blue-600"
                      checked={selectedType === "All Types"}
                      onChange={() => setSelectedType("All Types")}
                    />
                    <span>All Types</span>
                  </label>
                  {[
                    "Full Time",
                    "Part Time",
                    "Internship",
                    "Research",
                    "PhD Positions",
                  ].map((type) => (
                    <label
                      key={type}
                      className="flex items-center  text-gray-700"
                    >
                      <input
                        type="radio"
                        name="jobType"
                        className="mr-2"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <h4 className=" font-medium mb-3 text-gray-900 text-base">
                  Category
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center  text-gray-700">
                    <input
                      type="radio"
                      name="category"
                      className="mr-2 text-blue-600"
                      checked={selectedCategory === "All Categories"}
                      onChange={() => setSelectedCategory("All Categories")}
                    />
                    <span>All Categories</span>
                  </label>
                  {[
                    "Technology",
                    "Business",
                    "Healthcare",
                    "Natural Sciences",
                    "Humanities",
                    "Education",
                    "Legal",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center  text-gray-700"
                    >
                      <input
                        type="radio"
                        name="category"
                        className="mr-2"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Posted Within */}
              <div>
                <h4 className="font-medium mb-3 text-gray-900 text-base">
                  Posted Within
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center  text-gray-700">
                    <input
                      type="radio"
                      name="posted"
                      className="mr-2 text-blue-600"
                      checked={postedWithin === "Any Time"}
                      onChange={() => setPostedWithin("Any Time")}
                    />
                    <span>Any Time</span>
                  </label>
                  <label className="flex items-center  text-gray-700">
                    <input
                      type="radio"
                      name="posted"
                      className="mr-2"
                      checked={postedWithin === "Past Week"}
                      onChange={() => setPostedWithin("Past Week")}
                    />
                    <span>Past Week</span>
                  </label>
                  <label className="flex items-center  text-gray-700">
                    <input
                      type="radio"
                      name="posted"
                      className="mr-2"
                      checked={postedWithin === "Past Month"}
                      onChange={() => setPostedWithin("Past Month")}
                    />
                    <span>Past Month</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className=" text-gray-600">Showing {jobs.length} jobs</p>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-lg flex-shrink-0 bg-base border">
                        <img
                          src={getFullUrl(job.univ_logo) || logoPlaceholder}
                          alt="logo"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${getBadgeColor(
                            job.job_type,
                          )}`}
                        >
                          {job.job_type}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                        </div>
                        <p className=" text-gray-600 font-medium flex items-center gap-2">
                          {/* <GraduationCap size={22} strokeWidth={3} /> */}
                          {job.company_name}
                        </p>

                        <div className="flex items-center gap-6 text-gray-600 my-1">
                          <span className="flex items-center">
                            <GrLocation className="mr-1.5 text-dark" />
                            {job.location}
                          </span>

                          <span className="flex items-center">
                            <BiDollarCircle className="mr-1.5 text-dark text-lg" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                    </div>
 <button
              onClick={() => setSaved((s) => !s)}
              className={`p-1.5 rounded-full transition-colors ${saved
                ? "text-blue-600 bg-blue-50"
                : "text-gray-300 hover:text-blue-500 hover:bg-blue-50"
                }`}
              aria-label="Save event"
            >
              <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
            </button>
                  </div>


                  <p className=" text-gray-700 mb-6 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="bg-base px-3 py-1 rounded-full text-sm text-gray-600 border border-gray-100">
                        {job.category}
                      </span>
                      <span className="text-gray-500">
                        Posted: {job.posted_date}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="py-2 px-6 bg-blue text-white rounded-lg font-medium shadow-lg hover:shadow-blue-200 hover:bg-blue-600 transition-all text-sm "
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => onViewDetails && onViewDetails(job)}
                        className="bg-blue text-white px-5 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-700 shadow-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  {isApplyModalOpen && (
                    <ApplyJobModal job={job} onClose={() => setIsApplyModalOpen(false)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
