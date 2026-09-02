import { useState } from "react";
import ProgramDetailView from "./ProgramDetailView";
import ProgramForm from "./ProgramForm";
import {
  useGetAllProgramsQuery,
  useCreateProgramMutation,
  useProgramUpdateMutation,
  useDeleteProgramMutation,
} from "../../../Api/universityApi";
import ProgramsView from "./ProgramView";
import toast from "react-hot-toast";

export default function Programs() {
  const [view, setView] = useState("list"); // list, add, edit
  const [viewingProgram, setViewingProgram] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  // API Hooks
  const { data: programs, isLoading, error } = useGetAllProgramsQuery();
  const [createProgram] = useCreateProgramMutation();
  const [updateProgram] = useProgramUpdateMutation();
  const [deleteProgram] = useDeleteProgramMutation();

  const handleAddClick = () => {
    setEditingProgram(null);
    setView("add");
  };

  const handleEditClick = (program) => {
    setEditingProgram(program.id);
    setView("edit");
  };

  const handleViewClick = (program) => {
    setViewingProgram(program.id);
  };

  const handleDeleteClick = async (program) => {
    try {
      const res = await deleteProgram(program.id);
      console.log("res", res.data.message)
      toast.success("Programa eliminado exitosamente");
    } catch (err) {
      console.error(" te program:", err);
      toast.error("Error al eliminar el programa");
    }
  };

  const handleSave = async (programData) => {
    // Log FormData clearly for debugging
    if (programData instanceof FormData) {
      console.log("Sending FormData Payload:", Object.fromEntries(programData.entries()));
    } else {
      console.log("Sending JSON Payload:", programData);
    }

    try {
      if (editingProgram) {
        await updateProgram(programData).unwrap();
      } else {
        await createProgram(programData).unwrap();
      }
      setView("list");
      toast.success(editingProgram ? "Programa actualizado" : "Programa creado");
    } catch (err) {
      console.error("API Error Detailed:", err);
      if (err?.data) console.log("Validation Errors:", err.data);
      toast.error(err?.data?.detail || "Ocurrió un error. Revise la consola.");
    }
  };

  const handleBackToList = () => {
    setView("list");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error al cargar los programas. Por favor intente de nuevo más tarde.
      </div>
    );
  }

  if (view === "list") {
    return (
      <>
        <ProgramsView
          programs={programs}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onView={handleViewClick}
          onDelete={handleDeleteClick}
        />

        {viewingProgram && (
          <ProgramDetailView
            programId={viewingProgram}
            onEdit={handleEditClick}
            onClose={() => setViewingProgram(null)}
          />
        )}


      </>
    );
  }

  if (view === "add" || view === "edit") {
    return (
      <ProgramForm
        programId={editingProgram}
        onSave={handleSave}
        onCancel={handleBackToList}
        isEdit={view === "edit"}
      />
    );
  }

  return null;
}
