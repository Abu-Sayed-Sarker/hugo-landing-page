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
        label: "Active Events",
        value: active_events.value,
        change: `+${active_events.growth} from last month`,
        color: "bg-green-500",
        icon: events,
      },
      {
        label: "Job Postings",
        value: job_postings.value,
        change: `+${job_postings.growth} from last month`,
        color: "bg-purple-500",
        icon: posting,
      },
      {
        label: "Student Applications",
        value: student_applications.value,
        change: `+${student_applications.growth} from last month`,
        color: "bg-orange-500",
        icon: applications,
      },
      {
        label: "Pending Testimonials",
        value: pending_testimonials.value,
        change: `+${pending_testimonials.growth} from last month`,
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

  if (isStatsLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard stats...</div>;
  if (statsError) return <div className="p-8 text-center text-red-500">Error loading dashboard stats.</div>;

  return (
    <div className="p-8 min-h-screen bg-base">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Enrollment Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Student Enrollment & Applications
        </h2>
        <EnrollmentChart data={chartData} />
      </div>

      {/* Request Information Table */}
      <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Request Information</h2>
        {isRequestsLoading ? (
          <div className="py-4 text-center text-gray-500">Loading requests...</div>
        ) : requestInfo?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Full Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Program</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Message</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
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
          <div className="py-8 text-center text-gray-500">No information requests found.</div>
        )}
      </div>
    </div>
  );
}
