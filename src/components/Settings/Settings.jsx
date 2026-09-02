"use client";

import { useState, useRef, useEffect } from "react";
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
} from "react-icons/lu";
import { MdOutlineFormatAlignLeft } from "react-icons/md";
import { useLocation } from "react-router-dom";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsConditionsQuery,
  useUpdateTermsConditionsMutation
} from "../../Api/universityApi";
import toast from "react-hot-toast";

export default function Settings() {
  const location = useLocation();
  // Only allow editing if on /admin/settings route; view-only on /university/settings
  const isAdmin = location.pathname === "/admin/settings";

  const [activeTab, setActiveTab] = useState("terms");
  // Per-tab editing flags so editing state doesn't interfere across tabs
  const [editingPrivacy, setEditingPrivacy] = useState(false);
  const [editingTerms, setEditingTerms] = useState(false);

  const { data: privacyData, isLoading: isPrivacyLoading } = useGetPrivacyPolicyQuery();
  const { data: termsData, isLoading: isTermsLoading } = useGetTermsConditionsQuery();

  const [updatePrivacy, { isLoading: isUpdatingPrivacy }] = useUpdatePrivacyPolicyMutation();
  const [updateTerms, { isLoading: isUpdatingTerms }] = useUpdateTermsConditionsMutation();

  const [tempPrivacyPolicy, setTempPrivacyPolicy] = useState("");
  const [tempTermsConditions, setTempTermsConditions] = useState("");

  // refs for rich text editors
  const privacyRef = useRef(null);
  const termsRef = useRef(null);

  useEffect(() => {
    if (privacyData?.content && !editingPrivacy) {
      setTempPrivacyPolicy(privacyData.content);
    }
  }, [privacyData, editingPrivacy]);

  useEffect(() => {
    if (termsData?.content && !editingTerms) {
      setTempTermsConditions(termsData.content);
    }
  }, [termsData, editingTerms]);

  useEffect(() => {
    if (editingPrivacy && privacyRef.current) {
      privacyRef.current.innerHTML = tempPrivacyPolicy;
    }
  }, [editingPrivacy, tempPrivacyPolicy]);

  useEffect(() => {
    if (editingTerms && termsRef.current) {
      termsRef.current.innerHTML = tempTermsConditions;
    }
  }, [editingTerms, tempTermsConditions]);

  const exec = (ref, command, value = null) => {
    if (!ref || !ref.current) return;
    ref.current.focus();
    try {
      document.execCommand(command, false, value);
    } catch (e) {
      // fallback noop
    }
  };

  const handleSavePrivacy = async (content) => {
    try {
      await updatePrivacy({ content }).unwrap();
      setEditingPrivacy(false);
      toast.success("Política de privacidad actualizada con éxito", { position: "bottom-center" });
    } catch (err) {
      toast.error("Error al actualizar la política de privacidad", { position: "bottom-center" });
    }
  };

  const handleCancelPrivacy = () => {
    setTempPrivacyPolicy(privacyData?.content || "");
    setEditingPrivacy(false);
  };

  const handleSaveTerms = async (content) => {
    try {
      await updateTerms({ content }).unwrap();
      setEditingTerms(false);
      toast.success("Términos y condiciones actualizados con éxito", { position: "bottom-center" });
    } catch (err) {
      toast.error("Error al actualizar los términos y condiciones", { position: "bottom-center" });
    }
  };

  const handleCancelTerms = () => {
    setTempTermsConditions(termsData?.content || "");
    setEditingTerms(false);
  };

  if (isPrivacyLoading || isTermsLoading) {
    return <div className="p-8 text-center text-gray-500">Cargando configuraciones...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuraciones del Sistema</h1>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8">

        <button
          onClick={() => {
            setActiveTab("terms");
          }}
          className={`pb-3 px-1 font-medium  border-b-2 transition ${activeTab === "terms"
            ? "border-blue text-blue"
            : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
        >
          Términos y Condiciones
        </button>
        <button
          onClick={() => {
            setActiveTab("privacy");
          }}
          className={`pb-3 px-1 font-medium  border-b-2 transition ${activeTab === "privacy"
            ? "border-blue text-blue"
            : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
        >
          Política de Privacidad
        </button>
      </div>



      {/* Privacy Policy Tab */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Política de Privacidad
            </h2>
            {isAdmin && (
              <button
                onClick={() => setEditingPrivacy(!editingPrivacy)}
                className="px-6 py-2 bg-blue text-white rounded-lg font-medium"
              >
                {editingPrivacy ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>

          {editingPrivacy && isAdmin ? (
            <div className="space-y-4">
              {/* toolbar */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => exec(privacyRef, "bold")}
                  className="px-2 py-1 border rounded"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => exec(privacyRef, "italic")}
                  className="px-2 py-1 border rounded"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => exec(privacyRef, "underline")}
                  className="px-2 py-1 border rounded"
                >
                  U
                </button>
                <select
                  onChange={(e) => exec(privacyRef, "fontSize", e.target.value)}
                  defaultValue="3"
                  className="ml-2 border px-2 py-1 rounded"
                >
                  <option value="1">XS</option>
                  <option value="2">S</option>
                  <option value="3">M</option>
                  <option value="4">L</option>
                  <option value="5">XL</option>
                </select>
                <div className="ml-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => exec(privacyRef, "justifyLeft")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec(privacyRef, "justifyCenter")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignCenter />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec(privacyRef, "justifyRight")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignRight />
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => exec(privacyRef, "justifyJustify")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignJustify />
                  </button> */}
                </div>
              </div>

              <div
                ref={privacyRef}
                contentEditable
                suppressContentEditableWarning
                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white "
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    handleCancelPrivacy();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  disabled={isUpdatingPrivacy}
                  onClick={() => {
                    const html = privacyRef.current
                      ? privacyRef.current.innerHTML
                      : tempPrivacyPolicy;
                    handleSavePrivacy(html);
                  }}
                  className="px-6 py-2 bg-blue text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isUpdatingPrivacy ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: privacyData?.content || "" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Terms & Conditions Tab */}
      {activeTab === "terms" && (
        <div className="bg-white rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Términos y Condiciones
            </h2>
            {isAdmin && (
              <button
                onClick={() => setEditingTerms(!editingTerms)}
                className="px-6 py-2 bg-blue text-white rounded-lg font-medium"
              >
                {editingTerms ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>

          {editingTerms && isAdmin ? (
            <div className="space-y-4">
              {/* toolbar */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => exec(termsRef, "bold")}
                  className="px-2 py-1 border rounded"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => exec(termsRef, "italic")}
                  className="px-2 py-1 border rounded"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => exec(termsRef, "underline")}
                  className="px-2 py-1 border rounded"
                >
                  U
                </button>
                <select
                  onChange={(e) => exec(termsRef, "fontSize", e.target.value)}
                  defaultValue="3"
                  className="ml-2 border px-2 py-1 rounded"
                >
                  <option value="1">XS</option>
                  <option value="2">S</option>
                  <option value="3">M</option>
                  <option value="4">L</option>
                  <option value="5">XL</option>
                </select>
                <div className="ml-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => exec(termsRef, "justifyLeft")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec(termsRef, "justifyCenter")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignCenter />
                  </button>
                  <button
                    type="button"
                    onClick={() => exec(termsRef, "justifyRight")}
                    className="px-2 py-1 border rounded"
                  >
                    <LuAlignRight />
                  </button>
                </div>
              </div>

              <div
                ref={termsRef}
                contentEditable
                suppressContentEditableWarning
                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white "
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    handleCancelTerms();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  disabled={isUpdatingTerms}
                  onClick={() => {
                    const html = termsRef.current
                      ? termsRef.current.innerHTML
                      : tempTermsConditions;
                    handleSaveTerms(html);
                  }}
                  className="px-6 py-2 bg-blue text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isUpdatingTerms ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none space-y-4">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: termsData?.content || "" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
