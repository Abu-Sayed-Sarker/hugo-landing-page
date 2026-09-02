"use client";

import { useState } from "react";
import UploadModal from "../Modal/UploadModal";
import ViewMediaModal from "../Modal/ViewMediaModal";
import DeleteMediaModal from "../Modal/DeleteMediaModal";
import {
  Upload,
  Layers,
  Image,
  Video,
  FileText,
  Eye,
  Trash2,
  Folder,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useGetUniversityMediaQuery,
  useUploadUniversityMediaMutation,
  useDeleteUniversityMediaMutation,
} from "../../../Api/universityApi";
import toast from "react-hot-toast";

export default function UniGallery() {
  const {
    data: mediaResponse,
    isLoading,
    error,
  } = useGetUniversityMediaQuery();
  const [uploadMedia] = useUploadUniversityMediaMutation();
  const [deleteMedia, { isLoading: isDeleting }] =
    useDeleteUniversityMediaMutation();

  const [activeTab, setActiveTab] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [deletingMedia, setDeletingMedia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://api.clasia.io${path}`;
  };

  const getFilteredMedia = () => {
    let files = mediaResponse || [];

    // Apply tab filter
    if (activeTab === "images") {
      files = files.filter((m) => m.media_type === "image");
    } else if (activeTab === "videos") {
      files = files.filter((m) => m.media_type === "video");
    } else if (activeTab === "documents") {
      files = files.filter((m) => m.media_type === "document");
    }

    // Apply search filter
    if (searchTerm) {
      files = files.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return files;
  };

  const handleUpload = async (uploadData) => {
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("title", uploadData.title);
    formData.append("media_type", uploadData.media_type);

    try {
      await uploadMedia(formData).unwrap();
      toast.success("Medio subido con éxito");
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.detail || "Error al subir el medio");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMedia) return;
    try {
      await deleteMedia(deletingMedia.id).unwrap();
      toast.success("Archivo multimedia eliminado con éxito");
      setDeletingMedia(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Error al eliminar el archivo multimedia");
    }
  };

  const filteredMedia = getFilteredMedia();

  const getIconForType = (type) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-blue" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "document":
        return <FileText className="w-5 h-5 text-orange-500" />;
      default:
        return <Layers className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">Cargando galería...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar la galería de medios.
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Galería</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Upload size={18} strokeWidth={2.5} /> Subir Medio
        </button>
      </div>

      {/* Search and View Options */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Buscar medio por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {[
          { id: "all", label: "Todos los Medios" },
          { id: "images", label: "Imágenes" },
          { id: "videos", label: "Videos" },
          { id: "documents", label: "Documentos" }
        ].map(({ id: tab, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 transition-all whitespace-nowrap font-medium flex items-center gap-2 rounded-lg ${activeTab === tab
                ? "text-blue bg-blue/10 shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab === "all" && <Folder className="w-4 h-4" />}
            {tab === "images" && <Image className="w-4 h-4" />}
            {tab === "videos" && <Video className="w-4 h-4" />}
            {tab === "documents" && <FileText className="w-4 h-4" />}
            <span className="capitalize">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No se encontraron archivos multimedia en esta categoría.
            </p>
          </div>
        ) : (
          filteredMedia.map((media) => (
            <div
              key={media.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border group"
            >
              {/* Thumbnail */}
              <div className="relative bg-gray-100 aspect-square overflow-hidden flex items-center justify-center">
                {media.media_type === "image" ? (
                  <img
                    src={getFullUrl(media.file)}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : media.media_type === "video" ? (
                  <video
                    src={getFullUrl(media.file)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    {media.file?.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        src={`${getFullUrl(media.file)}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-none pointer-events-none opacity-60 scale-90 group-hover:scale-100 transition-transform"
                        title={media.title}
                      />
                    ) : (
                      <div className="text-5xl text-blue-300">📄</div>
                    )}
                  </div>
                )}

                {/* Overlay with actions on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button
                    onClick={() => setViewingMedia(media)}
                    className="bg-white text-gray-900 p-3 rounded-xl hover:bg-blue hover:text-white transition-all transform hover:scale-110"
                    title="Ver"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeletingMedia(media)}
                    className="bg-white text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-4 border-t">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1">
                    {getIconForType(media.media_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-gray-900 truncate"
                      title={media.title}
                    >
                      {media.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium flex items-center gap-1">
                      <Folder size={10} />
                      {new Date(media.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onUpload={handleUpload}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* View Media Modal */}
      {viewingMedia && (
        <ViewMediaModal
          media={viewingMedia}
          onClose={() => setViewingMedia(null)}
          getFullUrl={getFullUrl}
        />
      )}

      {/* Delete Media Modal */}
      {deletingMedia && (
        <DeleteMediaModal
          media={deletingMedia}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingMedia(null)}
        />
      )}
    </div>
  );
}
