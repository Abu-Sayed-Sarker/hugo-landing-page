import React from "react";
import background from "../../assets/images/uniBanner.png";
import about from "../../assets/images/about.png";
import icon from "../../assets/icons/about.png";

export default function About() {
  return (
    <div className="bg-base pb-16">
      {/* Header Section */}
      <div
        style={{ backgroundImage: `url(${background})` }}
        className="text-white flex items-center justify-center relative overflow-hidden bg-cover bg-no-repeat h-[50vh]"
      >
        <div className="mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-8 uppercase">
            Sobre Nosotros
          </h1>
        </div>
      </div>
      <div className="flex justify-center gap-16 items-center w-11/12 mx-auto mt-16">
        <img src={about} alt="Sign In" className="" />

        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* About Us Label */}
            <div className="flex items-center gap-2 mb-6">
              <img src={icon} alt="" />
              <span className="text-blue uppercase">
                Sobre Nosotros
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold text-[#0E2A46] leading-snug">
              Tu puerta hacia un futuro brillante en la
              <span className="text-blue ml-2">Educación Global</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg my-10 leading-relaxed">
              Empoderamos a los estudiantes proporcionando una plataforma unificada para explorar las mejores
              universidades, programas académicos especializados y pasantías que definen su carrera.
              Nuestra plataforma está diseñada para simplificar tu viaje educativo
              y ayudarte a desbloquear oportunidades de clase mundial.
            </p>

            {/* Mission and Vision Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Our Mission Card */}
              <div className="">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  NUESTRA MISIÓN:
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Cerrar la brecha entre los estudiantes y las instituciones
                  prestigiosas, asegurando que cada estudiante tenga acceso a los
                  recursos, eventos y trabajos adecuados para lograr sus objetivos
                  académicos y profesionales.
                </p>
              </div>

              {/* Our Vision Card */}
              <div className="">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  NUESTRA VISIÓN:
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Ser el destino global más confiable para el empoderamiento
                  estudiantil, donde la educación se encuentra con la oportunidad, y cada
                  ambición encuentra su camino perfecto hacia el éxito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
