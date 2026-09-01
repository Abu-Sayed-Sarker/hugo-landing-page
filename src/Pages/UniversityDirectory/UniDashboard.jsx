import React, { useState } from "react";
import UniBanner from "./UniBanner";
import {
  Building,
  Calendar,
  Users,
  GraduationCap,
  Home,
  BookOpen,
  ClipboardList,
  Trees,
  Star,
  Images,
  ChevronRight,
  Download,
  Award,
  Globe,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import {
  useGetUniversityOverviewQuery,
  useGetProgramsByUniIdQuery,
  usePostRequestInfoMutation,
} from "../../Api/universityApi";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import Overview from "./Overview";
import Program from "./Program";
import Events from "./Events";
import TestimonialTab from "./TestimonialTab";
import Gallery from "./Gallery";
import Jobs from "./Jobs";
import UniProgramDetails from "./UniProgramDetails";
import UniEventsDetails from "./UniEventsDetails";
import { createPortal } from "react-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import req from "../../assets/images/reqInfo.png";
import toast from "react-hot-toast";

const NAV_TABS = [
  { id: "overview", label: "About", icon: Home },
  { id: "programs", label: "Programs", icon: BookOpen },
  { id: "admissions", label: "Admissions", icon: ClipboardList },
  { id: "events", label: "Campus Life", icon: Trees },
  { id: "testimonials", label: "Reviews", icon: Star },
  { id: "gallery", label: "Gallery", icon: Images },
];

export default function UniDashboard() {
  const { id } = useParams();
  const { data: uniData, isLoading, error } = useGetUniversityOverviewQuery(id);
  const [showApply, setShowApply] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { data: programsData, isLoading: isProgramsLoading } = useGetProgramsByUniIdQuery(
    uniData?.id,
    { skip: !uniData?.id || !showRequestForm }
  );
  const [postRequestInfo, { isLoading: isSubmitting }] = usePostRequestInfoMutation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        full_name: formData.fullName,
        email_address: formData.email,
        phone_number: formData.phone,
        program_of_interest: parseInt(formData.program),
        message: formData.message,
      };
      const res = await postRequestInfo(payload).unwrap();
      toast.success(res.message || "Request sent successfully!", { position: "bottom-center" });
      setShowRequestForm(false);
      setFormData({ fullName: "", email: "", phone: "", program: "", message: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send request. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const campuses = uniData?.locations || [];
  function openMap(address) {
    if (!address) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const topPrograms = uniData?.programs?.slice(0, 3) || [];

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading university profile...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading university data</p>
      </div>
    );

  return (
    <div className="bg-[#f5f6fa] min-h-screen">
      {/* Hero Banner */}
      <UniBanner data={uniData} setShowApply={setShowApply} />

      {/* Stats Bar */}
      <div className="md:w-10/12 mx-auto px-4 -mt-5 z-20 relative">
        <div className="bg-white rounded-2xl shadow-md px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem
            icon={<Calendar size={22} className="text-green-600" />}
            bg="bg-green-50"
            label="FOUNDED"
            value={uniData?.year_founded || "N/A"}
            sub="30+ years of excellence"
          />
          <StatItem
            icon={<Building size={22} className="text-blue-600" />}
            bg="bg-blue-50"
            label="CAMPUSES"
            value={uniData?.total_campuses || "0"}
            sub="Main Campus"
            divider
          />
          <StatItem
            icon={<Users size={22} className="text-orange-500" />}
            bg="bg-orange-50"
            label="STUDENTS"
            value={
              uniData?.total_students
                ? Number(uniData.total_students).toLocaleString() + "+"
                : "0"
            }
            sub="Active students"
            divider
          />
          <StatItem
            icon={<GraduationCap size={22} className="text-purple-600" />}
            bg="bg-purple-50"
            label="FACULTY"
            value={uniData?.total_faculty || "0"}
            sub="Expert faculty members"
            divider
          />
        </div>
      </div>

      {/* Main Body */}
      <div className="md:w-10/12 mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar Nav */}
        <aside className="w-full md:w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-20">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedProgramId(null);
                    setSelectedEventId(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all ${isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === "overview" && <Overview data={uniData} />}
          {activeTab === "programs" && (
            <>
              {selectedProgramId ? (
                <UniProgramDetails
                  UniData={uniData}
                  programId={selectedProgramId}
                  onBack={() => setSelectedProgramId(null)}
                />
              ) : (
                <Program data={uniData} onViewDetails={(id) => setSelectedProgramId(id)} />
              )}
            </>
          )}
          {activeTab === "admissions" && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Admissions</h2>
              <p className="text-gray-600">
                {uniData?.admission_info || "Admission information will be available soon."}
              </p>
            </div>
          )}
          {activeTab === "events" && (
            <>
              {selectedEventId ? (
                <UniEventsDetails
                  eventId={selectedEventId}
                  univId={uniData?.id}
                  onBack={() => setSelectedEventId(null)}
                />
              ) : (
                <Events data={uniData} onViewDetails={(id) => setSelectedEventId(id)} />
              )}
            </>
          )}
          {activeTab === "testimonials" && <TestimonialTab data={uniData} />}
          {activeTab === "gallery" && <Gallery data={uniData} />}
          {activeTab === "jobs" && <Jobs data={uniData} />}

          {/* Bottom Feature Highlights (Overview only) */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Award size={22} className="text-green-600" />}
                bg="bg-green-50"
                title="High Employability"
                desc="Graduates are hired by top companies"
              />
              <FeatureCard
                icon={<BookOpen size={22} className="text-blue-600" />}
                bg="bg-blue-50"
                title="Quality Education"
                desc="Industry-focused curriculum with practical learning"
              />
              <FeatureCard
                icon={<Globe size={22} className="text-purple-600" />}
                bg="bg-purple-50"
                title="Global Exposure"
                desc="International collaborations and exchange programs"
              />
            </div>
          )}
        </div>

        {/* Right Panel */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-4">
          {/* Top Programs Widget */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Top Programs</h3>
              <button
                onClick={() => setActiveTab("programs")}
                className="text-xs text-green-600 font-medium flex items-center gap-0.5 hover:underline"
              >
                View all programs <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {topPrograms.length > 0 ? (
                topPrograms.map((prog, i) => (
                  <ProgramCard
                    key={prog.id || i}
                    prog={prog}
                    color={["bg-blue-500", "bg-orange-500", "bg-green-600"][i % 3]}
                    onClick={() => {
                      setActiveTab("programs");
                      setSelectedProgramId(prog.id);
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No programs listed yet.</p>
              )}
            </div>
            {topPrograms.length > 0 && (
              <button
                onClick={() => setActiveTab("programs")}
                className="mt-3 w-full border border-green-600 text-green-600 rounded-lg py-2 text-sm font-medium hover:bg-green-50 transition-colors"
              >
                Explore all programs →
              </button>
            )}
          </div>

          {/* Apply / Request Info */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-1">Request Information</h3>
            <p className="text-xs text-gray-500 mb-4">
              Interested in {uniData?.univ_name || "this university"}? A representative will
              contact you!
            </p>
            <button
              onClick={() => setShowApply(true)}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors mb-2 text-sm"
            >
              Apply Now
            </button>
            <button
              onClick={() => setShowRequestForm(true)}
              className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Request Information
            </button>
          </div>

          {/* Campus Locations */}
          {campuses.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{
                backgroundImage: `url(${req})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="font-bold text-gray-800 mb-3">Campus Locations</h3>
              <div className="space-y-3">
                {campuses.map((c, index) => (
                  <div
                    key={c.id || index}
                    className="flex items-start gap-3 cursor-pointer hover:bg-white/30 rounded-lg p-2 transition-colors"
                    onClick={() => openMap(c.address)}
                  >
                    <div className="bg-white/70 rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-green-600 text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{c.location_name}</p>
                      <p className="text-xs text-gray-600">{c.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Brochure */}
          {uniData?.brochure && (
            <a
              href={uniData.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors text-sm shadow-md"
            >
              <Download size={16} />
              Download Brochure
            </a>
          )}
        </aside>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        open={showApply}
        onClose={() => setShowApply(false)}
        uniName={uniData?.univ_name || "University"}
        uniId={uniData?.id}
      />

      {/* Request Information Modal */}
      {showRequestForm &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Request Information</h2>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X size={22} />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
                    { label: "Email Address", name: "email", type: "email", placeholder: "example@mail.com" },
                    { label: "Phone Number", name: "phone", type: "tel", placeholder: "+123 456 7890" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        name={f.name}
                        placeholder={f.placeholder}
                        value={formData[f.name]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Program of Interest
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 transition-all text-sm"
                    >
                      <option value="">
                        {isProgramsLoading ? "Loading programs..." : "Select a program"}
                      </option>
                      {programsData?.map((prog) => (
                        <option key={prog.id} value={prog.id}>
                          {prog.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="How can we help you?"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 text-sm"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ── Sub-components ── */

function StatItem({ icon, bg, label, value, sub, divider }) {
  return (
    <div className={`flex items-center gap-3 ${divider ? "md:border-l border-gray-100 md:pl-4" : ""}`}>
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{label}</p>
        <p className="text-lg md:text-xl font-bold text-gray-800 leading-tight">{value}</p>
        <p className="text-[11px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function ProgramCard({ prog, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
    >
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
        <BookOpen size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {prog.title || prog.name || "Program"}
        </p>
        <p className="text-[11px] text-gray-400">
          {prog.duration || "4 Years"} · {prog.mode || "Full-time"} ·{" "}
          <span className="text-green-600">High Employability</span>
        </p>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
    </button>
  );
}

function FeatureCard({ icon, bg, title, desc }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
