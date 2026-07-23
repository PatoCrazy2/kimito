"use client";

import { useState } from "react";
import type { TaskAssignmentResponse } from "@kimito/shared-types";
import { uploadEvidenceAction } from "@/app/actions/storage-actions";
import { completeAssignmentAction } from "@/app/actions/scheduling-actions";

interface CompleteTaskModalProps {
  assignment: TaskAssignmentResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CompleteTaskModal({
  assignment,
  isOpen,
  onClose,
  onSuccess,
}: CompleteTaskModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !assignment) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let evidenceUrl: string | undefined = undefined;

      // Si el usuario seleccionó una foto, la subimos a /storage/upload
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await uploadEvidenceAction(formData);
        evidenceUrl = uploadRes.url;
      }

      // Marcar la tarea como completada en la BD
      await completeAssignmentAction(assignment.id, evidenceUrl);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error al completar tarea:", err);
      setErrorMsg(err.message || "Ocurrió un error al guardar la evidencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border/60 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-black text-lg text-foreground flex items-center gap-2">
            <span className="material-symbols-rounded text-emerald-600">
              check_circle
            </span>
            Completar Tarea
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-[#FAF9F6] border border-border/40 p-4 rounded-2xl space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Tarea seleccionada
          </p>
          <p className="font-black text-base text-foreground">
            {assignment.task?.title}
          </p>
          <span className="inline-block text-[10px] bg-amber-primary/10 text-amber-primary font-black px-2 py-0.5 rounded-full">
            Peso: {assignment.task?.weight || 1} ⭐
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-foreground">
              Foto de evidencia (opcional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="evidence-file-input"
            />

            <label
              htmlFor="evidence-file-input"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/60 rounded-2xl cursor-pointer hover:border-amber-primary/50 transition-all bg-[#FAF9F6]"
            >
              {previewUrl ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Evidencia"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <span className="material-symbols-rounded text-muted-foreground text-3xl">
                    add_a_photo
                  </span>
                  <p className="text-xs font-bold text-foreground">
                    Subir o tomar foto
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Formatos recomendados: JPG, PNG
                  </p>
                </div>
              )}
            </label>
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-destructive text-center">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Marcar Completada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
