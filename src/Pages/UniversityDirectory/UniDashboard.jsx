import React, { useState } from "react";
import UniBanner from "./UniBanner";
import { Building, Calendar, Users } from "lucide-react";
import UniversityTab from "./Universitytab";
import { useParams } from "react-router-dom";
import { useGetUniversityOverviewQuery } from "../../Api/universityApi";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import { GraduationCap } from "lucide-react";

export default function UniDashboard() {
  const { id } = useParams();
  const { data: uniData, isLoading, error } = useGetUniversityOverviewQuery(id);
  const [showApply, setShowApply] = useState(false);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">Loading...</div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center">
        Error loading university data
      </div>
    );

  return (
    <div className="bg-base min-h-screen">
      <UniBanner data={uniData} setShowApply={setShowApply} />
      {/* Tabs */}
      <div className="bg-white md:w-10/12 mx-auto rounded-3xl relative -top-6 md:p-6 py-6 shadow-lg z-10">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap md:flex-nowrap md:justify-between gap-y-6">
            <div className="flex items-center gap-4 flex-1 min-w-[45%] md:min-w-0 md:border-r border-gray-200 md:pr-6">
              <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center flex-shrink-0">
                <Calendar size={30} className="text-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Founded
                </p>
                <p className="text-xl md:text-2xl font-medium text-slate-900 leading-tight">
                  {uniData?.year_founded || "N/A"}
                </p>
                <p className="text-xs text-gray-500">30+ years of excellence</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-[45%] md:min-w-0 md:border-r border-gray-200 md:px-6">
              <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center flex-shrink-0">
                <Building size={30} className="text-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Campuses
                </p>
                <p className="text-xl md:text-2xl font-medium text-slate-900 leading-tight">
                  {uniData?.total_campuses || "0"}
                </p>
                <p className="text-xs text-gray-500">Main Campus</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-[45%] md:min-w-0 md:border-r border-gray-200 md:px-6">
              <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center flex-shrink-0">
                <Users size={30} className="text-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Students
                </p>
                <p className="text-xl md:text-2xl font-medium text-slate-900 leading-tight">
                  {uniData?.total_students || "0"}
                </p>
                <p className="text-xs text-gray-500">Active students</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-[45%] md:min-w-0 md:pl-6">
              <div className="w-12 h-12 rounded-full bg-sky/50 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={30} className="text-blue" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Faculty
                </p>
                <p className="text-xl md:text-2xl font-medium text-slate-900 leading-tight">
                  {uniData?.total_faculty || "0"}
                </p>
                <p className="text-xs text-gray-500">Expert faculty members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UniversityTab data={uniData} setShowApply={setShowApply} />
      <ApplyModal
        open={showApply}
        onClose={() => setShowApply(false)}
        uniName={uniData?.univ_name || "University"}
        uniId={uniData?.id}
      />
    </div>
  );
}
