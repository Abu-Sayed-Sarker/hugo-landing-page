import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useApplyToUniversityMutation } from "../../Api/universityApi";
import { toast } from "react-hot-toast";

export default function ApplyModal({ open, onClose, uniName, uniId, programTitle = "" }) {
  const [applyToUni, { isLoading }] = useApplyToUniversityMutation();
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    placeOfBirth: "",
    program: "",

    address: "",
    phone: "",
    email: "",
    nationality: "",
    previousStudies: "",
    currentSituation: "",
    specialNeeds: "",
    letterOfInterest: "",
    dataProcessingAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [previews, setPreviews] = useState({
    front: null,
    back: null,
    docs: [],
  });

  useEffect(() => {
    if (!open) {
      // reset state when modal is closed
      setStep("form");
      setForm({
        fullName: "",
        dob: "",
        placeOfBirth: "",
        program: "",
        // campus: "",
        address: "",
        phone: "",
        email: "",
        nationality: "",
        previousStudies: "",
        currentSituation: "",
        specialNeeds: "",
        letterOfInterest: "",
        dataProcessingAccepted: false,
      });
      setErrors({});
      setIdFront(null);
      setIdBack(null);
      setDocuments([]);
      setPreviews({ front: null, back: null, docs: [] });
    }
  }, [open]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleFileChange(e, which) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (which === "front") {
      setIdFront(file);
      setPreviews((p) => ({ ...p, front: url }));
      setErrors((prev) => ({ ...prev, idFront: "" }));
    } else if (which === "back") {
      setIdBack(file);
      setPreviews((p) => ({ ...p, back: url }));
      setErrors((prev) => ({ ...prev, idBack: "" }));
    }
  }

  function handleDocsChange(e) {
    const files = Array.from(e.target.files || []);
    setDocuments(files);
    const docPreviews = files.map((f) => ({ name: f.name }));
    setPreviews((p) => ({ ...p, docs: docPreviews }));
    if (files.length > 0) {
      setErrors((prev) => ({ ...prev, docs: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "dob",
      "placeOfBirth",
      "nationality",
      "previousStudies",
      "currentSituation",
      "address",
    ];

    requiredFields.forEach((field) => {
      if (!form[field] || (typeof form[field] === "string" && !form[field].trim())) {
        newErrors[field] = "This field is required";
      }
    });

    // Desired program check (taking programTitle into account)
    if (!form.program && !programTitle) {
      newErrors.program = "This field is required";
    }

    if (!idFront) newErrors.idFront = "This field is required";
    if (!idBack) newErrors.idBack = "This field is required";
    if (documents.length === 0) newErrors.docs = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!uniId) {
      toast.error("Ensure university information is loaded.");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", form.fullName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("date_of_birth", form.dob);
    formData.append("place_of_birth", form.placeOfBirth);
    formData.append("nationality", form.nationality);
    formData.append("address", form.address);
    formData.append("desired_program", form.program);
    // formData.append("campus", form.campus);
    formData.append("previous_studies", form.previousStudies);
    formData.append("current_situation", form.currentSituation);
    formData.append("is_authorized", String(form.dataProcessingAccepted));

    if (form.specialNeeds) formData.append("special_needs", form.specialNeeds);
    if (form.letterOfInterest) formData.append("letter_of_interest", form.letterOfInterest);

    if (idFront) formData.append("id_photo_front", idFront);
    if (idBack) formData.append("id_photo_back", idBack);

    if (documents.length > 0) {
      // If the backend expects multiple files with the same key
      documents.forEach(doc => {
        formData.append("supporting_documents", doc);
      });
    }

    try {
      await applyToUni({ id: uniId, body: formData }).unwrap();
      toast.success("Application submitted successfully!", {
        position: "bottom-center",
      });
      setStep("summary");
    } catch (err) {
      console.error("Application error:", err);
      const msg = err?.data?.message || err?.data?.error || "Failed to submit application. Please try again.";
      toast.error(msg);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[999999999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-[95%] md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto bg-white rounded-lg shadow-2xl p-6 z-10 border border-gray-200">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-20 pb-2 border-b">
          <h2 className="text-xl font-bold text-gray-800">Apply to {uniName}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full name <span className="text-red">*</span></label>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                />
                {errors.fullName && <p className="text-red text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email <span className="text-red">*</span></label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                />
                {errors.email && <p className="text-red text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Phone <span className="text-red">*</span></label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                />
                {errors.phone && <p className="text-red text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Date of birth <span className="text-red">*</span>
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                />
                {errors.dob && <p className="text-red text-xs mt-1">{errors.dob}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Place of birth <span className="text-red">*</span>
                </label>
                <input
                  name="placeOfBirth"
                  value={form.placeOfBirth}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.placeOfBirth ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                />
                {errors.placeOfBirth && <p className="text-red text-xs mt-1">{errors.placeOfBirth}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Nationality <span className="text-red">*</span></label>
                <input
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.nationality ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                />
                {errors.nationality && <p className="text-red text-xs mt-1">{errors.nationality}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Desired program of study <span className="text-red">*</span>
                </label>
                <input
                  name="program"
                  value={form.program || programTitle}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.program ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                />
                {errors.program && <p className="text-red text-xs mt-1">{errors.program}</p>}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium">Address <span className="text-red">*</span></label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                />
                {errors.address && <p className="text-red text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium">
                  Previous studies <span className="text-red">*</span>
                </label>
                <textarea
                  name="previousStudies"
                  value={form.previousStudies}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.previousStudies ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                  rows={3}
                />
                {errors.previousStudies && <p className="text-red text-xs mt-1">{errors.previousStudies}</p>}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium">
                  Current situation <span className="text-red">*</span>
                </label>
                <textarea
                  name="currentSituation"
                  value={form.currentSituation}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.currentSituation ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                  rows={2}
                />
                {errors.currentSituation && <p className="text-red text-xs mt-1">{errors.currentSituation}</p>}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium">
                  Special needs (optional)
                </label>
                <textarea
                  name="specialNeeds"
                  value={form.specialNeeds}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  ID photo (front) <span className="text-red">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "front")}
                  className={`mt-1 block w-full text-sm ${errors.idFront ? 'text-red' : ''}`}
                />
                {errors.idFront && <p className="text-red text-xs mt-1">{errors.idFront}</p>}
                {previews.front && (
                  <img
                    src={previews.front}
                    alt="id-front"
                    className="mt-2 h-24 object-contain rounded border"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  ID photo (back) <span className="text-red">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "back")}
                  className={`mt-1 block w-full text-sm ${errors.idBack ? 'text-red' : ''}`}
                />
                {errors.idBack && <p className="text-red text-xs mt-1">{errors.idBack}</p>}
                {previews.back && (
                  <img
                    src={previews.back}
                    alt="id-back"
                    className="mt-2 h-24 object-contain rounded border"
                  />
                )}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium">
                  Upload supporting documents (transcripts, health insurance,
                  birth certificate, etc.) <span className="text-red">*</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleDocsChange}
                  className="mt-1 block w-full text-sm"
                />
                {errors.docs && <p className="text-red text-xs mt-1">{errors.docs}</p>}

                {previews.docs.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                    {previews.docs.map((d, i) => (
                      <li key={i}>{d.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium">
                  Letter of interest <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  name="letterOfInterest"
                  value={form.letterOfInterest}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows={4}
                />
              </div>

              {/* <div className="md:col-span-2 flex items-center space-x-2">
                <input
                  id="dataProcessing"
                  name="dataProcessingAccepted"
                  type="checkbox"
                  checked={form.dataProcessingAccepted}
                  onChange={handleChange}
                />
                <label htmlFor="dataProcessing" className="text-sm">
                  I authorize processing of my data for admissions purposes.
                </label>
              </div> */}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {step === "summary" && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Enrollment process</h3>
            <p className="">
             <span className="text-green font-semibold">Thank you for your application.</span> Below is an overview of the next
              steps (example):
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Initial application review within 7–14 business days.</li>
              <li>
                Possible interview (phone/video) — you will be notified by email
                if selected.
              </li>
              <li>
                Acceptance notification timeframe: 2–6 weeks depending on
                program.
              </li>
              <li>
                Fees & pricing will be provided in your acceptance letter;
                please check program page for tuition estimates.
              </li>
            </ul>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="px-4 py-2 border rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep("chat")}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "chat" && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Need more help?</h3>
            <p className="text-sm">
              If you have further questions, you can speak directly with the
              Student Communications Manager.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Link
                to="/message"
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Speak with {uniName}, Student Communications Manager
              </Link>
              <button onClick={onClose} className="px-4 py-2 border rounded">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}