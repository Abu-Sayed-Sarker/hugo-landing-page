import { useState, useMemo } from "react";
import {
  MapPin,
  Calendar,
  CheckCircle,
  GraduationCap,
  Building,
} from "lucide-react";
import ApplyJobModal from "../../Layouts/University/Modal/ApplyJobModal";
import { useGetJobDetailsQuery } from "../../Api/universityApi";
import logoPlaceholder from "../../assets/icons/uni_logo.png";

export default function JobDetails({ jobId, onBackClick, all = false }) {
  const { data: job, isLoading, error } = useGetJobDetailsQuery(jobId);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  console.log(job);
  console.log(all);
  // Check if job application deadline has passed
  const isExpired = useMemo(() => {
    if (!job?.deadline) return false;
    try {
      const deadlineDate = new Date(job.deadline);
      const today = new Date();
      // Set hours to 0 to compare only dates
      today.setHours(0, 0, 0, 0);
      return deadlineDate < today;
    } catch (e) {
      console.error("Deadline parsing error:", e);
      return false;
    }
  }, [job?.deadline]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-gray-500">
        Cargando detalles del empleo...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-red-500">
        Error al cargar los detalles del empleo.
      </div>
    );
  if (!job)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-gray-500">
        Empleo no encontrado.
      </div>
    );
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };
  return (
    <div className="min-h-screen bg-base font-inter">
      {/* Header */}
      <div className="bg-primary h-[35vh] md:h-[50vh] text-white py-12 px-8 relative overflow-hidden flex items-center justify-center">
        <div className="md:w-11/12 mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBackClick}
            className="mb-4 md:mb-10 text-white/80 hover:text-white text-sm flex items-center gap-1"
          >
            ← Volver a Empleos
          </button>
          <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-6">
            {job.title}
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-8 text-sm text-sky">
            <span className="flex items-center">
              <Building size={22} className="mr-2" />
              {job.company_name}
            </span>
            <span className="flex items-center">
              <GraduationCap md:size={22} className="mr-2" />
              {job.university_name}
            </span>
            <span className="flex items-center">
              <MapPin size={20} className="mr-2" />
              {job.location}
            </span>
          </div>
          <div className="mt-6">
            <span
              className={`px-4 text-sm py-2 rounded-full bg-white/20 text-white font-medium`}
            >
              {job.job_type}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`py-8 ${all ? "max-w-7xl mx-auto" : ""}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 bg-white rounded-lg p-6 h-fit">
            {/* Job Description */}
            <div className="">
              <h2 className="text-lg font-bold mb-4">Descripción del Empleo</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {job.description}
              </p>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-4">Responsabilidades</h2>
                  <div className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle
                          size={18}
                          strokeWidth={2.75}
                          className="text-green mt-1 flex-shrink-0"
                        />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-lg">
                <h2 className="text-lg font-bold mb-4">Requisitos</h2>
                <div className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        strokeWidth={2.75}
                        className="text-green mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && job.qualifications.length > 0 && (
              <div className="bg-white rounded-lg">
                <h2 className="text-lg font-bold mb-4">Cualificaciones</h2>
                <div className="space-y-3">
                  {job.qualifications.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        strokeWidth={2.75}
                        className="text-green mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-lg">
                <h2 className="text-lg font-bold mb-4">Beneficios</h2>
                <div className="space-y-3">
                  {job.benefits.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        strokeWidth={2.75}
                        className="text-green mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Process */}
            {job.application_process && job.application_process.length > 0 && (
              <div className="bg-white rounded-lg">
                <h2 className="text-lg font-bold mb-4">Proceso de Aplicación</h2>
                <div className="space-y-4">
                  {job.application_process.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 pt-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {job.contact_email && (
              <div className="bg-base rounded-lg p-6 mt-8">
                <h2 className="text-lg font-bold mb-4">Información de Contacto</h2>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    <span className="text-blue">{job.contact_email}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 sticky top-8 shadow-sm">
              {/* Job Details Sidebar */}
              <div className="mb-6">
                <h3 className="font-bold mb-6 text-gray-900 border-b pb-2">
                  Resumen del Empleo
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Tipo de Empleo</span>
                    <span className="font-bold text-gray-900">
                      {job.job_type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Categoría</span>
                    <span className="font-bold text-gray-900">
                      {job.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">
                      Departamento
                    </span>
                    <span className="font-bold text-gray-900">
                      {job.department}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Salario</span>
                    <span className="font-bold text-green">
                      {job.salary || "No Especificado"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Publicado</span>
                    <span className="font-bold text-gray-900">
                      {job.posted_date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Fecha límite</span>
                    <span
                      className={`font-bold ${isExpired ? "text-red" : "text-gray-900"}`}
                    >
                      {job.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-gray-100">
                {isExpired ? (
                  <div className="text-center">
                    <div className="bg-red-50 p-2 mx-auto mb-4 h-12 w-12 text-red rounded-full flex items-center justify-center">
                      <Calendar size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Aplicación Cerrada
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 px-2">
                      La fecha límite para este puesto ha pasado.
                    </p>
                    <button
                      onClick={onBackClick}
                      className="w-full py-2.5 rounded-lg font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm"
                    >
                      Explorar otros empleos
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full py-3.5 bg-blue text-white rounded-lg font-bold shadow-lg hover:shadow-blue-200 hover:bg-blue-600 transition-all text-sm mb-3"
                    >
                      Aplicar Ahora
                    </button>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      ¡Date prisa! La aplicación está abierta
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* University Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 p-1 flex-shrink-0 border border-gray-100 overflow-hidden">
                  <img
                    src={job.univ_logo}
                    alt="University Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-900 leading-tight">
                  {job.university_name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Este puesto está publicado a través de los servicios profesionales de {job.university_name}.
                Únete a nuestra comunidad global de académicos e innovadores.
              </p>
              <button
                onClick={onBackClick}
                className="text-sm font-bold text-blue bg-blue-50 w-full py-2.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Ver Perfil de la Universidad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <ApplyJobModal job={job} onClose={() => setIsApplyModalOpen(false)} />
      )}
    </div>
  );
}
