"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import icon1 from "../../../assets/icons/program.png";
import icon2 from "../../../assets/icons/universities.png";
import icon3 from "../../../assets/icons/students.png";
import icon4 from "../../../assets/icons/upcoming-event.png";
import AdminStat from "./AdminStat";
import { useGetAdminDashboardStatsQuery } from "../../../Api/universityApi";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { data: statsData, isLoading, error } = useGetAdminDashboardStatsQuery();

  const formattedChartData = useMemo(() => {
    if (!statsData?.charts) return [];

    const { labels, university_user, student_user } = statsData.charts;
    return labels.map((label, index) => ({
      month: label,
      universityUsers: university_user[index] || 0,
      studentUsers: student_user[index] || 0,
    }));
  }, [statsData]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando estadísticas del panel...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error al cargar estadísticas del panel.</div>;

  const summary = statsData?.summary || {};

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStat
          title="Total de Universidades"
          value={summary.total_universities || "0"}
          icon={icon2}
          bgColor="bg-blue-50"
          iconBg="bg-blue-100"
        />
        <AdminStat
          title="Estudiantes Activos"
          value={summary.active_students || "0"}
          icon={icon3}
          bgColor="bg-green-50"
          iconBg="bg-green-100"
        />
        <AdminStat
          title="Trabajos Activos"
          value={summary.active_jobs || "0"}
          icon={icon1}
          bgColor="bg-purple-50"
          iconBg="bg-purple-100"
        />
        <AdminStat
          title="Próximos Eventos"
          icon={icon4}
          value={summary.upcoming_events || "0"}
          bgColor="bg-yellow-50"
          iconBg="bg-yellow-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* University Users Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usuario de Universidad
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formattedChartData}>
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="universityUsers" fill="#A855F7" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Users Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usuario Estudiante
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formattedChartData}>
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="studentUsers" fill="#78C9B3" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
