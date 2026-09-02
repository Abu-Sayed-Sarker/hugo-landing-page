"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { useGetJobByIdQuery } from "../../../Api/universityApi";

export default function JobDetailsModal({ job, onClose }) {
  const { data: jobDetails, isLoading, error } = useGetJobByIdQuery(job?.id);

  const displayJob = jobDetails || job;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-gray-900">Detalles del Trabajo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue mb-2" size={40} />
            <p className="text-gray-500 font-medium">Cargando detalles del trabajo...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-red-500 font-semibold mb-2">Error al cargar los detalles del trabajo.</p>
            <button onClick={onClose} className="text-blue font-medium hover:underline">Cerrar</button>
          </div>
        ) : (
          <div className="col-span-2 space-y-6 bg-white rounded-lg p-6">
            {/* Job Description */}
            <div className="">
              <h2 className="text-lg font-bold mb-3 text-gray-900">Descripción del Trabajo</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {displayJob.description || displayJob.jobDescription}
              </p>

              {displayJob.responsibilities && displayJob.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-4 text-gray-900">Responsabilidades</h2>
                  <div className="space-y-3">
                    {displayJob.responsibilities.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle
                          size={18}
                          className="text-green flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Requirements */}
            {displayJob.requirements && displayJob.requirements.length > 0 && (
              <div className="bg-white rounded-lg mb-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Requisitos</h2>
                <div className="space-y-3">
                  {displayJob.requirements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-green flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Qualifications */}
            {displayJob.qualifications && displayJob.qualifications.length > 0 && (
              <div className="bg-white rounded-lg mb-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">
                  Cualificaciones Preferidas
                </h2>
                <div className="space-y-3">
                  {displayJob.qualifications.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-green flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {displayJob.benefits && displayJob.benefits.length > 0 && (
              <div className="bg-white rounded-lg mb-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Beneficios</h2>
                <div className="space-y-3">
                  {displayJob.benefits.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-green flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Application Process */}
            {(displayJob.application_process || displayJob.applicationProcess) && (
              <div className="bg-white rounded-lg mb-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Proceso de Solicitud</h2>
                <div className="space-y-4">
                  {(displayJob.application_process || displayJob.applicationProcess).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(displayJob.contact_email || displayJob.contact) && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Información de Contacto</h2>
                <div className="space-y-3">
                  {displayJob.contact_email && (
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-bold text-gray-900">Correo:</span>{" "}
                      <a href={`mailto:${displayJob.contact_email}`} className="text-blue hover:underline">{displayJob.contact_email}</a>
                    </p>
                  )}
                  {displayJob.contact?.phone && (
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-bold text-gray-900">Teléfono:</span>{" "}
                      {displayJob.contact.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
