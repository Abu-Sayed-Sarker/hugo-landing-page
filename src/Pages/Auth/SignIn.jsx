import React, { useContext, useState } from "react";
import signin from "../../assets/images/signin.png"; // TODO: swap this asset for a generic campus/education photo (not a person)
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLoginMutation } from "../../Api/authapi";
import { AuthContext } from "../../Provider/AuthProvider";
import { RiGraduationCapLine, RiSingleQuotesL } from "react-icons/ri";
import { FiBookOpen } from "react-icons/fi";
import { PiCalendarDotsBold } from "react-icons/pi";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { handleGoogleLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const res = await login({ email, password, role: "student" }).unwrap();
        console.log("Login successful", res);
        navigate("/");
      } catch (err) {
        console.error(err.data.error[0]);
        toast.error(err.data?.error?.[0], {
          position: "bottom-center",
        });
      }
    }
  };

  const handleSocialLogin = () => {
    setLoading(true);
    console.log("Initiating Google login...");
    handleGoogleLogin()
      .then(async (res) => {
        console.log("ressssssss", res);
        const data = {
          email: res.user?.email,
          password: res.user?.uid, // Using uid as password for social login
          role: "student",
        };
        const response = await login(data).unwrap();
        setLoading(false);
        toast.success("Successfully logged in.");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.data?.error?.[0], {
          position: "bottom-center",
        });
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 p-4 lg:p-8">
      <div className="relative w-full max-w-5xl">
        {/* Soft glow behind the card to create the floating effect */}
        <div className="absolute -inset-6 bg-gradient-to-br from-blue-200/40 via-indigo-200/30 to-transparent rounded-[2.5rem] blur-2xl -z-10"></div>

        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Sign In Form */}
          <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
              Welcome back <span>👋</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2 mb-8">
              Sign in to your account and continue your academic journey.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 118 0v3" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-8 1.06-2.97 2.99-5.42 5.44-6.98M9.9 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 11 8-.6 1.68-1.55 3.19-2.76 4.44M14.12 14.12a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <Link to={"/forget-pass"} className="text-blue hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="mx-3 text-xs text-slate-400">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSocialLogin}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {loading ? "Please wait..." : "Continue with Google"}
                </button>


              </div>

              <p className="text-center text-sm text-slate-600 pt-2">
                Don't have an account?{" "}
                <Link to={"/register"} className="text-blue font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>

          {/* Right: Image + Highlights + Quote */}
          <div className="relative hidden lg:block">
            <img
              src={"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"}
              alt="Students on campus"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-white/0"></div>

            <div className="relative z-10 p-10 lg:p-12 flex flex-col h-full">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                Your future <br /> starts <span className="text-blue">here</span>
              </h2>

              <div className="mt-6 lg:mt-12 space-y-6">
                <FeatureItem
                  icon={<RiGraduationCapLine className="text-xl text-blue" />}
                  title="Find what to study"
                  desc="Explore thousands of institutions worldwide."
                />
                <FeatureItem
                  icon={<FiBookOpen className="text-xl text-blue" />}
                  title="Find the right program"
                  desc="Search and compare programs that match your goals."
                />
                <FeatureItem
                  icon={<PiCalendarDotsBold className="text-xl text-blue" />}
                  title="Stay updated"
                  desc="Get the latest events, webinars and opportunities."
                />
              </div>

              <div className="mt-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl flex gap-4 justify-start items-start shadow-lg p-5 ">
                  <span className="text-blue text-3xl font-serif leading-none"><BiSolidQuoteAltLeft /></span>
                  {/* <span className="text-blue-600 text-3xl font-serif leading-none"><RiSingleQuotesL /></span> */}

                  <div className="">
                    <p className="text-sm text-slate-700">
                      Clasia was born with the idea of creating an ecosystem that helps anyone achieve their goals much faster than ever before.
                    </p>
                    <p className="text-xs text-slate-500 mt-3">
                      <span className="font-semibold text-slate-700">-Hugo M,</span> <br /> founder of Clasia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-sky/50 text-blue-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm md:text-base font-semibold text-slate-900 md:text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
