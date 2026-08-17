import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import image from "../../../assets/images/program1.png";
import AddCareerModal from "../Modal/AddCareerModal";
export default function ProgramsView({
    programs,
    onAdd,
    onEdit,
    onDelete,
    onView,
}) {
    console.log("programs", programs)
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);
    const [showAddCareerModal, setShowAddCareerModal] = useState(false);
    const [careers, setCareers] = useState([
        {
            id: 1,
            title: "Financial Consultant",
            description:
                "Work with clients on financial planning and investment strategies",
        },
    ]);
    const filteredPrograms = programs.filter((program) =>
        program.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (program) => {
        setProgramToDelete(program);
        setDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(programToDelete);
        setDeleteModal(false);
        setProgramToDelete(null);
    };

    const handleAddCareer = (careerData) => {
        setCareers([...careers, { ...careerData, id: Date.now() }]);
        setShowAddCareerModal(false);
    };

    const getStatusColor = (status) => {
        if (status === "Published") return "bg-[#DCFCE7] text-[#166534]";
        if (status === "Draft") return "bg-yellow-100 text-yellow-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
                <div className="flex gap-3">    <button
                    onClick={() => setShowAddCareerModal(true)}
                    className=" text-blue border border-blue px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                    + Add Career
                </button>
                    <button
                        onClick={onAdd}
                        className="bg-[#1D4ED8] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        + Add New Program
                    </button></div>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-8 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                    <div
                        key={program.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        {/* Header with Status */}
                        <div className={`p-4 bg-gradient-to-r from-[#F5E7E4] to-[#DEF0EC]`}>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg">{program.title}</h3>
                            </div>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                                    program.status
                                )}`}
                            >
                                {program.status}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex gap-4 mb-4 justify-around">
                                <img src={program?.image || image} alt="Program" className="h-24 rounded-lg" />

                                <div>
                                    <div>
                                        <p className="text-gray-600">Level</p>
                                        <p className="">{program.level}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Language</p>
                                        <p className="">{program.language}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="">{program.duration}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Applications</p>
                                        <p className="">{program.applications}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t pt-3 flex justify-between items-center">
                                <p className=" text-grey">
                                    Last updated: {program.lastUpdated}
                                </p>
                                <div className="flex gap-3 items-center ">
                                    <button onClick={() => onView && onView(program)}>
                                        <Eye strokeWidth={2.55} className="text-blue" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(program)}
                                        className="text-green-600 hover:text-green-800 text-lg"
                                    >
                                        <SquarePen className="text-[#6B7280]" strokeWidth={2.55} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(program)}
                                        className="text-red-600 hover:text-red-800 text-lg"
                                    >
                                        <Trash2 strokeWidth={2.55} className="text-red" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Modal */}
            {deleteModal && programToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 px-6 py-4 border-b">
                            Delete Program
                        </h2>
                        <p className="text-gray-600 mb-6 px-6">
                            Are you sure you want to delete the program{" "}
                            <span className="font-semibold">{programToDelete.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end px-6 bg-[#F9FAFB] py-4 border-t">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showAddCareerModal && (
                <AddCareerModal
                    onSave={handleAddCareer}
                    onClose={() => setShowAddCareerModal(false)}
                />
            )}
        </div>
    );
}