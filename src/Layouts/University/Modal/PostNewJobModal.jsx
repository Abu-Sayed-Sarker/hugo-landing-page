"use client";

import { useState, useEffect } from "react";
import { X, Plus, Calendar } from "lucide-react";
import { useGetJobByIdQuery } from "../../../Api/universityApi";

export default function PostNewJobModal({ job, onSave, onClose }) {
  const { data: jobSingle } = useGetJobByIdQuery(job?.id, { skip: !job?.id });

  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    department: "",
    job_type: "Full Time",
    location: "",
    salary: "",
    description: "",
    posted_date: new Date().toISOString().split("T")[0],
    deadline: "",
    responsibilities: [],
    requirements: [],
    qualifications: [],
    benefits: [],
    application_process: [],
    contact_email: "",
  });

  useEffect(() => {
    // Priority: use jobSingle (detailed data) if available, otherwise fallback to job (summary data)
    const source = jobSingle || job;
    if (source) {
      setFormData({
        id: source.id,
        title: source.title || "",
        company_name: source.company_name || "",
        department: source.department || "",
        job_type: source.job_type || source.type || "Full Time",
        location: source.location || "",
        salary: source.salary || "",
        description: source.description || source.jobDescription || "",
        posted_date: source.posted_date || new Date().toISOString().split("T")[0],
        deadline: source.deadline || "",
        responsibilities: source.responsibilities || [],
        requirements: source.requirements || [],
        qualifications: source.qualifications || [],
        benefits: source.benefits || [],
        application_process: source.application_process || source.applicationProcess || [],
        contact_email: source.contact_email || source.contact?.email || "",
      });
    }
  }, [job, jobSingle]);

  const [currentListInputs, setCurrentListInputs] = useState({
    responsibilities: "",
    requirements: "",
    qualifications: "",
    benefits: "",
    application_process: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleListInput = (field, value) => {
    setCurrentListInputs({ ...currentListInputs, [field]: value });
  };

  const addToList = (field) => {
    if (currentListInputs[field].trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), currentListInputs[field]],
      });
      setCurrentListInputs({ ...currentListInputs, [field]: "" });
    }
  };

  const removeFromList = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#F5E6E3] to-[#DEF0EC] border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {job ? "Editar Trabajo" : "Publicar Nuevo Trabajo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Título del Trabajo</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="ej., Asistente de Investigación"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Nombre de la Empresa</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="ej., Universidad de Dhaka"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                required
              />
            </div>
          </div>

          {/* Department and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="ej., Ciencias de la Computación"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Tipo de Trabajo</label>
              <select
                value={formData.job_type}
                onChange={(e) => handleInputChange("job_type", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue appearance-none bg-white"
              >
                <option value="Full Time">Tiempo Completo</option>
                <option value="Part Time">Medio Tiempo</option>
                <option value="Internship">Pasantía</option>
              </select>
            </div>
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="ej., Remoto / Madrid, ES"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Correo de Contacto</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange("contact_email", e.target.value)}
                placeholder="ej., reclutamiento@dhaka.edu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Salario / Rango</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="ej., $40 por hora"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Fecha de Publicación</label>
              <input
                type="date"
                value={formData.posted_date}
                onChange={(e) => handleInputChange("posted_date", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Fecha Límite de Solicitud</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Descripción del Trabajo</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descripción detallada del trabajo..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
              required
            />
          </div>

          {/* List Fields Helper */}
          {[
            { id: "responsibilities", label: "Responsabilidades", placeholder: "ej., Gestionar plazos de proyectos" },
            { id: "requirements", label: "Requisitos", placeholder: "ej., más de 3 años de experiencia" },
            { id: "qualifications", label: "Cualificaciones Preferidas", placeholder: "ej., certificación PMP" },
            { id: "benefits", label: "Beneficios", placeholder: "ej., horario de trabajo flexible" },
            { id: "application_process", label: "Proceso de Solicitud", placeholder: "ej., envíe su currículum" },
          ].map((listField) => (
            <div key={listField.id}>
              <label className="block font-semibold text-gray-700 mb-1.5">{listField.label}</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentListInputs[listField.id]}
                  onChange={(e) => handleListInput(listField.id, e.target.value)}
                  placeholder={listField.placeholder}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addToList(listField.id))}
                />
                <button
                  type="button"
                  onClick={() => addToList(listField.id)}
                  className="bg-blue text-white px-5 py-2 rounded-lg hover:bg-blue-600 font-bold shadow-sm transition-colors"
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-2">
                {formData[listField.id]?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg group">
                    <span className="text-sm text-gray-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFromList(listField.id, idx)}
                      className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue text-white rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all"
            >
              {job ? "Actualizar Trabajo" : "Publicar Trabajo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
