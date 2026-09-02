"use client";

import { Download, User, MapPin, Calendar, BookOpen, Building, Briefcase, Info } from "lucide-react";

export default function StudentApplicationDetailsModal({
  application,
  onClose,
  getDocumentsList,
  formatDate
}) {
  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const docs = getDocumentsList ? getDocumentsList(application) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 flex-shrink-0">
            Detalles de Solicitud del Estudiante
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Profile Section */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="w-20 h-20 bg-blue/10 rounded-full flex items-center justify-center border-2 border-blue/20">
              <span className="text-3xl text-blue">
                {getInitials(application.full_name)}
              </span>
            </div>
            <div>
              <h3 className="text-2xl mb-1 font-semibold text-gray-900">
                {application.full_name}
              </h3>
              <p className="text-gray-600 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm tracking-wider ${application.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  application.status === 'Approved' ? 'bg-green/20 text-green-700' : 'bg-red text-white'
                  }`}>
                  {application.status}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-4">
                <User size={14} /> Información Personal
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500">Correo Electrónico</p>
                  <p className="font-semibold text-gray-900">{application.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Número de Teléfono</p>
                  <p className="font-semibold text-gray-900">{application.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-semibold text-gray-900">{application.date_of_birth || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Lugar de Nacimiento y Nacionalidad</p>
                  <p className="font-semibold text-gray-900">
                    {application.place_of_birth} / {application.nationality}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> Dirección Residencial
                  </p>
                  <p className="font-semibold text-gray-900">{application.address || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Application Data */}
            <div className="space-y-4">
              <h4 className=" text-blue uppercase tracking-widest  flex items-center gap-2">
                <Info size={14} /> Detalles de la Solicitud
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 flex items-center gap-1"><BookOpen size={12} /> Programa Deseado</p>
                  <p className=" text-gray-900 text-base">{application.desired_program}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1"><Building size={12} /> Campus Preferido</p>
                  <p className="font-semibold text-gray-900">{application.campus || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1"><Calendar size={12} /> Fecha de Envío</p>
                  <p className="font-semibold text-gray-900">{formatDate(application.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">ID de Solicitud</p>
                  <p className="font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded w-fit">
                    #{application.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Academic Background */}
            <div className="space-y-4">
              <h4 className="text-blue uppercase flex items-center gap-2">
                <BookOpen size={14} /> Antecedentes
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 mb-1">Estudios Previos</p>
                  <p className="font-medium text-gray-900">
                    {application.previous_studies || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1 mb-1"><Briefcase size={12} /> Situación Actual</p>
                  <p className="font-medium text-gray-900">{application.current_situation || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h4 className=" text-blue uppercase">Otros Detalles</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 mb-1">Necesidades Especiales</p>
                  <p className="font-medium text-gray-900">{application.special_needs || "No Especificado"}</p>
                </div>
                <div>
                </div>
              </div>
            </div>
            <div className="space-y-4 col-span-2">
              <h4 className=" text-blue uppercase">Carta de Interés</h4>
              <div className="space-y-3 border w-full p-4 rounded">
                <div>
                  <p className="font-medium text-gray-900">{application.letter_of_interest || "No Especificado"}</p>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {docs.length > 0 && (
            <div className="space-y-4">
              <h4 className=" text-blue uppercase">Documentos Adjuntos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border rounded-xl transition-all group"
                  >
                    <div className="truncate pr-4">
                      <p className=" text-gray-500">{doc.name}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">Documento {idx + 1}</p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue bg-white p-2 rounded-lg shadow-sm group-hover:bg-blue group-hover:text-white transition-all transform group-hover:scale-110"
                    >
                      <Download size={18} strokeWidth={2.5} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
