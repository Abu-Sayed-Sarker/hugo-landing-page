import EnrollmentChart from "./University/Dashboard/EnrollmentChart";
import StatCard from "./University/Dashboard/StatCard";
import events from "../assets/icons/events.png"
import testimonials from "../assets/icons/testimonials.png"
import applications from "../assets/icons/applications.png"
import posting from "../assets/icons/posting.png"
import { useGetDashboardStatsQuery, useGetRequestInformationQuery } from "../Api/universityApi";
import { useMemo } from "react";

export default function UniversityDashboard() {
  const { data: dashboardData, isLoading: isStatsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: requestInfo, isLoading: isRequestsLoading } = useGetRequestInformationQuery();

  const stats = useMemo(() => {
    if (!dashboardData?.cards) return [];

    const { active_events, job_postings, student_applications, pending_testimonials } = dashboardData.cards;

    return [
      {
        label: "Eventos Activos",
        value: active_events.value,
        change: `+${active_events.growth} del mes pasado`,
        color: "bg-green-500",
        icon: events,
      },
      {
        label: "Ofertas de Empleo",
        value: job_postings.value,
        change: `+${job_postings.growth} del mes pasado`,
        color: "bg-purple-500",
        icon: posting,
      },
      {
        label: "Solicitudes de Estudiantes",
        value: student_applications.value,
        change: `+${student_applications.growth} del mes pasado`,
        color: "bg-orange-500",
        icon: applications,
      },
      {
        label: "Testimonios Pendientes",
        value: pending_testimonials.value,
        change: `+${pending_testimonials.growth} del mes pasado`,
        color: "bg-pink-500",
        icon: testimonials,
      },
    ];
  }, [dashboardData]);

  const chartData = useMemo(() => {
    if (!dashboardData?.chart_data) return [];

    const { labels, applications, enrollment } = dashboardData.chart_data;

    return labels.map((label, index) => ({
      month: label,
      applications: applications[index],
      enrollment: enrollment[index],
    }));
  }, [dashboardData]);

  if (isStatsLoading) return <div className="p-8 text-center text-gray-500">Cargando estadísticas del panel...</div>;
  if (statsError) return <div className="p-8 text-center text-red-500">Error al cargar las estadísticas.</div>;

  return (
    <div className="p-8 min-h-screen bg-base">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Enrollment Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Inscripciones y Solicitudes de Estudiantes
        </h2>
        <EnrollmentChart data={chartData} />
      </div>

      {/* Request Information Table */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Solicitudes de Información</h2>
        {isRequestsLoading ? (
          <div className="py-4 text-center text-gray-500">Cargando solicitudes...</div>
        ) : requestInfo?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Nombre Completo</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Correo Electrónico</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Teléfono</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Programa</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Mensaje</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requestInfo.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">{req.full_name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{req.email_address}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{req.phone_number}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{req.program_title}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <p className="line-clamp-2 max-w-xs">{req.message}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No se encontraron solicitudes de información.</div>
        )}
      </div>
    </div>
  );
}
