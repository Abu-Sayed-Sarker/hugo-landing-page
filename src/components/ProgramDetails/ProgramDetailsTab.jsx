import { useState } from "react";
import {
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
} from "lucide-react";
import { useGetCareerRoadmapQuery } from "../../Api/universityApi";
import ApplyModal from "../ApplyModal/ApplyModal";

export default function ProgramDetailsTab({ program }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { data: careerData } = useGetCareerRoadmapQuery(program?.id, {
    skip: !program?.id,
  });
  console.log(careerData)
  if (!program) return null;

  return (
    <div className="min-h-screen bg-base font-inter">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            {["overview", "admission", "fees", "careers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-bold border-b-2 transition-all whitespace-nowrap text-sm uppercase tracking-wide ${activeTab === tab
                  ? "border-blue text-blue"
                  : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
              >
                {tab === "fees" ? "Fees & Scholarships" : tab === "overview" ? "Overview & Curriculum" : tab === "admission" ? "Admission" : "Careers"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Program Overview */}
                <div className="bg-white rounded-lg p-6 ">
                  <h2 className="text-2xl font-bold mb-4">Program Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {program?.description || "No description available."}
                  </p>

                  {/* Learning Outcomes */}
                  {program?.learning_outcomes?.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold mb-4">Learning Outcomes</h3>
                      <div className="space-y-3 mb-6">
                        {program.learning_outcomes.map((outcome) => (
                          <div key={outcome.id} className="flex items-start gap-3">
                            <CheckCircle
                              size={18}
                              strokeWidth={3.0}
                              className="text-[#16A34A] mt-0.5 flex-shrink-0"
                            />
                            <span className=" text-gray-700">
                              {outcome.outcome_text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Key Faculty */}
                  {program?.faculties?.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold mb-4">Key Faculty</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {program.faculties.map((faculty, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="bg-blue/10 rounded-full w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center text-blue font-bold text-xl uppercase">
                              {faculty.name?.charAt(0)}
                            </div>
                            <div className="w-full">
                              <p className="font-semibold">{faculty.name}</p>
                              <p className="text-gray-600">{faculty.department}</p>
                              <p className="text-gray-500 mt-1">
                                {faculty.expertise}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Program Curriculum */}
                <div className="bg-white rounded-lg p-6 ">
                  <h2 className="text-2xl font-bold mb-4">
                    Program Curriculum
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {program?.curriculum_overview || "The curriculum is designed to provide a comprehensive understanding of the subjects."}
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    {/* First Year */}
                    <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
                      <h4 className="font-bold text-base mb-4 text-gray-900">
                        First Year
                      </h4>
                      <div className="space-y-2">
                        {(program?.first_year_courses || "").split(",").map((course, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-sky flex items-center justify-center text-xs font-medium text-blue rounded-full">
                              {idx + 1}
                            </div>
                            <span className=" text-gray-700">
                              {course.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Second Year */}
                    <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
                      <h4 className="font-bold text-base mb-4 text-gray-900">
                        Second Year
                      </h4>
                      <div className="space-y-2">
                        {(program?.second_year_courses || "").split(",").map((course, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-sky flex items-center justify-center text-xs font-medium text-blue rounded-full">
                              {idx + 1}
                            </div>
                            <span className=" text-gray-700">
                              {course.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Third Year */}
                    <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
                      <h4 className="font-bold text-base mb-4 text-gray-900">
                        Third Year
                      </h4>
                      <div className="space-y-2">
                        {(program?.third_year_courses || "").split(",").map((course, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-sky flex items-center justify-center text-xs font-medium text-blue rounded-full">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-gray-700">
                              {course.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fourth Year */}
                    <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
                      <h4 className="font-bold text-base mb-4 text-gray-900">
                        Fourth Year
                      </h4>
                      <div className="space-y-2">
                        {(program?.fourth_year_courses || "").split(",").map((course, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-sky flex items-center justify-center text-xs font-medium text-blue rounded-full">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-gray-700">
                              {course.trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Program Details */}
                  <div className="bg-base p-4 mt-8 rounded-lg">
                    {" "}
                    <h1 className="font-medium mb-4">Program Details</h1>
                    <div className=" grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Total Credits
                        </p>
                        <p className="text-sm font-medium">{program?.credits} credits</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Program Duration
                        </p>
                        <p className="text-sm font-medium">{program?.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Instruction Language
                        </p>
                        <p className="text-sm font-medium">{program?.language}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Modality</p>
                        <p className="text-sm font-medium">{program?.modality}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "admission" && (
              <div className="bg-white p-6">
                {/* Admission Requirements */}
                <div className="bg-white rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Admission Requirements
                  </h2>

                  {/* Application Deadlines */}
                  {program?.deadlines?.length > 0 && (
                    <div className="bg-[#EFF6FF] border border-[#EFF6FF] rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue mb-3">
                        Application Deadlines
                      </h3>
                      <div className="space-y-2">
                        {program.deadlines.map((deadline, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="">
                              <Calendar
                                size={16}
                                strokeWidth={2.75}
                                className="text-blue"
                              />
                            </div>
                            <span className="text-gray-700">
                              {deadline.batch_name} - (Start: <strong>{deadline.start_date}</strong>, End: <strong>{deadline.end_date}</strong>)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements List */}
                  {program?.requirements?.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-4">Requirements</h3>
                      <div className="space-y-3">
                        {/* Flattening requirements based on the response structure provided */}
                        {program.requirements.flat(Infinity).map((req, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle
                              strokeWidth={3.0}
                              size={18}
                              className="text-green mt-0.5 flex-shrink-0"
                            />
                            <span className=" text-gray-700">
                              {req}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Application Process */}
                {program?.steps?.length > 0 && (
                  <div className="bg-white rounded-lg">
                    <h2 className="text-2xl font-bold mb-6">
                      Application Process
                    </h2>

                    <div className="space-y-4">
                      {program.steps.map((step) => (
                        <div key={step.order} className="flex gap-4">
                          <div className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                            {step.order}
                          </div>
                          <div>
                            <h4 className="font-semibold  mb-1">
                              {step.step_title}
                            </h4>
                            <p className=" text-gray-600">
                              {step.step_description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "fees" && (
              <>
                {/* Tuition Fees */}
                <div className="bg-white rounded-lg p-6  mb-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Tuition Fees & Financial Aid
                  </h2>

                  <div className="border border-[#CCCCCC] mb-6 rounded-xl">
                    {/* Tuition Fees Section */}
                    <h3 className="text-xl font-bold bg-base p-4 rounded-t-xl border-b border-[#CCCCCC]">
                      Tuition Fees
                    </h3>

                    <div className="grid grid-cols-2 gap-6 mb-4 p-4 pb-0">
                      <div className="bg-base rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="text-green" />{" "}
                          <span className=" font-medium text-gray-700">
                            Domestic Students
                          </span>
                        </div>
                        <p className="text-2xl font-bold">${program?.domestic_tuition} per year</p>
                      </div>
                      <div className="bg-base rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="text-green" />
                          <span className=" font-medium text-gray-700">
                            International Students
                          </span>
                        </div>
                        <p className="text-2xl font-bold">${program?.international_tuition} per year</p>
                      </div>
                    </div>

                    <p className=" text-gray-600 p-4 pt-0">
                      Does not include accommodation, books, and other expenses
                    </p>
                  </div>

                  {/* Additional Expenses */}
                  {program?.additional_expenses?.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold mb-4">
                        Additional Expenses (Estimated)
                      </h3>

                      <div className="space-y-3 mb-6 rounded-xl border border-[#CCCCCC]">
                        <div className="flex justify-between items-center py-3 border-b rounded-t-xl border-[#CCCCCC] bg-base px-6">
                          <span className="text-gray-700">Expense</span>
                          <span className="">Cost (Annual)</span>
                        </div>
                        {program.additional_expenses.map((expense) => (
                          <div key={expense.id} className="flex justify-between items-center py-3 border-b border-[#CCCCCC] px-6">
                            <span className=" text-gray-700">{expense.expense_name}</span>
                            <span className="">{expense.cost_estimate}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Scholarships & Financial Aid */}
                  <div className="bg-white rounded-lg">
                    <h2 className="text-xl font-bold mb-4">
                      Scholarships & Financial Aid
                    </h2>

                    {/* Scholarships */}
                    {program?.scholarships?.map((scholarship) => (
                      <div key={scholarship.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="text-[#CA8A04]" />
                          <span className=" font-semibold text-gray-900">
                            {scholarship.name}
                          </span>
                        </div>
                        <div className="  mb-2">
                          <span className="font-medium">Amount:</span> {scholarship.amount}
                        </div>
                        <div className="">
                          <span className="font-medium">Eligibility:</span> {scholarship.eligibility}
                        </div>
                      </div>
                    ))}

                    {/* Financial Aid Office */}
                    {program?.financial_aid && (
                      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-[#1E40AF] mb-2">
                          Financial Aid
                        </h4>
                        <p className=" text-gray-700 mb-3">
                          {program.financial_aid.description}
                        </p>
                        <div className="space-y-1">
                          <p className=" text-gray-700">
                            <span className="font-medium">Email:</span>{" "}
                            {program.financial_aid.email}
                          </p>
                          <p className=" text-gray-700">
                            <span className="font-medium">Phone:</span> {program.financial_aid.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "careers" && (
              <div className="bg-white p-6 rounded-xl">
                {careerData?.[0] ? (
                  <>
                    {/* Career Opportunities */}
                    <div className="bg-white rounded-lg mt-6">
                      <h2 className="text-4xl font-bold mb-4">
                        Career Opportunities
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {careerData[0].description}
                      </p>

                      {/* Career Paths */}
                      <h3 className="text-2xl font-medium mb-4">Career Paths</h3>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {careerData[0].career_paths?.map((path, index) => (
                          <div key={path.id || index} className="text-center p-4 border border-gray-200 rounded-lg">
                            <div className="w-12 h-12 bg-sky text-blue rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-xl font-medium text-blue-600">
                                {index + 1}
                              </span>
                            </div>
                            <p className="font-medium">{path.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Employment Statistics */}
                    <div className="bg-white rounded-lg mb-6">
                      <h3 className="text-2xl font-medium mb-4">
                        Employment Statistics
                      </h3>
                      <div className="space-y-3 border border-[#CCCCCC] rounded-xl">
                        <div className="flex justify-between items-center px-6 py-3 font-medium bg-base rounded-t-xl text-grey border-b border-[#CCCCCC]">
                          <span className="">Metric</span>
                          <span className="">Value</span>
                        </div>
                        <div className="flex justify-between items-center px-6 py-3 border-b border-[#CCCCCC]">
                          <span className="">
                            Employment Rate
                          </span>
                          <span className="">{careerData[0].employment_rate}</span>
                        </div>
                        <div className="flex justify-between items-center px-6 py-3 border-b border-[#CCCCCC]">
                          <span className="">Average Starting Salary</span>
                          <span className="">{careerData[0].avg_starting_salary}</span>
                        </div>
                        <div className="flex justify-between items-center px-6 py-3">
                          <span className="">Graduate School Placement</span>
                          <span className="">{careerData[0].graduate_school_placement}</span>
                        </div>
                      </div>
                    </div>

                    {/* Career Services */}
                    <div className="bg-white rounded-lg mb-6">
                      <h3 className="text-2xl font-medium mb-4">Career Services</h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {careerData[0].career_service_overview}
                      </p>

                      <div className="space-y-3">
                        {careerData[0].career_services?.map((service, index) => (
                          <div key={service.id || index} className="flex items-start gap-3">
                            <CheckCircle
                              strokeWidth={3.0}
                              size={18}
                              className="text-green mt-0.5 flex-shrink-0"
                            />
                            <span className="text-gray-700">
                              {service.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No career roadmap data available for this program.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Fixed */}
          <div className="space-y-6">
            {/* Apply Now */}
            <div className=" rounded-lg sticky top-16">
              
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Apply Now</h3>
                  <p className=" text-gray-600 mb-4">
                    Ready to take the next step in your education? Apply now for
                    the {program?.title || "this"} program.
                  </p>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-blue hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Application
                  </button>
                  {
                    showApplicationForm && (
                      <ApplyModal
                        programTitle={program?.title}
                        open={showApplicationForm}
                        onClose={() => setShowApplicationForm(false)}
                        uniName={program?.university_name}
                        uniId={program?.university_id}
                      />
                    )
                  }
                </div>
          

              <>
                {/* Key Information */}
                <div className="mt-6 p-6 rounded-lg bg-white space-y-4">
                  <h3 className="text-lg font-medium mb-3">Key Information</h3>
                  <div className="flex justify-between items-center">
                    <p className=" text-gray-500 mb-1">Level</p>
                    <p className="">{program?.level}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 mb-1">Duration</p>
                    <p className="">{program?.duration}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 mb-1">Credits</p>
                    <p className="">{program?.credits}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 mb-1">Language</p>
                    <p className="">{program?.language}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 mb-1">Modality</p>
                    <p className="">{program?.modality}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 mb-1">Next Start</p>
                    <p className="">{program?.next_start_date}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 mb-1">Last Updated</p>
                    <p className="">{program?.updated_at}</p>
                  </div>
                </div>

                {/* Have Questions */}
                <div className="mt-6 p-6 rounded-lg bg-white">
                  <h4 className="font-semibold  mb-3">Have Questions?</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Contact our admissions team for any questions about this
                    program.
                  </p>
                  <div className="space-y-2 text-blue">
                    {program?.financial_aid?.email && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Mail size={14} />
                        <span className="">{program.financial_aid.email}</span>
                      </div>
                    )}
                    {program?.financial_aid?.phone && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Phone size={14} />
                        <span className="">{program.financial_aid.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
