import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Home,
  Landmark,
  BookOpen,
  Calendar,
  Briefcase,
  Info,
  ShieldCheck,
  FileText,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showLangMsg, setShowLangMsg] = useState(false);

  const handleSubmit = () => {
    console.log("Email submitted:", email);
    setEmail("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <footer className="text-white bg-gradient-to-b from-[#0f1c33] to-[#0a1526]">
      <div className="w-10/12 md:w-full lg:w-10/12 mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl lg:text-3xl text-[#B9C2D0] font-bold mb-4">
              clasia<span className="font-normal">.net</span>
            </h2>
            <p className="text-[#B9C2D0]/80 mb-6 leading-relaxed">
              Conectando estudiantes con las mejores oportunidades educativas.
              <br />
              Tu futuro, nuestra misión.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-[#B9C2D0] mb-1">Enlaces</h3>
            <div className="w-8 h-0.5 bg-blue mb-4"></div>
            <ul className="space-y-3">
              <li>
                <Link
                  to={"/"}
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <Home size={15} />
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to={"/universities"}
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <Landmark size={15} />
                  Universidades
                </Link>
              </li>
              <li>
                <Link
                  to={"/programs"}
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <BookOpen size={15} />
                  Programas
                </Link>
              </li>
              <li>
                <Link
                  to={"/events"}
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <Calendar size={15} />
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  to={"/jobs"}
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <Briefcase size={15} />
                  Trabajos
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-1 text-[#B9C2D0]">Recursos</h3>
            <div className="w-8 h-0.5 bg-blue mb-4"></div>
            <ul className="space-y-3">
              <li>
                <Link
                  to={"/about"}
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <Info size={15} />
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <ShieldCheck size={15} />
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <FileText size={15} />
                  Términos de Servicios
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/help-center"
                  className="flex items-center gap-2 text-[#B9C2D0]/80 hover:text-white transition-colors"
                >
                  <HelpCircle size={15} />
                  Centro de Ayuda
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-[#B9C2D0] mb-1">Mantente al día</h3>
            <div className="w-8 h-0.5 bg-blue mb-4"></div>
            <p className="text-[#B9C2D0]/80 mb-4 leading-relaxed">
              Suscríbete a nuestro boletín para recibir las últimas novedades
              y oportunidades.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-w-0 px-4 py-3 bg-white/10 text-white placeholder-[#8291A6] rounded-l border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSubmit}
                className="bg-blue text-white/80 hover:bg-blue-700 px-4 rounded-r transition-colors flex items-center justify-center"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-[#8291A6] mt-3">
              <CheckCircle2 size={14} className="text-blue" />
              No spam, desuscríbete cuando quieras.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#B9C2D0]/80 text-sm">
            © 2025 <span className="text-blue/90">Clasia</span>. Todos los derechos reservados.
          </p>

          <div className="relative">
            <button
              onClick={() => setShowLangMsg((prev) => !prev)}
              className="flex items-center gap-1 text-[#B9C2D0]/80 hover:text-white text-sm transition-colors"
            >
              Inglés
              <ChevronDown size={14} />
            </button>

            {showLangMsg && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#16233b] border border-white/10 text-[#CCD5E1] text-xs rounded-lg shadow-lg p-3 z-10">
                Estamos trabajando en introducir idiomas a Clasia.
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}