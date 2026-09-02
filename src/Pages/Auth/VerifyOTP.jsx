import { useState } from "react";
import background from "../../assets/images/uniBanner.png";
import signin from "../../assets/images/signin.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useVerifyOtpMutation } from "../../Api/authapi";
import { useSelector } from "react-redux";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const location = useLocation();
  console.log(location.state);
  const email = location.state;
  const navigate = useNavigate();

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value && element.nextElementSibling) {
      element.nextElementSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && e.target.previousElementSibling) {
        e.target.previousElementSibling.focus();
      }
    }
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 4).split("");
    if (data.length > 0) {
      const newOtp = [...otp];
      data.forEach((value, index) => {
        if (index < 4 && !isNaN(value)) {
          newOtp[index] = value;
        }
      });
      setOtp(newOtp);
      // Focus the last filled input or the next empty one
      const lastFilledIndex = data.length < 4 ? data.length : 3;
      //  This part is tricky without refs to specific inputs, but existing focus is okay.
      //  Ideally we update state and let react render.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log(otpCode);
    if (otpCode.length === 4) {
      try {
        const res = await verifyOtp({ email, otp: otpCode }).unwrap();
        toast.success(res.message);
        navigate("/reset-pass", { state: email });
      } catch (err) {
        console.error("Failed to verify:", err.data.error);
        toast.error(err.data?.error || "La verificación falló", {
          position: "bottom-center",
        });
      }
    } else {
      toast.error("Por favor ingresa un código válido de 4 dígitos");
    }
  };

  return (
    <div className="bg-base pb-16 font-inter">
      {/* Header Section */}
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="text-white flex items-center justify-center relative overflow-hidden bg-cover bg-no-repeat h-[50vh]"
      >
        <div className="mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl xl:text-5xl mb-8">
            Verificación
          </h1>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-between w-11/12 mx-auto bg-white mt-8 lg:mt-16">
        <div className="flex items-center justify-center w-1/2 p-8 lg:p-16">
          <div className="w-full">
            <h1 className="text-xl lg:text-4xl text-primary text-center mb-5">
              Verificación
            </h1>

            <p className="text-light text-center mb-5">
              Ingresa el código de 4 dígitos que recibiste en tu correo electrónico.
            </p>

            <div className="space-y-4">
              <div
                className="flex justify-center gap-4 py-4"
                onPaste={handlePaste}
              >
                {otp.map((data, index) => (
                  <input
                    className="w-14 h-14 text-center text-xl bg-base border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              <div className="mx-auto max-w-xs">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-primary w-full text-lg  px-8 text-white py-3 rounded font-medium disabled:opacity-50"
                >
                  {isLoading ? "Cargando..." : "Continuar"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <img
          src={signin}
          alt="Sign In"
          className="md:w-1/2 mx-auto md:mt-6 lg:mt-0"
        />
      </div>
    </div>
  );
}
