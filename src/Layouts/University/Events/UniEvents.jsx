"use client";

import { useState } from "react";
import EventsCalendarView from "./EventsCalendarView";
import EventsListView from "./EventsListView";
import EventFormModal from "../Modal/EventFormModal";
import ViewRegistrationsModal from "../Modal/ViewRegistrationsModal";
import DeleteEventModal from "../Modal/DeleteEventModal";
import {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useEventUpdateMutation,
  useDeleteEventMutation
} from "../../../Api/universityApi";
import toast from "react-hot-toast";

export default function UniEvents() {
  const [activeTab, setActiveTab] = useState("calendar"); // calendar, list
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  const { data: events = [], isLoading, error } = useGetAllEventsQuery();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useEventUpdateMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = async (eventFormData) => {
    try {
      if (editingEvent) {
        await updateEvent(eventFormData).unwrap();
        toast.success("Evento actualizado con éxito");
      } else {
        await createEvent(eventFormData).unwrap();
        toast.success("Evento creado con éxito");
      }
      setShowEventForm(false);
    } catch (err) {
      console.error("Failed to save event:", err);
      toast.error(err?.data?.detail || "Ocurrió un error al guardar el evento.");
    }
  };

  const handleViewRegistrations = (event) => {
    setViewingRegistrations(event);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteEvent(id).unwrap();
      toast.success("Evento cancelado con éxito");
      setEventToDelete(null);
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast.error(err?.data?.detail || "Error al cancelar el evento.");
    }
  };

  if (isLoading) return <div className="p-8">Cargando eventos...</div>;
  if (error) return <div className="p-8 text-red-500">Error al cargar eventos.</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Administrador de Eventos</h1>
        <button
          onClick={handleCreateEvent}
          className="bg-blue text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className="text-xl">+</span> Crear Evento
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-3 transition-colors ${activeTab === "calendar"
            ? "text-blue bg-[#DBEAFE] rounded-lg"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Calendario
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-3 transition-colors ${activeTab === "list"
            ? "text-blue bg-[#DBEAFE] rounded-lg"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Vista de Lista
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "calendar" && (
        <EventsCalendarView
          events={events}
          onEdit={handleEditEvent}
          onViewRegistrations={handleViewRegistrations}
          onDelete={handleDeleteClick}
        />
      )}

      {activeTab === "list" && (
        <EventsListView
          events={events}
          onEdit={handleEditEvent}
          onViewRegistrations={handleViewRegistrations}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <EventFormModal
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => setShowEventForm(false)}
          isEdit={!!editingEvent}
        />
      )}

      {/* View Registrations Modal */}
      {viewingRegistrations && (
        <ViewRegistrationsModal
          event={viewingRegistrations}
          onClose={() => setViewingRegistrations(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <DeleteEventModal
          event={eventToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
}
