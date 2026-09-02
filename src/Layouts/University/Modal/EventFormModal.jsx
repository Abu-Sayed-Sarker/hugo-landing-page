"use client";

import { Plus, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function EventFormModal({ event, onSave, onClose, isEdit }) {
  console.log(event);
  const logoInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const getFullImageUrl = (path) => {
    if (!path) return "";
    if (
      path.startsWith("http") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    ) {
      return path;
    }
    return `https://api.clasia.io${path}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    type: "Online",
    status: "Upcoming",
    description: "",
    agenda: [],
    additional: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        agenda:
          event.agendas?.map((a) => ({
            time: a.time_slot,
            title: a.task_title,
            subtitle: a.description,
          })) ||
          event.agenda ||
          [],
        type:
          event.event_type === "In-Person" || event.event_type === "Campus"
            ? "Person"
            : event.event_type || event.type || "Online",
        additional: event.additional_info || event.additional || "",
      });
      if (event.image) setImagePreview(event.image);
    }
  }, [event]);

  const [newAgenda, setNewAgenda] = useState({
    time: "",
    title: "",
    subtitle: "",
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setImageFile(null);
    setImagePreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleAddAgenda = () => {
    if (newAgenda.time.trim() && newAgenda.title.trim()) {
      setFormData((prev) => ({
        ...prev,
        agenda: [...(prev.agenda || []), newAgenda],
      }));
      setNewAgenda({ time: "", title: "", subtitle: "" });
    }
  };

  const handleRemoveAgenda = (index) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("category", formData.category);
    fd.append("date", formData.date);
    fd.append("time", formData.time);
    fd.append("event_type", formData.type);
    fd.append("status", formData.status);
    fd.append("description", formData.description);
    fd.append("additional_info", formData.additional);

    // Map agenda to backend format and stringify
    const agendas = (formData.agenda || []).map((item) => ({
      time_slot: item.time,
      task_title: item.title,
      description: item.subtitle,
    }));
    fd.append("agendas", JSON.stringify(agendas));

    if (imageFile) {
      fd.append("image", imageFile);
    }

    if (isEdit && event?.id) {
      fd.append("id", event.id);
    }

    onSave(fd);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b p-4 ">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Editar Evento" : "Crear Evento"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            {imagePreview ? (
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden group mx-4">
                <img
                  src={getFullImageUrl(imagePreview)}
                  alt="Preview"
                  className="h-full mx-auto object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 bg-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 mx-6 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer h-48"
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Subir Imagen del Evento
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Recomendado: 400x400px
                </span>
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 px-6">
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Evento
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="ej. Jornada de Puertas Abiertas Virtual"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="ej. Bootcamp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="09:00 - 17:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Online">En Línea</option>
                <option value="Person">Presencial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Upcoming">Próximo</option>
                <option value="Completed">Completado</option>
                <option value="Cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="px-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Evento
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu evento aquí..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="px-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Agenda del Evento
            </h3>

            <div className="space-y-4 mb-6">
              {formData.agenda?.map((item, index) => (
                <div key={index} className="flex gap-4 group relative">
                  <div className="w-1/3 text-sm text-gray-600 font-medium pt-1">
                    {item.time}
                  </div>
                  <div className="flex-1 border-l-2 border-blue-100 pl-4 py-1">
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgenda(index)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3 text-center">
                Agregar Ítem a la Agenda
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Hora (ej. 09:00 AM - 10:30 AM)"
                  value={newAgenda.time}
                  onChange={(e) =>
                    setNewAgenda({ ...newAgenda, time: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Título de la Tarea (ej. Introducción)"
                  value={newAgenda.title}
                  onChange={(e) =>
                    setNewAgenda({ ...newAgenda, title: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <textarea
                  placeholder="Subtítulo/Descripción (Opcional)"
                  value={newAgenda.subtitle}
                  onChange={(e) =>
                    setNewAgenda({ ...newAgenda, subtitle: e.target.value })
                  }
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows="2"
                />
                <button
                  type="button"
                  onClick={handleAddAgenda}
                  className="md:col-span-2 bg-blue text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <Plus size={16} /> Agregar a la Agenda
                </button>
              </div>
            </div>
          </div>

          <div className="px-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Información Adicional
            </label>
            <textarea
              name="additional"
              value={formData.additional}
              onChange={handleChange}
              placeholder="Opcional"
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 py-6 border-t px-6 bg-[#F9FAFB] rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue text-white rounded-lg font-medium shadow-md hover:bg-blue-600 transition"
            >
              {isEdit ? "Guardar Cambios" : "Crear Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
