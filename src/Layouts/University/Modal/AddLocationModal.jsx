"use client"

import { useState } from "react"
import { X } from 'lucide-react'

export default function AddLocationModal({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({ name: "", address: "" })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-6 px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Agregar Ubicación</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-6 py-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Ubicación</label>
            <input
              type="text"
              placeholder="ej. Campus Principal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="p-6 py-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              placeholder="ej. Av. Principal #5"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 px-6 bg-[#F9FAFB] py-4 border-t rounded-b-lg">
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
  )
}
