import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  CircleCheckBig,
  Calendar,
} from "lucide-react";
import program1 from "../../../assets/images/program1.png";
import { useGetProgramByIdQuery } from "../../../Api/universityApi";

export default function ProgramDetailView({ programId, onEdit, onClose }) {
  if (!programId) return null;
  const { data: program, isLoading, error } = useGetProgramByIdQuery(programId);

  console.log(program);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    outcomes: true,
    faculties: true,
    curriculum: true,
    requirements: true,
    process: true,
    fees: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const DetailSection = ({ title, section, children, isLast }) => (
    <div className={!isLast ? "border-b border-gray-100" : ""}>
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex justify-between items-center py-4 px-6 hover:bg-gray-50 transition group"
      >
        <h2 className="text-base font-semibold text-gray-900 text-left">
          {title}
        </h2>
        <span className="text-gray-400 group-hover:text-gray-600">
          {expandedSections[section] ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </span>
      </button>
      {expandedSections[section] && (
        <div className="px-6 pb-4 text-gray-700">{children}</div>
      )}
    </div>
  );

  // Data Adapters
  const curriculumYears = [
    { title: "First Year", courses: program?.first_year_courses ? program.first_year_courses.split(",").map(s => s.trim()) : [] },
    { title: "Second Year", courses: program?.second_year_courses ? program.second_year_courses.split(",").map(s => s.trim()) : [] },
    { title: "Third Year", courses: program?.third_year_courses ? program.third_year_courses.split(",").map(s => s.trim()) : [] },
    { title: "Fourth Year", courses: program?.fourth_year_courses ? program.fourth_year_courses.split(",").map(s => s.trim()) : [] },
  ].filter(y => y.courses.length > 0);

  const outcomes = program?.learning_outcomes?.map(o => o.outcome_text) || [];

  const deadlines = program?.deadlines || [];

  const steps = program?.steps ? [...program.steps].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-auto p-4 ">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl my-8 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F5E6E3] to-[#DEF0EC] px-6 py-5 border-b border-gray-200 flex justify-between items-start sticky top-0 w-full max-w-3xl z-10">
          <div className="font-semibold text-lg">Detalles del Programa</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Quick Info Grid */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex-1 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {program?.title}
              </h1>
              <span
                className={`inline-block px-2.5 py-1 ml-4 rounded-full text-sm font-medium ${program?.status === "Published"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {program?.status}
              </span>
            </div>


          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Nivel
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {program?.level}
                </p>
              </div>
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Duración
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {program?.duration}
                </p>
              </div>
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Idioma
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {program?.language}
                </p>
              </div>
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Modalidad
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {program?.modality}
                </p>
              </div>
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Próxima Fecha de Inicio
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {program?.next_start_date}
                </p>
              </div>
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Créditos
                </p>
                <p className="font-semibold text-gray-900 mt-1">{program?.credits}</p>
              </div>
              <div>
                <p className=" text-gray-500 font-medium uppercase tracking-wide text-xs">
                  Última Actualización
                </p>
                <p className="font-semibold text-gray-900 mt-1">{program?.updated_at ? program?.updated_at.split("T")[0] : "N/A"}</p>
              </div>
            </div>
            <div>
              <img className="rounded-xl w-40 h-auto object-cover" src={program?.image || program1} alt="" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="">
          {/* Program Description */}
          <DetailSection title="Descripción del Programa" section="description">
            <p className="text-gray-700 leading-relaxed">
              {program?.description}
            </p>
          </DetailSection>

          {/* Learning Outcomes */}
          <DetailSection title="Resultados de Aprendizaje" section="outcomes">
            <div className="space-y-3">
              {outcomes.length > 0 ? (
                outcomes.map((outcome, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="text-[#16A34A] mt-1">
                      <CircleCheckBig size={18} strokeWidth={2.75} />
                    </span>
                    <p className=" text-gray-700">{outcome}</p>
                  </div>
                ))
              ) : (
                <p className=" text-gray-500">No se agregaron resultados de aprendizaje</p>
              )}
            </div>
          </DetailSection>

          {/* Program Faculties */}
          <DetailSection title="Facultades del Programa" section="faculties">
            {program?.faculties && program.faculties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {program?.faculties.map((faculty, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-center border p-4 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0 flex items-center justify-center">
                      <span className=" font-semibold text-white">
                        {faculty.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {faculty.name}
                      </p>
                      <p className=" text-gray-600 text-sm">{faculty.department}</p>
                      <p className=" text-gray-500 text-sm">
                        {faculty.expertise}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-gray-500">No se agregaron facultades</p>
            )}
          </DetailSection>

          {/* Program Curriculum */}
          <DetailSection title="Plan de Estudios del Programa" section="curriculum">
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {program?.curriculum_overview || "No hay resumen del plan de estudios disponible."}
              </p>
            </div>
            {curriculumYears.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
                {curriculumYears.map((year, idx) => (
                  <div key={idx} className="border-l-4 border-blue pl-6">
                    <h2 className="text-xl font-medium text-gray-900 mb-6">
                      {year.title}
                    </h2>
                    <ul className="space-y-3">
                      {year.courses.map((course, courseIdx) => (
                        <li key={courseIdx} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue/20 text-blue font-medium mr-3 flex-shrink-0 text-sm">
                            {courseIdx + 1}
                          </span>
                          <span className="text-gray-700">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-gray-500">No se agregaron cursos al plan de estudios</p>
            )}
          </DetailSection>

          {/* Admission Requirements */}
          <DetailSection title="Requisitos de Admisión" section="requirements">
            {deadlines.length > 0 ? (
              <div className="bg-blue-50 border border-[#BFDBFE] rounded-lg p-6 bg-[#EFF6FF] mb-6">
                <h3 className="text-lg font-semibold text-blue mb-4 flex items-center">
                  Plazos de Solicitud
                </h3>

                <div className="space-y-3 ">
                  {deadlines.map((item, idx) => (
                    <div key={idx} className="flex flex-col text-gray-800 border-b border-blue-100 pb-2 last:border-0">
                      <div className="flex items-center">
                        <Calendar
                          strokeWidth={3.0}
                          className="w-4 h-4 text-blue mr-3 flex-shrink-0"
                        />
                        <span className="text-blue-600 font-bold">{item.batch_name}</span>
                      </div>
                      <div className="ml-7 text-sm mt-1">
                        <span className="font-semibold">Start:</span> {item.start_date} | <span className="font-semibold">End:</span> {item.end_date}
                        {item.next_start_date && <> | <span className="font-semibold">Next Start:</span> {item.next_start_date}</>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div>
              <h3 className="font-semibold my-4 text-black text-lg">Requisitos</h3>
              {Array.isArray(program?.requirements) ? (
                <ul className="space-y-2">
                  {program.requirements.map((req, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <span className="text-blue mt-1">•</span>
                      <p className="text-gray-700">{req}</p>
                    </li>
                  ))}
                  {program.requirements.length === 0 && (
                    <p className="text-gray-500 italic text-sm">No se enumeran requisitos específicos.</p>
                  )}
                </ul>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {program?.requirements || "No se enumeran requisitos específicos."}
                </p>
              )}
            </div>
          </DetailSection>

          {/* Application Process */}
          <DetailSection
            title="Proceso de Solicitud"
            section="process"
          >
            {steps.length > 0 ? (
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <span className="bg-blue text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                      {step.order}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {step.step_title}
                      </p>

                      <p className="text-gray-600 mt-1">
                        {step.step_description}
                      </p>

                    </div>
                  </li>
                ))}
                </ol>
            ) : (
              <p className=" text-gray-500">No se agregaron pasos de solicitud</p>
            )}
          </DetailSection>

          {/* Fees & Financial Aid */}
          <DetailSection title="Tarifas y Ayuda Financiera" section="fees" isLast={true}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase">Matrícula Nacional</p>
                  <p className="text-lg font-bold text-gray-900">{program?.tuition?.domestic_tuition} {program?.tuition?.currency}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase">Matrícula Internacional</p>
                  <p className="text-lg font-bold text-gray-900">{program?.tuition?.international_tuition} {program?.tuition?.currency}</p>
                </div>
              </div>

              {program?.additional_expenses?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Gastos Adicionales</h4>
                  <div className="space-y-2">
                    {program.additional_expenses.map((exp, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                        <span className="text-gray-700">{exp.expense_name}</span>
                        <span className="font-semibold text-gray-900">{exp.cost_estimate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {program?.scholarships?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Becas</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {program.scholarships.map((scholarship, idx) => (
                      <div key={idx} className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                        <p className="font-bold text-gray-900">{scholarship.name}</p>
                        <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Monto:</span> {scholarship.amount}</p>
                        <p className="text-sm text-gray-600 mt-1 italic">{scholarship.eligibility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {program?.financial_aid && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">Ayuda Financiera</h4>
                  <p className="text-gray-700 text-sm mb-3">{program.financial_aid.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {program.financial_aid.email && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Correo:</span> {program.financial_aid.email}
                      </div>
                    )}
                    {program.financial_aid.phone && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Teléfono:</span> {program.financial_aid.phone}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DetailSection>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 z-10 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onEdit(program);
              onClose();
            }}
            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Editar Programa
          </button>
        </div>
      </div>
    </div>
  );
}
