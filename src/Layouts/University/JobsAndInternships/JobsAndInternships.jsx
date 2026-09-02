"use client";

import { useState } from "react";
import JobDetailsModal from "../Modal/JobDetailsModal";
import PostNewJobModal from "../Modal/PostNewJobModal";
import JobsTable from "./JobsTable";
import JobApplicationsTable from "./JobApplicationsTable";
import AddCareerModal from "../Modal/AddCareerModal";
import {
  useGetAllJobsQuery,
  useCreateJobMutation,
  useJobUpdateMutation,
  useGetJobByIdQuery,
  useDeleteJobMutation,
  useGetJobApplicationsQuery
} from "../../../Api/universityApi";
import DeleteJobModal from "../Modal/DeleteJobModal";
import toast from "react-hot-toast";

export default function JobsAndInternships() {
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useGetAllJobsQuery();
  const { data: applicationsData, isLoading: appsLoading, error: appsError } = useGetJobApplicationsQuery();

  const [createJob] = useCreateJobMutation();
  const [updateJob] = useJobUpdateMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  // ... (skipping some lines)
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        await updateJob(jobData).unwrap();
        toast.success("Trabajo actualizado con éxito");
      } else {
        await createJob(jobData).unwrap();
        toast.success("Trabajo publicado con éxito");
      }
      setShowPostJobModal(false);
      setEditingJob(null);
    } catch (err) {
      console.error("Failed to save job:", err);
      toast.error(err?.data?.detail || "Ocurrió un error al guardar el trabajo.");
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowPostJobModal(true);
  };

  const handleDeleteJob = (id) => {
    const job = jobs.find(j => j.id === id);
    setDeletingJob(job);
  };

  const handleConfirmDelete = async () => {
    if (!deletingJob) return;
    try {
      await deleteJob(deletingJob.id).unwrap();
      toast.success("Trabajo eliminado con éxito");
      setDeletingJob(null);
    } catch (err) {
      console.error("Failed to delete job:", err);
      toast.error(err?.data?.message || "Error al eliminar el trabajo");
    }
  };

  const [activeTab, setActiveTab] = useState("all-jobs");

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const applications = applicationsData?.results || [];

  if (jobsLoading || appsLoading) return <div className="p-8">Cargando...</div>;
  if (jobsError || appsError) return <div className="p-8 text-red-500">Error al cargar los datos.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Trabajos y Pasantías</h1>
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("all-jobs")}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === "all-jobs"
                ? "text-blue border-b-2 border-blue"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Todos los Trabajos Abiertos
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === "applications"
                ? "text-blue border-b-2 border-blue"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Solicitudes Recientes
            </button>
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => {
              setEditingJob(null);
              setShowPostJobModal(true);
            }}
            className="bg-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all"
          >
            + Publicar Nuevo Trabajo
          </button>
        </div>
      </div>



      {activeTab === "all-jobs" ? (
        <JobsTable
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          jobs={filteredJobs}
          onView={setViewingJob}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
        />
      ) : (
        <JobApplicationsTable applications={applications} />
      )}

      {showPostJobModal && (
        <PostNewJobModal
          job={editingJob}
          onSave={handleSaveJob}
          onClose={() => {
            setShowPostJobModal(false);
            setEditingJob(null);
          }}
        />
      )}

      {viewingJob && (
        <JobDetailsModal job={viewingJob} onClose={() => setViewingJob(null)} />
      )}

      {deletingJob && (
        <DeleteJobModal
          job={deletingJob}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingJob(null)}
        />
      )}
    </div>
  );
}
