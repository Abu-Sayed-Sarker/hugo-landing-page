"use client"

import { Mail } from "lucide-react"
import { useGetEventRegistrationsQuery } from "../../../Api/universityApi"

export default function ViewRegistrationsModal({ event, onClose }) {
  const { data, isLoading, error } = useGetEventRegistrationsQuery(event?.id, {
    skip: !event?.id,
  })

  const registrations = data?.registrations || []
  const totalRegistrations = data?.total_registrations || 0

  const handleEmailAll = () => {
    if (registrations.length === 0) return
    const emails = registrations.map((r) => r.email).join(",")
    window.location.href = `mailto:?bcc=${emails}&subject=Actualización sobre ${event?.title}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Inscripciones para {event?.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Error al cargar inscripciones. Por favor, intente de nuevo.
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-900">
                  Total de inscripciones: <span className="font-bold">{totalRegistrations}</span>
                </div>
                <button
                  onClick={handleEmailAll}
                  disabled={registrations.length === 0}
                  className={`text-blue text-sm font-medium flex items-center gap-2 ${registrations.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
                    }`}
                >
                  <Mail size={20} strokeWidth={2.5} /> Enviar correo a todos
                </button>
              </div>

              {/* Registrations Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#F9FAFB]">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Nombre</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Correo</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Título</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Inscrito el</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length > 0 ? (
                      registrations.map((registration, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-900">{registration.name}</td>
                          <td className="py-3 px-2 text-gray-600">{registration.email}</td>
                          <td className="py-3 px-2 text-gray-600">{registration.title}</td>
                          <td className="py-3 px-2 text-gray-600">{registration.registered_on}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-gray-500">
                          No hay inscripciones aún.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end bg-[#F9FAFB]">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue text-white rounded-lg font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
