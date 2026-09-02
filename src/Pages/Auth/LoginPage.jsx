import banner from "../../assets/video/login.mp4";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ArrowRight,
  Zap,
  BarChart3,
  Headphones
} from "lucide-react";
import { LiaUniversitySolid } from "react-icons/lia";
import { MdOutlineCheckCircle } from "react-icons/md";
import { LuShieldCheck } from "react-icons/lu";

export default function LoginPage() {
  return (
    <div className="relative xl:h-screen bg-white flex flex-col font-inter text-slate-800 overflow-x-hidden">
      
      {/* Top Section with Background Video */}
      <div className="relative w-full flex-grow flex flex-col justify-center pt-16 overflow-hidden">
        {/* Video Background Container */}
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
          {/* Light Overlay to match the bright sky in the mockup image */}
          {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div> */}
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Content Wrapper */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mb-6 mt-6 md:mt-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white/95">
              Bienvenido a <span className="text-[#0047E9]">Clasia</span>
            </h1>
            <p className="text-base md:text-lg font-medium text-white/85 max-w-2xl mx-auto leading-relaxed">
              La plataforma todo en uno para gestionar universidades, estudiantes, programas y éxito académico.
            </p>
            <div className="w-12 h-1 bg-[#0047E9] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            
            {/* University User Card */}
            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 w-full text-left flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg shadow-md hover:-translate-y-1">
              
              {/* Dynamic Wavy Background in Top Right */}
              <div className="absolute -rotate-90 top-0 right-0 pointer-events-none opacity-20 translate-x-4 -translate-y-4">
                <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M180 0C140 0 80 40 80 120C80 160 30 200 0 200H200V0Z" fill="url(#blue-grad)" />
                  <defs>
                    <linearGradient id="blue-grad" x1="200" y1="0" x2="80" y2="150" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0046e99f" />
                      <stop offset="1" stopColor="#0046e99f" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10">
                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#0046e99f]/10 text-[#0047E9]">
                  <LiaUniversitySolid className="text-4xl" />
                </div>

                {/* Title and Subtitle */}
                <h2 className="text-2xl font-bold text-slate-900 mt-5">Usuario de Universidad</h2>
                <p className="text-sm font-semibold text-[#0047E9] mt-1">Para Personal y Profesores</p>
                
                {/* Description */}
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                  Accede al Portal de Administración para gestionar programas, eventos y herramientas de comunicación esenciales del personal.
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 my-5"></div>

                {/* Bullet items */}
                <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#0047E9] flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Gestionar programas y cursos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#0047E9] flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Organizar eventos y talleres</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#0047E9] flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Acceder a herramientas del personal y profesores</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#0047E9] flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Análisis e informes</span>
                  </li>
                </ul>
              </div>

              <Link to={"/university-login"} className="relative z-10 w-full mt-auto">
                <button className="bg-[#0047E9] hover:bg-[#003cc4] text-white font-semibold w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-blue-500/10">
                  <span>Iniciar sesión como Universidad</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Student User Card */}
            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 w-full text-left flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg shadow-md hover:-translate-y-1">
              
             {/* Dynamic Wavy Background in Top Right */}
              <div className="absolute -rotate-90 top-0 right-0 pointer-events-none opacity-20 translate-x-4 -translate-y-4">
                <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M180 0C140 0 80 40 80 120C80 160 30 200 0 200H200V0Z" fill="url(#blue-grad)" />
                  <defs>
                    <linearGradient id="blue-grad" x1="200" y1="0" x2="80" y2="150" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0047E9" />
                      <stop offset="1" stopColor="#0047E9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10">
                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#0046e99f]/10 text-[#0047E9]">
                  <GraduationCap size={30} />
                </div>

                {/* Title and Subtitle */}
                <h2 className="text-2xl font-bold text-slate-900 mt-5">Usuario Estudiante</h2>
                <p className="text-sm font-semibold text-[#0047E9] mt-1">Para Estudiantes Actuales y Futuros</p>
                
                {/* Description */}
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                  Accede al Portal del Estudiante para ver calificaciones, inscripción a cursos, seguimiento de solicitudes y más.
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 my-5"></div>

                {/* Bullet items */}
                <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full text-[#0047E9] flex items-center justify-center flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Ver e inscribirse en cursos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full text-[#0047E9] flex items-center justify-center flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Seguimiento de solicitudes y admisiones</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full text-[#0047E9] flex items-center justify-center flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Ver calificaciones y progreso académico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full text-[#0047E9] flex items-center justify-center flex-shrink-0">
                      <MdOutlineCheckCircle className="text-4xl" />
                    </div>
                    <span>Acceder a servicios estudiantiles</span>
                  </li>
                </ul>
              </div>

              <Link to={"/login"} className="relative z-10 w-full mt-auto">
                <button className="bg-[#0047E9] hover:bg-[#003cc4] text-white font-semibold w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-green-500/10">
                  <span>Iniciar sesión como Estudiante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Section: 4 Feature Cards */}
      <div className="relative z-10 w-full bg-white py-6 px-4 md:px-8 -top-20 flex-shrink-0">
        <div className="max-w-7xl mx-auto relative top-20">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <LuShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm">Seguro y Confiable</h4>
                <p className="text-xs text-slate-500 mt-0.5">Seguridad de nivel empresarial para proteger tus datos</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm">Plataforma Todo en Uno</h4>
                <p className="text-xs text-slate-500 mt-0.5">Todo lo que necesitas en un sistema centralizado</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm">Análisis Inteligente</h4>
                <p className="text-xs text-slate-500 mt-0.5">Información basada en datos para mejores decisiones</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm">Soporte 24/7</h4>
                <p className="text-xs text-slate-500 mt-0.5">Estamos aquí para ayudarte en cada paso del camino</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
