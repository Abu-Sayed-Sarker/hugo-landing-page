"use client";

export default function TestimonialDetailsModal({ testimonial, onClose }) {
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "bg-[#DCFCE7] text-[#15803D]";
    if (status === "rejected") return "bg-[#FEE2E2] text-[#B91C1C]";
    return "bg-yellow-100 text-yellow-700";
  };

  const getStatusText = (status) => {
    if (status === "approved") return "Aprobado";
    if (status === "rejected") return "Rechazado";
    return "Pendiente";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Detalles del Testimonio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="pb-4">
            {" "}
            {/* Author Info */}
            <div className="mb-2 space-y-2">
              <h3 className="font-bold text-gray-900">{testimonial.author}</h3>
              <p className="text-sm text-gray-600">{testimonial.program}</p>
            </div>
            {/* Rating and date */}
            <div className="space-x-3 text-sm mb-2">
              {" "}
              <span className="text-sm">{renderStars(testimonial.rating)}</span>
              <span>Enviado el: {testimonial.date}</span>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-sm ${getStatusColor(
                testimonial.status
              )}`}
            >
              {getStatusText(testimonial.status)}
            </span>
          </div>
          <div className="border-t">
            {/* Title */}
            <div>
              <h4 className="font-semibold text-gray-900 my-2">
                {testimonial.title}
              </h4>
            </div>

            {/* Content */}
            <div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {testimonial.content}
              </p>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
}
