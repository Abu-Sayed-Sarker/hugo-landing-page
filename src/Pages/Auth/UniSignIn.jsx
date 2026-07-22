import React, { useState } from "react";
import background from "../../assets/images/uniLogin.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../Api/authapi";
import toast from "react-hot-toast";

export default function UniSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false); 
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
        console.error("Failed to login:", err.data.error[0]);
        toast.error(err.data?.error[0], {
          position: "bottom-center",
        });
      }
    }
  };

  return (
    <div
      className="p-8 bg-cover h-screen bg-no-repeat text-white "
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="mx-auto my-auto h-full max-w-2xl flex flex-col justify-center">
        <h1 className="text-2xl lg:text-4xl font-bold text-center mb-2">
          Sign In
        </h1>
        <p className="text-blue-100 text-center mb-4 lg:mb-8">
          Enter your credentials to access the admin portal
        </p>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">
            Identity & Contact Information
          </h2>

          <div className="mb-4">
            <label className="block text-sm mb-2">
              Official University Email *
            </label>
            <input
              type="email"
              name="email"
              // value={signinForm.email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border-2 border-blue-300 rounded-lg placeholder-blue-200 focus:outline-none focus:border-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm mb-2">Create Password *</label>
            <input
              type="password"
              name="password"
              // value={signinForm.password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border-2 border-blue-300 rounded-lg placeholder-blue-200 focus:outline-none focus:border-blue-400"
              placeholder="••••••••••"
            />
          </div>



          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue hover:bg-blue-700 font-semibold py-3 rounded-lg transition duration-200 mb-4"
          >
            {isLoading ? "Signing In..." : "Sign In"}

          </button>

          <p className="text-center text-blue-100">
            Don't have an account?{" "}
            <Link to={"/university-register"}>
              <button type="button" className="text-blue-300 hover:text-blue">
                Sign Up
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
