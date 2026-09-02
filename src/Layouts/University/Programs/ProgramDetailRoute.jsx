import { useLocation, useNavigate } from "react-router-dom";
import ProgramDetailView from "./ProgramDetailView";

export default function ProgramDetailRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const program = location.state && location.state.program;

  const handleClose = () => {
    // go back to programs list
    navigate("/university/programs");
  };

  if (!program) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">No se seleccionó ningún programa</h2>
          <p className="text-gray-600 mb-6">
            Esta página requiere datos del programa pasados desde la lista de Programas. Abra
            el programa desde la página de Programas o regrese.
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Volver a Programas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProgramDetailView
      program={program}
      onEdit={(p) => {
        // navigate to edit in the Programs UI if needed
        navigate("/university/programs");
      }}
      onClose={handleClose}
    />
  );
}
