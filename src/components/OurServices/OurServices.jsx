import service1 from "../../assets/icons/service1.png";
import service2 from "../../assets/icons/service2.png";
import service3 from "../../assets/icons/service3.png";
import service4 from "../../assets/icons/service4.png";
export default function OurServices() {
  return (
    <section
      className="w-full py-6 md:py-10 lg:py-16"
    >
      {/* Background image can be added via CSS or inline style */}
      <div className="w-11/12 mx-auto px-0 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-[#374151] max-w-2xl mx-auto">
            Apoyo integral para tu viaje educativo
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service 1: Program Matching */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service1} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-3">
              Búsqueda de Programas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Encuentra el programa académico perfecto que se alinee con tus
              metas profesionales e intereses.
            </p>
          </div>

          {/* Service 2: Scholarship Finder */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service2} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-3">
              Buscador de Becas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Descubre becas y oportunidades de ayuda financiera adaptadas a
              tu perfil.
            </p>
          </div>

          {/* Service 3: Events & Webinars */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service3} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-1">
              Eventos y Seminarios web
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Asiste a eventos virtuales y presenciales para conectarte con
              representantes de las universidades.
            </p>
          </div>

          {/* Service 4: Career Resources */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service4} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-3">
              Recursos Profesionales
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Accede a pasantías, oportunidades laborales y recursos de
              desarrollo profesional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
