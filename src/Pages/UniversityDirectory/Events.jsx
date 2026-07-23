import { useState } from "react";
import { Calendar, Clock, MapPin, Bookmark, ArrowRight } from "lucide-react";
import eventPlaceholder from "../../assets/images/event1.png";
import logoPlaceholder from "../../assets/icons/uni_logo.png";
import { useGetEventsByUniIdQuery } from "../../Api/universityApi";

export default function Events({ data: universityData, onViewDetails }) {
  const {
    data: eventsData,
    isLoading,
    error,
  } = useGetEventsByUniIdQuery(universityData?.id);

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">Loading events...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Error loading events.</div>
    );
  if (!eventsData || eventsData.length === 0)
    return (
      <div className="p-8 text-center text-gray-500">
        No events found for this university.
      </div>
    );

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  return (
    <div>
      {/* Events Header */}
      <div className="mb-5">
        <p className="text-sm text-gray-600 font-medium">
          Showing{" "}
          <span className="text-blue-600 font-semibold">
            {eventsData.length}
          </span>{" "}
          events
        </p>
      </div>

      <div className="space-y-4">
        {eventsData.map((event) => (
          <UniEventCard
            key={event.id}
            event={event}
            getFullUrl={getFullUrl}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}

function UniEventCard({ event, getFullUrl, onViewDetails }) {
  const [saved, setSaved] = useState(false);

  const parseDateBadge = (dateStr) => {
    if (!dateStr) return { month: "", day: "" };
    const d = new Date(dateStr);
    if (isNaN(d)) return { month: "", day: dateStr };
    return {
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      day: d.getDate(),
    };
  };

  const { month, day } = parseDateBadge(event.date);
  const isInPerson =
    event.event_type === "In-Person" || event.event_type === "Person";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row">
        {/* Left: Image with overlays */}
        <div className="sm:w-52 md:w-60 flex-shrink-0 relative">
          <img
            src={event.image ? getFullUrl(event.image) : eventPlaceholder}
            alt={event.title}
            className="w-full h-48 sm:h-full object-cover"
          />
          {/* Format badge top-left */}
          {event.event_type && (
            <span
              className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${isInPerson
                  ? "bg-blue-600 text-white"
                  : "bg-green-500 text-white"
                }`}
            >
              {isInPerson ? "In-Person" : "Online"}
            </span>
          )}
          {/* Date badge bottom-left */}
          {month && (
            <div className="absolute bottom-3 left-3 bg-white rounded-md px-2 py-1 text-center shadow min-w-[44px]">
              <p className="text-[10px] font-bold text-blue-600 uppercase leading-none">
                {month}
              </p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{day}</p>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* Top row: university name + save icon */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={event.univ_logo ? getFullUrl(event.univ_logo) : logoPlaceholder}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-500">{event.univ_name}</span>
            </div>
            <button
              onClick={() => setSaved((s) => !s)}
              className={`p-1.5 rounded-full transition-colors ${saved
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-300 hover:text-blue-500 hover:bg-blue-50"
                }`}
              aria-label="Save event"
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Event title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
            {event.title}
          </h3>

          {/* Date · Time · Location row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-blue-500" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-blue-500" />
                {event.time}
              </span>
            )}
            {event.address && (
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-blue-500" />
                {event.address}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {event.description}
          </p>

          {/* Bottom row: category tag + View Details button */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {event.category && (
              <span className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full">
                {event.category}
              </span>
            )}
            <button
              onClick={() => onViewDetails(event.id)}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              View Details
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
