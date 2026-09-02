"use client";
import { Download, Mail, Phone, User } from "lucide-react";

export default function JobApplicationsTable({ applications }) {
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Nombre del Estudiante
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Información de Contacto
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              ID del Trabajo
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Currículum
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              Carta de Presentación
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue/10 rounded-full flex items-center justify-center text-blue">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {app.first_name} {app.last_name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" /> {app.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />{" "}
                    {app.phone_number}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                  Trabajo #{app.job}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                {app.resume ? (
                  <a
                    href={getFullUrl(app.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue/5 text-blue rounded-md hover:bg-blue/10 transition-colors font-medium border border-blue/10"
                  >
                    <Download size={14} /> Currículum
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Sin Currículum</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">
                {app.cover_letter ? (
                  <a
                    href={getFullUrl(app.cover_letter)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors font-medium border border-gray-200"
                  >
                    <Download size={14} /> Descargar
                  </a>
          ) : (
          <span className="text-gray-400 italic">Sin Carta de Presentación</span>
                )}
        </td>
      </tr>
      ))
}
      {
        applications.length === 0 && (
          <tr>
            <td
              colSpan="5"
              className="px-6 py-12 text-center text-gray-500 italic"
            >
              No se encontraron solicitudes.
            </td>
          </tr>
        )}
          </tbody>
      </table >
    </div >
  );
}
