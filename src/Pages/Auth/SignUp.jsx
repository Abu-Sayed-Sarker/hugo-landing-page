import { useContext, useState } from "react";
import background from "../../assets/images/uniBanner.png";
import signupImg from "../../assets/images/signup.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSignupMutation } from "../../Api/authapi";
import { AuthContext } from "../../Provider/AuthProvider";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleGoogleLogin, handleAppleLogin } = useContext(AuthContext);
  const [signup, { isLoading }] = useSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields
    if (fullName && phone && email && password) {
      try {
        const res = await signup({
          full_name: fullName,
          // phone,
          email,
          password,
          role: "student",
        }).unwrap();
        console.log("Sign up successful:", res);
        navigate("/");
        // window.location.reload(); // Removed reload to allow SPA navigation
      } catch (err) {
        console.error("Sign up failed:", err.data.email[0]);
        // toast.error(err.data.phone[0], {
        //   position: "bottom-center"
        // })
        toast.error(err.data.email[0], {
          position: "bottom-center"
        })
      }
    }
  };

  const handleSocialLogin = () => {
    setLoading(true)
    handleGoogleLogin()
      .then(async (res) => {
        console.log(res)
        const data = {
          full_name: res.user?.displayName,
          email: res.user?.email,
          password: res.user?.uid, // Using uid as password for social login
          role: "student",
        };
        const response = await signup(data).unwrap();
        setLoading(false);
        toast.success("Inicio de sesión exitoso.");
        navigate("/");
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.data?.error?.[0], {
          position: "bottom-center",
        });
        setLoading(false);
      });
  };

  const handleAppleSocialLogin = () => {
    setLoading(true)
    handleAppleLogin()
      .then(async (res) => {
        console.log(res)
        const data = {
          full_name: res.user?.displayName || "Apple User",
          email: res.user?.email,
          password: res.user?.uid, // Using uid as password for social login
          role: "student",
        };
        const response = await signup(data).unwrap();
        setLoading(false);
        toast.success("Inicio de sesión exitoso.");
        navigate("/");
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.data?.error?.[0] || "Error al registrarse con Apple", {
          position: "bottom-center",
        });
        setLoading(false);
      });
  };
  return (
    <div className="bg-base pb-16">
      {/* Header Section */}
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="text-white flex items-center justify-center relative overflow-hidden bg-cover bg-no-repeat h-[50vh]"
      >
        <div className="mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-8">
            Regístrate
          </h1>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-between w-11/12 mx-auto bg-white mt-8 lg:mt-16">
        <div className="flex items-center justify-center w-full p-8 lg:p-16">
          <div className="w-full">
            <h1 className="text-3xl font-semibold mb-8 border-b pb-4 border-[#E2E1E1]">
              REGÍSTRATE
            </h1>



            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={fullName}
                  placeholder="Nombre completo *"
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  placeholder="Número de teléfono *"
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  placeholder="Correo electrónico *"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  placeholder="Contraseña *"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center pt-6 justify-between">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue px-8 text-white py-3 rounded font-medium disabled:opacity-50"
                >
                  {isLoading ? "Registrando..." : "Regístrate"}
                </button>

                <div className="flex gap-4 justify-center items-center">
                  <span className="px-4  text-gray-500">
                    o regístrate con
                  </span>
                  <div className="flex gap-2">
                    <button disabled={loading} onClick={handleSocialLogin} className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                    </button>
                    <button type="button" disabled={loading} onClick={handleAppleSocialLogin} className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 3 .99-.08 2.12-.61 2.8-1.44" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <p className=" text-gray-600">
                ¿Ya tienes una cuenta?
                <Link to={"/login"}>
                  <button className="text-blue-600 font-medium hover:underline ml-2">
                    Iniciar sesión
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <img src={signupImg} alt="Sign In" className="md:w-1/2 mx-auto md:mt-6 lg:mt-0" />
      </div>
    </div>
  );
}
