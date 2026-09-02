"use client"

import { FileText, Calendar, Info, Type } from "lucide-react"

export default function ViewMediaModal({ media, onClose, getFullUrl }) {
  const getMediaPreview = () => {
    const fileUrl = getFullUrl ? getFullUrl(media.file) : media.file;

    if (media.media_type === "image") {
      return (
        <img
          src={fileUrl || "/placeholder.svg"}
          alt={media.title}
          className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
        />
      )
    } else if (media.media_type === "video") {
      return (
        <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl">
          <video controls className="w-full max-h-[60vh]">
            <source src={fileUrl} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        </div>
      )
    } else {
      return (
        <div className="bg-gray-50 p-16 rounded-2xl text-center border-2 border-dashed border-gray-200 w-full max-w-md">
          <div className="bg-white p-6 rounded-2xl shadow-sm inline-block mb-6 border">
            <FileText className="w-16 h-16 text-blue" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{media.title}</h3>
          <p className="text-gray-500 mb-8">Archivo de Documento (PDF/DOCX)</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Abrir Documento
          </a>
        </div>
      )
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue/10 rounded-lg">
              <Info className="w-5 h-5 text-blue" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{media.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-8 flex justify-center bg-gray-50/30 overflow-y-auto">
          {getMediaPreview()}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border shadow-sm text-blue">
                <Type size={16} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Tipo de Archivo</p>
                <p className="font-bold text-gray-900 capitalize">{media.media_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border shadow-sm text-blue">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Fecha de Subida</p>
                <p className="font-bold text-gray-900">{formatDate(media.created_at)}</p>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
