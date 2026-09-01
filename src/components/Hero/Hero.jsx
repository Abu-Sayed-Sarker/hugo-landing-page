import banner from "../../assets/video/banner.mp4";
import { useState } from "react";
import {
  Search,
  BookOpen,
  ShieldPlus,
  MessageCircleMore,
  Bot,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Columns3,
  Star,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("universities");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(isAuthenticated);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/universities?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/universities");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickSearch = (tag) => {
    setSearchQuery(tag);
    navigate(`/universities?search=${encodeURIComponent(tag)}`);
  };

  const handleCompare = () => {
    // ... existing handleCompare ...
    // Logic to navigate to compare centers page
    toast("Estará disponible pronto", {
      icon: <ShieldPlus />,
      position: "bottom-center",
      style: {
        borderRadius: "10px",
        background: "#002B5B",
        color: "#fff",
      },
    });
  };

  const handleTalkToAI = () => {
    if (isAuthenticated) {
      navigate("/ai-assistant");
    } else {
      toast.error("Por favor, inicia sesión para continuar", {
        icon: "❌",
        position: "bottom-center",
        style: {
          borderRadius: "10px",
          background: "#002B5B",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="relative overflow-hidden h-screen">
      {/* Video Background Container (unchanged) */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={banner} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-start w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-sky/50 text-blue text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <GraduationCap className="w-4  h-4 " />
              Tu futuro. Nuestra plataforma.
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 lg:leading-tight text-balance">
              Encuentra la universidad ideal para{" "}
              <span className="text-blue">tu futuro</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 mb-6 leading-relaxed">
              ¿Tienes dudas o quieres asegurarte de elegir bien tu futuro?
              Echa un vistazo a estas herramientas.
            </p>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200 mb-4 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("universities")}
                className={`pb-2.5 border-b-2 transition-colors ${activeTab === "universities"
                  ? "border-blue text-blue"
                  : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
              >
                Buscar Universidades
              </button>
              <button
                onClick={() => setActiveTab("programs")}
                className={`pb-2.5 border-b-2 transition-colors ${activeTab === "programs"
                  ? "border-blue text-blue"
                  : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
              >
                Buscar Programas
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 border border-slate-200 bg-slate-50 rounded-lg px-3 py-3">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "universities"
                      ? "Buscar por universidad, programa o país"
                      : "Buscar por nombre del programa"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-black text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue hidden hover:bg-blue text-white px-5 rounded-lg transition-colors md:flex items-center justify-center flex-shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-6">
              <span className="text-slate-500">Búsquedas populares:</span>
              {["Informática", "MBA", "Ingeniería", "Negocios"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickSearch(tag)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={() => navigate("/universities")}
                className="flex-1 bg-blue hover:bg-blue text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-4 text-sm sm:text-base"
              >
                Explorar Universidades
                <FaArrowRightLong className="" />
              </button>
              <button
                onClick={handleTalkToAI}
                className="flex-1 border border-blue text-blue font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-4 text-sm sm:text-[16px]"
              >
                Hablar con bot de IA
                <Bot className="w-5 h-5" />
              </button>
            </div>

            {/* Secondary Tools (preserved from original) */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <button
                onClick={handleCompare}
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Comparar centros
              </button>
              <button
                onClick={handleCompare}
                className="flex items-center gap-1.5 text-slate-500 hover:text-blue transition-colors"
              >
                <MessageCircleMore className="w-4 h-4" />
                Orientador vocacional
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}