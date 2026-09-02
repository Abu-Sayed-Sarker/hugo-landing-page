"use client";

import { useState, useRef, useEffect } from "react";

export default function EventsCalendarView({
  events,
  onEdit,
  onViewRegistrations,
  onDelete,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowMonthPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const monthName = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDate = (day) => {
    if (!day) return [];
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${formattedDay}`;
    return events.filter((e) => e.date === dateStr);
  };

  const getEventColor = (eventType) => {
    return eventType === "Online" ? "bg-blue-100" : "bg-green-100";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
      {/* Month Navigation */}
      <div className="flex justify-center items-center gap-4 mb-6 border-b pb-4 relative">
        <button
          onClick={handlePrevMonth}
          className="text-gray-600 hover:text-gray-900 text-lg"
        >
          ‹
        </button>
        <div className="relative">
          <h2
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue transition-colors flex items-center gap-2"
            onClick={() => setShowMonthPicker(!showMonthPicker)}
          >
            {monthName}
            <span className={`text-[10px] transition-transform ${showMonthPicker ? 'rotate-180' : ''}`}>▼</span>
          </h2>

          {showMonthPicker && (
            <div
              ref={pickerRef}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-gray-100 rounded-xl p-4 z-[100] w-64"
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()))}
                  className="hover:bg-gray-100 p-1.5 rounded-lg transition-colors text-gray-600"
                >
                  ‹
                </button>
                <span className="font-bold text-gray-900">{currentDate.getFullYear()}</span>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()))}
                  className="hover:bg-gray-100 p-1.5 rounded-lg transition-colors text-gray-600"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCurrentDate(new Date(currentDate.getFullYear(), i));
                      setShowMonthPicker(false);
                    }}
                    className={`py-2 text-[10px] font-medium rounded-lg transition-all ${currentDate.getMonth() === i
                      ? 'bg-blue text-white shadow-md shadow-blue/20 scale-105'
                      : 'hover:bg-blue/5 text-gray-600 hover:text-blue'
                      }`}
                  >
                    {m.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleNextMonth}
          className="text-gray-600 hover:text-gray-900 text-lg"
        >
          ›
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-700 py-3 bg-gradient-to-r from-[#F4E7E4] to-[#DFF0EC] rounded"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-32 p-2 border rounded-lg ${day ? "bg-white" : "bg-gray-50"
              }`}
          >
            {day && (
              <>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  {day}
                </div>
                <div className="space-y-1">
                  {getEventsForDate(day).map((event) => (
                    <div
                      key={event.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onEdit && onEdit(event)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          onEdit && onEdit(event);
                      }}
                      className={`text-xs p-1 bg-gradient-to-r from-[#F4E7E4] to-[#DFF0EC] rounded cursor-pointer hover:opacity-80 ${getEventColor(
                        event.event_type
                      )}`}
                    >
                      <div className="font-semibold text-gray-900 truncate">
                        {event.title}
                      </div>
                      <div className="text-gray-600 text-xs">{event.time}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
