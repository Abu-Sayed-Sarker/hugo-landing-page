import { useState, useMemo } from "react";
import eventPlaceholder from "../../assets/icons/event.png";
import uni_logo_placeholder from "../../assets/icons/uni_logo.png";
import {
  useGetDiscoveryEventsQuery,
  useRegisterForEventMutation,
} from "../../Api/universityApi";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import background from "../../assets/images/uniBanner.png";

export default function UniversityEvents() {
  const [view, setView] = useState("list");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventFormat, setEventFormat] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [eventDate, setEventDate] = useState("");

  const queryParams = useMemo(() => {
    const params = {};
    if (eventFormat !== "all") {
      params.event_type = eventFormat === "In-Person" ? "Person" : eventFormat;
    }
    if (eventType !== "all") params.type = eventType;
    if (eventDate) params.date = eventDate;
    return params;
  }, [eventFormat, eventType, eventDate]);

  const {
    data: eventsData,
    isLoading,
    error,
  } = useGetDiscoveryEventsQuery(queryParams);

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  const isPastEvent = (eventDate) => {
    if (!eventDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    return target < today;
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setView("detail");
  };

  const [registerForEvent, { isLoading: isRegistering }] =
    useRegisterForEventMutation();

  const handleRegister = async (eventId) => {
    try {
      const res = await registerForEvent(eventId).unwrap();
      toast.success(res.message || "Successfully registered for the event!", {
        position: "bottom-center",
      });
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to register for event.";
      toast.error(msg, { position: "bottom-center" });
    }
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedEvent(null);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-gray-500">
        Loading events...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-base p-8 text-center text-red-500">
        Error loading events.
      </div>
    );

  const events = eventsData || [];

  if (view === "detail" && selectedEvent) {
    return (
      <div className="min-h-screen bg-base">
        {/* Header */}
        <div
          style={{
            backgroundImage: `url(${getFullUrl(selectedEvent.image) || background})`,
          }}
          className="bg-cover bg-no-repeat h-[50vh] text-white py-12 px-8 relative overflow-hidden flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="w-11/12 mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBackToList}
              className="mb-10 text-white/80 hover:text-white flex items-center gap-2"
            >
              ← Back to Events
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex-shrink-0 flex items-center justify-center p-2">
                <img
                  src={getFullUrl(selectedEvent.univ_logo) || uni_logo_placeholder}
                  alt="uni logo"
                  className="max-h-full"
                />
              </div>
              <div>
                <h1 className="text-3xl xl:text-5xl mb-2">{selectedEvent.title}</h1>
                <p className="text-blue-100 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {selectedEvent.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl mb-4">About This Event</h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line">
                  {selectedEvent.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-inter">
                  <div className="flex items-start gap-3 bg-[#EFF6FF] p-4 rounded-lg">
                    <Calendar className="text-blue mt-1" size={20} />
                    <div>
                      <p className="text-grey text-xs">Date</p>
                      <p className="font-medium text-sm">{selectedEvent.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-[#EFF6FF] p-4 rounded-lg">
                    <Clock className="text-blue mt-1" size={20} />
                    <div>
                      <p className="text-grey text-xs">Time</p>
                      <p className="font-medium text-sm">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-[#EFF6FF] p-4 rounded-lg">
                    <Users className="text-blue mt-1" size={20} />
                    <div>
                      <p className="text-grey text-xs">Category</p>
                      <p className="font-medium text-sm">
                        {selectedEvent.category || "General Event"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedEvent.agendas && selectedEvent.agendas.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-medium mb-4">Event Agenda</h2>
                  <div className="space-y-6">
                    {selectedEvent.agendas.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <p className="text-grey tracking-wider w-44">
                          {item.time_slot}
                        </p>
                        <div className="flex gap-4 border-l-[3px] border-sky ml-2">
                          <div className="pl-6 pb-2">
                            <p className="text-[#111827] font-medium text-lg">
                              {item.task_title}
                            </p>
                            <p className="text-[#374151] mt-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.additional_info && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl mb-4">Additional Information</h2>
                  <p className="text-gray-700 leading-relaxed italic">
                    {selectedEvent.additional_info}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                {!isPastEvent(selectedEvent.date) ? (
                  <>
                    <h3 className="mb-4 tracking-widest text-gray-500 text-sm uppercase">
                      Status
                    </h3>
                    <div className="inline-block px-4 py-2 bg-blue/10 text-blue rounded-full mb-4">
                      {selectedEvent.status}
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                      {selectedEvent.registration_count} Students Registered
                    </p>
                    <button
                      disabled={selectedEvent.status === "Cancelled" || isRegistering}
                      onClick={() => handleRegister(selectedEvent.id)}
                      className="w-full bg-blue text-white py-3 rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRegistering ? "Registering..." : "Register For Event"}
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-6 text-left">
                      Event Registration
                    </h3>
                    <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar size={24} className="text-[#1F2937]" />
                    </div>
                    <p className="font-medium text-lg mb-2">Event Ended</p>
                    <p className="text-gray-600 text-sm mb-6">
                      This event has already taken place. Check out our upcoming events.
                    </p>
                    <button
                      onClick={handleBackToList}
                      className="text-blue font-semibold hover:underline"
                    >
                      Browse Events
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="mb-4">About the Host</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-base rounded-md p-1 border">
                    <img
                      src={getFullUrl(selectedEvent.univ_logo) || uni_logo_placeholder}
                      className="h-full w-full object-contain"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="">{selectedEvent.univ_name}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  Learn more about programs, admissions, and life as a student at{" "}
                  {selectedEvent.univ_name}.
                </p>
                <button className="text-blue bg-base w-full py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Visit University Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <div className="bg-primary h-[50vh] text-white py-12 px-8 relative overflow-hidden flex items-center justify-center font-inter">
        <div className="w-11/12 mx-auto relative z-10 px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl xl:text-6xl mb-4">University Events</h1>
          <p className="text-sky xl:text-xl max-w-2xl font-light">
            Stay updated with the latest webinars, open days, and workshops from
            top universities around the globe.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="mb-4 text-xl border-b pb-2">Filters</h3>

              <div className="mb-6">
                <h4 className="mb-3 text-gray-900 text-sm tracking-wider">
                  Event Format
                </h4>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Events" },
                    { id: "In-Person", label: "In-Person" },
                    { id: "Online", label: "Online" },
                  ].map((fm) => (
                    <label key={fm.id} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="eventFormat"
                        className="w-4 h-4 text-blue border-gray-300 focus:ring-blue"
                        checked={
                          (eventFormat === "all" && fm.id === "all") ||
                          eventFormat === fm.id
                        }
                        onChange={() => setEventFormat(fm.id)}
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-blue transition-colors">
                        {fm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 text-gray-900 text-sm tracking-wider">
                  Event Type
                </h4>
                <div className="space-y-2">
                  {[
                    "all",
                    "Open Day",
                    "Webinar",
                    "Info Session",
                    "Workshop",
                    "Conference",
                    "Bootcamp",
                  ].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="eventType"
                        className="w-4 h-4 text-blue border-gray-300 focus:ring-blue"
                        checked={
                          (eventType === "all" && type === "all") ||
                          eventType === type
                        }
                        onChange={() => setEventType(type)}
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-blue transition-colors">
                        {type === "all" ? "All Types" : type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-gray-900 text-sm tracking-wider">Date</h4>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="border border-gray-200 p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600 font-medium">
                Showing{" "}
                <span className="text-blue-600 font-semibold">
                  {events.length.toLocaleString("en-US")}
                </span>{" "}
                events
              </p>
            </div>

            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-sm">
                  No events found.
                </div>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    getFullUrl={getFullUrl}
                    onViewDetails={handleViewDetails}
                    onRegister={handleRegister}
                    isRegistering={isRegistering}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, getFullUrl, onViewDetails, onRegister, isRegistering }) {
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
            src={getFullUrl(event.image) || eventPlaceholder}
            alt={event.title}
            className="w-full h-48 sm:h-full object-cover"
          />
          {/* Format badge top-left */}
          {event.event_type && (
            <span
              className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                isInPerson
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
              {event.univ_logo ? (
                <img
                  src={getFullUrl(event.univ_logo)}
                  alt={event.univ_name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                  {event.univ_name?.[0] ?? "U"}
                </div>
              )}
              <span className="text-sm text-gray-500">{event.univ_name}</span>
            </div>
            <button
              onClick={() => setSaved((s) => !s)}
              className={`p-1.5 rounded-full transition-colors ${
                saved
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

          {/* Bottom row: tag + buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {event.category && (
              <span className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full">
                {event.category}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => onRegister && onRegister(event.id)}
                disabled={isRegistering}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Register
              </button>
              <button
                onClick={() => onViewDetails(event)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                View Details
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
