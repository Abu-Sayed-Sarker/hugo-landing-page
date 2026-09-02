"use client";
import { Calendar } from "lucide-react";

export default function JobsTable({ jobs, onView, onEdit, onDelete, searchTerm, setSearchTerm }) {
  console.log(jobs);
  return (
    <div>
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Buscar trabajos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                ID del Trabajo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Título del Trabajo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Departamento
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Ubicación
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Solicitudes
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center text-gray-600">{job.id}</td>
                <td className="px-6 py-4 text-sm flex flex-col gap-1">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> Publicado: {job.posted_date}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {job.department}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.job_type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {job.location}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {job.applications}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium ${job.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                      {job.status}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">Vence: {job?.deadline}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onView(job)}
                      className="text-blue hover:underline"
                      title="Ver"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => onEdit(job)}
                      className="text-blue hover:underline"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(job.id)}
                      className="text-red hover:underline font-medium"
                      title="Eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
