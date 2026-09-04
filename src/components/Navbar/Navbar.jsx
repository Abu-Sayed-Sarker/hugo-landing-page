"use client";

import { useState } from "react";
import { Search, User, Menu, X, LogOut, MessageSquareMore } from "lucide-react";

import logo from "../../assets/images/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/authSlice";
export default function Navbar() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  console.log(data.isAuthenticated);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Universidades", href: "/universities" },
    { label: "Programas", href: "/programs" },
    { label: "Eventos", href: "/events" },
    { label: "Trabajos", href: "/jobs" },
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Hugo AI", href: data.isAuthenticated ? "/ai-assistant" : "/login-page" },
  ];

  const handleLogin = () => {
    navigate("/login-page");
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  // Function to set user as logged in (call this from SignIn/SignUp pages)
  const loginUser = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  return (
    <nav
      className={`w-full fixed top-0 bg-white
     z-[9999] md:py-0 py-4`}
    >
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to={"/"}>
            <div>
              <img src={logo} className="h-10 xl:h-auto" alt="Clasia Logo" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  isActive
                    ? "relative text-blue py-5 text-lg font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[4px] after:bg-blue after:rounded-t"
                    : "text-gray-700 text-lg py-5 hover:text-gray-900 xl:font-medium transition-colors"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Dashboard Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {data.isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to={"/user"}>
                  <button className="flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-transform bg-primary text-white p-2 sm:px-4 sm:py-2 rounded-lg whitespace-nowrap hover:bg-blue-700">
                    <User size={18} />
                    <span className="hidden sm:inline">Panel</span>
                  </button>
                </Link>
                <Link to={"/message"}>
                  {" "}
                  <button className="flex items-center justify-center gap-2 border p-2 sm:px-3 sm:py-1.5 border-primary hover:scale-105 transition-transform text-primary font-medium rounded-lg whitespace-nowrap hover:bg-blue-50">
                    <MessageSquareMore size={20} />
                    <span className="hidden sm:inline">Chat</span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 hover:scale-105 transition-transform text-red-500 font-medium rounded-lg whitespace-nowrap hover:bg-red-50"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-transform border border-blue text-blue p-2 sm:px-6 sm:py-2 rounded-lg whitespace-nowrap font-medium"
              >
                <User size={18} strokeWidth={2.5} />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? "max-h-[500px] opacity-100 mt-4 pt-4 pb-4 border-t border-gray-200" : "max-h-0 opacity-0"}`}>
          <div className={`${mobileMenuOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"} origin-top transition-all duration-300`}>
            {/* Mobile Search */}
            {/* <div className="mb-4 flex items-center bg-gray-50 border border-gray-300 rounded-full px-4 py-2 gap-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-transparent outline-none text-gray-700 placeholder-gray-400 flex-1"
              />
            </div> */}

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#002B5B] font-bold transition-colors py-2 px-2"
                      : "text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 px-2"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
