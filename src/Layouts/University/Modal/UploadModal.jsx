"use client"

import { useRef, useState } from "react"
import toast from "react-hot-toast"

export default function UploadModal({ onUpload, onClose }) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState("")

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const fileData = {
      file: file,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
      url: URL.createObjectURL(file),
    }
    setSelectedFile(fileData)
    if (!title) setTitle(file.name.split('.')[0])
  }

  const handleUpload = () => {
    if (selectedFile && title) {
      onUpload({
        file: selectedFile.file,
        title: title,
        media_type: selectedFile.type
      })
      setSelectedFile(null)
      setTitle("")
    } else {
      toast.error("Por favor, proporciona un título y selecciona un archivo")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Subir Medio</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título del Medio *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa el título del medio (ej. Convocatoria Universitaria)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Drop Zone */}
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
            >
              <div className="text-4xl mb-3">📁</div>
              <p className="font-medium text-gray-900 mb-1">Arrastra y suelta tu archivo aquí</p>
              <p className="text-sm text-gray-500">o haz clic para explorar (Imágenes, Videos, Documentos PDF)</p>
              <input
                ref={inputRef}
                type="file"
                onChange={handleChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </div>
          ) : (
            <div className="relative border p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                  {selectedFile.type === "image" ? (
                    <img src={selectedFile.url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">
                      {selectedFile.type === "video" ? "🎥" : "📄"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{selectedFile.size}</p>
                  <p className="text-xs text-blue-600 uppercase font-bold mt-1">{selectedFile.type}</p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !title}
            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Subir Medio
          </button>
        </div>
      </div>
    </div>
  )
}
