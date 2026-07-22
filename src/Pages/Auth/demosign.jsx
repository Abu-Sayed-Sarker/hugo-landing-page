import React, { useState } from "react";
import campusImg from "../../assets/images/uniLogin.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../Api/authapi";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Calendar,
  Quote,
} from "lucide-react";

export default function UniSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const res = await login({ email, password, role: "university" }).unwrap();
        console.log("Login successful", res);
        navigate("/university/dashboard");
      } catch (err) {
        console.error("Failed to login:", err.data?.error[0]);
        toast.error(err.data?.error[0] || "Failed to sign in", {
          position: "bottom-center",
        });
      }
    }
  };

  const campusImage = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50/50 flex items-center justify-center p-4 md:p-8 font-inter text-slate-800">
      
      {/* Floating Central Card Container */}
      <div className="bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[680px]">
        
        {/* Left Column: Sign In Form */}
        <div className="col-span-1 md:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Welcome back <span className="animate-bounce">👋</span>
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Sign in to your account and continue your academic journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div className="text-left">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Official University Email
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0047E9]/20 focus:border-[#0047E9] text-sm transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="text-left">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0047E9]/20 focus:border-[#0047E9] text-sm transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0047E9] focus:ring-[#0047E9]/20 w-4 h-4 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" class="font-semibold text-[#0047E9] hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0047E9] hover:bg-[#003cc4] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 3 .99-.08 2.12-.61 2.8-1.44" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link to="/university-register" className="font-semibold text-[#0047E9] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Column: Generic Campus Banner & Info */}
        <div className="hidden md:flex md:col-span-6 relative p-8 lg:p-12 flex-col justify-between overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={campusImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = campusImg;
              }}
              alt="University Campus"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Soft, light overlay for readability */}
            <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
          </div>

          {/* Bullet points and info list */}
          <div className="relative z-10 space-y-8 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Your future <br />starts <span className="text-[#0047E9]">here</span>
            </h2>

            <div className="space-y-6">
              {/* Bullet 1 */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0047E9] flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <GraduationCap className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">find what to study</h4>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Explore thousands of institutions worldwide.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0047E9] flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <BookOpen className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Find the right program</h4>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Search and compare programs that match your goals.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0047E9] flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <Calendar className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Stay updated</h4>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Get the latest events, webinars and opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quotes Container at the bottom right */}
          <div className="relative z-10 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-5 shadow-lg shadow-slate-900/5 text-left mt-8">
            <div className="relative">
              <Quote className="w-8 h-8 text-blue-500/10 absolute -top-4 -left-2 rotate-180" />
              <p className="text-sm font-medium text-slate-700 italic relative z-10 leading-relaxed pl-6">
                "Clasia was born with the idea of creating an ecosystem that helps anyone achieve their goals much faster than ever before."
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3 pl-6">
                <p className="text-sm font-bold text-slate-800">Hugo M</p>
                <p className="text-xs text-slate-500">founder of Clasia</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
