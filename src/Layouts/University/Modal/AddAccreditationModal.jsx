"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddAccreditationModal({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    valid_until: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure dashes for yyyy-mm-dd format
    const cleanedData = {
      ...formData,
      valid_until: formData.valid_until.replaceAll("/", "-"),
    };
    onAdd(cleanedData);
    setFormData({ name: "", valid_until: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-6 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Agregar Acreditación</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-6 py-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Acreditación
            </label>
            <input
              type="text"
              placeholder="ej. New England Commission of Higher Education"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="p-6 py-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Válido Hasta
            </label>
            <input
              type="date"
              placeholder="yyyy-mm-dd"
              value={formData.valid_until}
              onChange={(e) =>
                setFormData({ ...formData, valid_until: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 px-6 bg-[#F9FAFB] py-4 border-t rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue text-white rounded-lg"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
