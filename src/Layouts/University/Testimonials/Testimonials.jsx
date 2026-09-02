"use client";

import { useState } from "react";
import TestimonialDetailsModal from "../Modal/TestimonialDetailsModal";
import { ArrowLeft, CircleCheckBig, CirclePlus, Star } from "lucide-react";
import {
  useGetUniversityTestimonialsQuery,
  useUpdateTestimonialStatusMutation,
} from "../../../Api/universityApi";
import toast from "react-hot-toast";

export default function Testimonials() {
  const {
    data: testimonialsData,
    isLoading,
    error,
  } = useGetUniversityTestimonialsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateTestimonialStatusMutation();

  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://api.clasia.io${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const mapTestimonial = (t) => ({
    ...t,
    author: t.student_name,
    program: t.student_title,
    date: formatDate(t.created_at),
    rating: 5, // Default rating as API doesn't provide it
    title: "Student Testimonial", // Default title
  });

  const handleStatusUpdate = async (id, action) => {
    try {
      await updateStatus({ id, action }).unwrap();
      toast.success(
        `Testimonio ${action === "approve" ? "aprobado" : "rechazado"} con éxito!`,
      );
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.error || `Error al ${action === "approve" ? "aprobar" : "rechazar"} el testimonio`);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando testimonios...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar los testimonios.
      </div>
    );

  const allTestimonials = (testimonialsData || []).map(mapTestimonial);
  const pendingTestimonials = allTestimonials.filter(
    (t) => t.status === "pending",
  );
  const processedTestimonials = allTestimonials.filter(
    (t) => t.status !== "pending",
  );

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < rating ? "#EAB308" : "none"}
            color={i < rating ? "#EAB308" : "#9CA3AF"}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "text-[#15803D]";
    if (status === "rejected") return "text-[#B91C1C]";
    return "bg-yellow-100 text-yellow-700";
  };

  const getStatusText = (status) => {
    if (status === "approved") return "Aprobado";
    if (status === "rejected") return "Rechazado";
    return "Pendiente";
  };

  if (showAllTestimonials) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center justify-between w-full gap-4">
            <button
              onClick={() => setShowAllTestimonials(false)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Volver
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Todos los Testimonios
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          {allTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-4 items-center">
                  {testimonial.photo && (
                    <img
                      src={getFullUrl(testimonial.photo)}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {testimonial.author}
                    </h3>
                    <p className="text-gray-600">{testimonial.date}</p>
                    <p className="text-gray-600 font-medium">
                      {testimonial.program}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    testimonial.status,
                  )}`}
                >
                  {getStatusText(testimonial.status)}
                </span>
              </div>

              <div className="mb-2">{renderStars(testimonial.rating)}</div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {testimonial.content}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setViewingTestimonial(testimonial)}
                  className="text-blue hover:text-blue-700 font-medium"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {viewingTestimonial && (
          <TestimonialDetailsModal
            testimonial={viewingTestimonial}
            onClose={() => setViewingTestimonial(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 font-inter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Moderación de Testimonios
        </h1>
        <button
          onClick={() => setShowAllTestimonials(true)}
          className="text-blue hover:text-blue-700 font-medium"
        >
          Todos los Testimonios
        </button>
      </div>

      {/* Pending Review Section */}
      <div className="mb-12 border p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          Revisión Pendiente{" "}
          <span className="bg-blue/10 text-blue px-2 py-0.5 rounded text-sm">
            {pendingTestimonials.length}
          </span>
        </h2>

        <div className="space-y-4">
          {pendingTestimonials.length > 0 ? (
            pendingTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-blue/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    {testimonial.photo && (
                      <img
                        src={getFullUrl(testimonial.photo)}
                        alt={testimonial.author}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {testimonial.author}
                      </h3>
                      <p className="text-gray-500 mb-1">
                        {testimonial.program}
                      </p>
                      <div className="flex items-center gap-3">
                        {renderStars(testimonial.rating)}
                        <span className="text-xs text-gray-400 font-medium">
                          Enviado: {testimonial.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleStatusUpdate(testimonial.id, "approve")
                      }
                      disabled={isUpdating}
                      className="bg-[#DCFCE7] text-[#15803D] px-4 py-2 rounded-lg transition-all flex items-center gap-2 hover:bg-[#bbf7d0] disabled:opacity-50"
                    >
                      <CircleCheckBig size={18} strokeWidth={2.75} /> Aprobar
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(testimonial.id, "reject")
                      }
                      disabled={isUpdating}
                      className="bg-[#FEE2E2] text-[#B91C1C] px-4 py-2 rounded-lg transition-all flex items-center gap-2 hover:bg-[#fecaca] disabled:opacity-50"
                    >
                      <CirclePlus
                        size={18}
                        strokeWidth={2.75}
                        className="rotate-45"
                      />{" "}
                      Rechazar
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed bg-gray-50 p-4 rounded-lg italic">
                  "{testimonial.content}"
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setViewingTestimonial(testimonial)}
                    className="text-blue hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-400 font-medium">
                No hay testimonios pendientes para revisar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recently Processed Section */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Procesados Recientemente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedTestimonials.length > 0 ? (
            processedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`rounded-xl p-5 shadow-sm border transition-all ${
                  testimonial.status === "approved"
                    ? "bg-[#F0FDF4] border-green-100 hover:border-green-300"
                    : "bg-[#FEF2F2] border-red-100 hover:border-red-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    {testimonial.photo && (
                      <img
                        src={getFullUrl(testimonial.photo)}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover border bg-white"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {testimonial.author}
                      </h3>
                      <p className="text-gray-500 font-medium">
                        {testimonial.date} • {testimonial.program}
                      </p>
                    </div>
                  </div>
                  <span
                    className={` py-1 flex items-center gap-1.5 rounded-full ${getStatusColor(
                      testimonial.status,
                    )}`}
                  >
                    <CircleCheckBig size={18} strokeWidth={3} />{" "}
                    {getStatusText(testimonial.status)}
                  </span>
                </div>

                <div className="mb-3">{renderStars(testimonial.rating)}</div>

                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {testimonial.content}
                </p>

                <div className="flex justify-between items-center border-t pt-3 border-black/5">
                  <button
                    onClick={() => setViewingTestimonial(testimonial)}
                    className="text-blue hover:underline"
                  >
                    Ver Detalles Completos
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-400">Aún no hay testimonios procesados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Testimonial Details Modal */}
      {viewingTestimonial && (
        <TestimonialDetailsModal
          testimonial={viewingTestimonial}
          onClose={() => setViewingTestimonial(null)}
        />
      )}
    </div>
  );
}
