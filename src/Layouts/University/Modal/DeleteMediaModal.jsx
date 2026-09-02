"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteMediaModal({ media, onConfirm, onCancel, isDeleting }) {
    if (!media) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Eliminar Medio</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-6">
                        ¿Estás seguro de que quieres eliminar{" "}
                        <span className="font-bold text-gray-900">"{media.title}"</span>?
                        Esta acción eliminará permanentemente el archivo de la galería y no se puede deshacer.
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-6 py-2.5 bg-red text-white rounded-xl hover:bg-red-700 font-bold shadow-lg shadow-red-100 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar Medio"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
