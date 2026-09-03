"use client";

import { useState } from "react";
import UniversityDetailsModal from "../Modal/UniversityDetailsModal";
import uni_logo from "../../../assets/icons/uni_logo.png";
import {
  useGetOnboardingListQuery,
  useManageOnboardingMutation,
} from "../../../Api/universityApi";
import toast from "react-hot-toast";

const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-[#DCFCE7] text-[#166534]";
    case "pending":
      return "bg-[#FEF9C3] text-[#854D0E]";
    case "rejected":
      return "bg-[#FEE2E2] text-[#991B1B]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Universities() {
  const {
    data: universitiesData = [],
    isLoading,
    error,
  } = useGetOnboardingListQuery();
  const [manageOnboarding, { isLoading: isManaging }] =
    useManageOnboardingMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando incorporaciones...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar la lista de incorporaciones.
      </div>
    );

  const filteredUniversities = universitiesData.filter(
    (uni) =>
      uni.univ_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUniversities = filteredUniversities.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleViewUniversity = (university) => {
    setSelectedUniversity(university);
    setShowModal(true);
  };

  const handleAction = async (id, action) => {
    try {
      const res = await manageOnboarding({ id, action }).unwrap();
      toast.success(res.message || `Universidad ${action === "approve" ? "aprobada" : "rechazada"} exitosamente`, {
        position: "bottom-center",
      });
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || `Error al ${action === "approve" ? "aprobar" : "rechazar"} la universidad`, {
        position: "bottom-center",
      });
    }
  };

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  return (
    <div className="p-6 h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Incorporación de Universidad Asociada
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o correo electrónico..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Universities List */}
      <div className="space-y-4">
        {paginatedUniversities.length > 0 ? (
          paginatedUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                  <img
                    src={
                      university?.logo ? getFullUrl(university.logo) : uni_logo
                    }
                    alt={university.univ_name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {university.univ_name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {university.location || "Sin dirección proporcionada"}
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-4 w-full md:w-auto justify-between md:justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeColor(
                    university.status,
                  )}`}
                >
                  {university.status?.toLowerCase() === "approved" ? "aprobado" : university.status?.toLowerCase() === "pending" ? "pendiente" : university.status?.toLowerCase() === "rejected" ? "rechazado" : university.status}
                </span>
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  Solicitado el: {university.applied_on}
                </span>
                <button
                  onClick={() => handleViewUniversity(university)}
                  className="text-blue font-semibold text-sm px-5 py-2 bg-blue/5 hover:bg-blue/10 rounded-lg transition-colors border border-blue/10"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              No se encontraron universidades que coincidan con su búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            ← Anterior
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                  currentPage === page
                    ? "bg-blue border-blue text-white shadow-md shadow-blue/20"
                    : "border-gray-300 hover:border-blue hover:text-blue"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UniversityDetailsModal
          university={selectedUniversity}
          onClose={() => setShowModal(false)}
          onApprove={() => handleAction(selectedUniversity.id, "approve")}
          onReject={() => handleAction(selectedUniversity.id, "reject")}
          isProcessing={isManaging}
        />
      )}
    </div>
  );
}
