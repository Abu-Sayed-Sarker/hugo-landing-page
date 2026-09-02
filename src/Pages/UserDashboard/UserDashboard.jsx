import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetUserProfileQuery } from "../../Api/authapi";
import ProfileEditModal from "../../Layouts/User/Modal/ProfileEditModal";
import { Edit2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const user = useSelector((state) => state.auth.user);
  const { data: profile, isLoading, error } = useGetUserProfileQuery();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  if (isLoading)
    return <div className="p-8 text-center">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-base p-4 sm:p-8 xl:pt-24">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">Panel de Usuario</h1>

        <div className="bg-white p-6 mb-6 rounded-lg shadow">
          {/* Profile Section */}
          <div className=" border-b border-[#CCCCCC] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#BFDBFE] rounded-full flex items-center justify-center text-blue font-semibold overflow-hidden border-2 border-white shadow-sm">
                  {profile?.image ? (
                    <img
                      src={getFullUrl(profile.image)}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {profile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "AS"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">
                      {profile?.full_name}
                    </h2>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors text-blue"
                      title="Editar Perfil"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {profile?.role || "Estudiante"}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{profile?.email}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <Link to={"/message"} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-blue hover:shadow-lg hover:scale-105 transition-transform text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
                    Mensaje
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Your Activity Section */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Tu Actividad</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-base rounded-lg  p-4">
                <p className="text-gray-600 text-sm mb-1"> Programas Aplicados</p>
                <p className="text-blue  text-2xl font-bold">
                  {profile?.applied_program_count || 0}
                </p>
              </div>
              <div className="bg-base rounded-lg  p-4">
                <p className="text-gray-600 text-sm mb-1"> Empleos Aplicados</p>
                <p className="text-blue  text-2xl font-bold">
                  {profile?.applied_job_count || 0}
                </p>
              </div>
              <div className="bg-base rounded-lg  p-4">
                <p className="text-gray-600 text-sm mb-1">Eventos Registrados</p>
                <p className="text-blue  text-2xl font-bold">
                  {profile?.event_registered_count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Solicitudes Recientes</h3>
            <div className="space-y-4 divide-y-2 divide-[#CCCCCC]">
              {profile?.recent_applications?.length > 0 ? (
                profile.recent_applications.map((app, index) => (
                  <div
                    key={app.id}
                    className={`flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-0 ${index === 0 ? "" : "pt-4"}`}
                  >
                    <div>
                      <h4 className="text-lg">{app?.desired_program}</h4>
                      <h4 className="font-semibold">{app?.university_name}</h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded font-medium ${app.status?.toLowerCase() === "accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status?.toLowerCase() === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No se encontraron solicitudes recientes.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
