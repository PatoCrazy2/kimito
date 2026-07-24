"use client";

import { useState } from "react";
import type { TaskResponse, HouseResponse } from "@kimito/shared-types";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/app/actions/task-actions";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TasksClientProps {
  initialTasks: TaskResponse[];
  house: HouseResponse | null;
  isAdmin: boolean;
}

const CATALOG_TASKS = [
  { title: "Lavar platos", weight: 2, recurrence: "daily" },
  { title: "Limpiar baño", weight: 4, recurrence: "weekly" },
  { title: "Sacar basura", weight: 1, recurrence: "daily" },
  { title: "Limpiar cocina", weight: 3, recurrence: "weekly" },
  { title: "Barrer y trapear", weight: 2, recurrence: "weekly" },
];

export default function TasksClient({ initialTasks, house, isAdmin }: TasksClientProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>(initialTasks);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [selectedTaskType, setSelectedTaskType] = useState<"custom" | "catalog">("catalog");
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<typeof CATALOG_TASKS[number] | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState(2);
  const [recurrence, setRecurrence] = useState("weekly");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editWeight, setEditWeight] = useState(2);
  const [editRecurrence, setEditRecurrence] = useState("weekly");

  if (!house) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto py-8">
        <div className="w-16 h-16 bg-amber-primary/10 text-amber-primary rounded-3xl flex items-center justify-center mb-4">
          <span className="material-symbols-rounded text-3xl font-bold">home_work</span>
        </div>
        <h2 className="text-xl font-black text-foreground">Hogar no configurado</h2>
        <p className="text-muted-foreground mt-2 font-medium text-sm leading-relaxed">
          Primero debes crear un hogar o unirte a uno antes de gestionar o ver las tareas domésticas.
        </p>
        <Link 
          href="/dashboard/house" 
          className="mt-6 rounded-xl font-bold bg-amber-primary text-white h-10 px-6 flex items-center justify-center text-sm shadow-sm hover:bg-amber-primary/95 transition-all"
        >
          Ir a Mi Casa
        </Link>
      </div>
    );
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (weight < 1 || weight > 5) {
      setError("El peso debe estar entre 1 y 5");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const newTask = await createTaskAction({
        title,
        weight,
        recurrence,
        isCustom: selectedTaskType === "custom",
      });
      setTasks([...tasks, newTask]);
      setTitle("");
      setWeight(2);
      setRecurrence("weekly");
      setSelectedCatalogItem(null);
      setSelectedTaskType("catalog");
      setCatalogSearch("");
      setIsCreateOpen(false);
    } catch (err: any) {
      setError(err.message || "Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (task: TaskResponse) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditWeight(task.weight);
    setEditRecurrence(task.recurrence);
  };

  const handleUpdateTask = async (id: string) => {
    if (!editTitle.trim()) return;
    if (editWeight < 1 || editWeight > 5) return;

    try {
      const updated = await updateTaskAction(id, {
        title: editTitle,
        weight: editWeight,
        recurrence: editRecurrence,
      });
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    try {
      await deleteTaskAction(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCatalog = CATALOG_TASKS.filter((item) =>
    item.title.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/30">
        <div>
          <h1 className="font-sans font-black text-2xl text-foreground tracking-tight flex items-center gap-2">
            Gestor de Tareas
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            Rol: <span className="font-extrabold text-foreground">{isAdmin ? "Administrador (Editar)" : "Roommate (Lectura)"}</span>
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-rounded text-base">add</span>
            Añadir Tarea
          </button>
        )}
      </div>

      {/* Listado de Tareas */}
      <Card className="border-border/40 shadow-[0_4px_24px_rgba(133,83,0,0.02)] rounded-3xl bg-white p-6">
        <h3 className="font-sans font-black text-base text-foreground flex items-center gap-2 mb-4 select-none">
          <span className="material-symbols-rounded text-amber-primary">format_list_bulleted</span>
          Tareas Activas del Hogar ({tasks.length})
        </h3>

        {tasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/45 rounded-2xl select-none">
            <span className="material-symbols-rounded text-muted-foreground text-4xl mb-2">cleaning_services</span>
            <p className="text-sm font-bold text-muted-foreground">No hay tareas creadas todavía.</p>
            {isAdmin && <p className="text-xs text-muted-foreground/80 mt-1 font-semibold">Crea una tarea nueva usando el botón Añadir Tarea.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {tasks.map((task) => {
              const isEditing = editingId === task.id;
              return (
                <div key={task.id} className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4 transition-all duration-200 hover:shadow-xs">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Nombre..."
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="rounded-xl border-border/60 text-xs py-2"
                      />
                      <div className="flex gap-4 items-center">
                        <select
                          value={editRecurrence}
                          onChange={(e) => setEditRecurrence(e.target.value)}
                          className="text-xs rounded-xl border border-border/60 bg-background px-3 py-2"
                        >
                          <option value="daily">Diaria</option>
                          <option value="weekly">Semanal</option>
                          <option value="biweekly">Quincenal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                        <div className="flex items-center gap-2 flex-grow">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Peso:</span>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            value={editWeight}
                            onChange={(e) => setEditWeight(Number(e.target.value))}
                            className="h-1 bg-amber-primary/10 rounded-lg appearance-none cursor-pointer accent-amber-primary flex-grow"
                          />
                          <span className="text-xs font-bold text-amber-primary px-2">{editWeight} pts</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setEditingId(null)} className="border border-border/60 hover:bg-muted text-foreground font-bold py-1.5 px-3 rounded-xl text-[10px] cursor-pointer">
                          Cancelar
                        </button>
                        <button onClick={() => handleUpdateTask(task.id)} className="bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] cursor-pointer">
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-[#1D1B16]">{task.title}</h4>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                            task.isCustom 
                              ? "bg-purple-100 text-purple-700" 
                              : "bg-amber-primary/10 text-amber-primary"
                          }`}>
                            {task.isCustom ? "Personalizada" : "Catálogo"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground font-medium">
                          <span className="material-symbols-rounded text-sm">repeat</span>
                          <span>Frecuencia: {task.recurrence === "daily" ? "Diaria" : task.recurrence === "weekly" ? "Semanal" : task.recurrence === "biweekly" ? "Quincenal" : "Mensual"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right select-none">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Dificultad</p>
                          <p className="text-sm font-black text-amber-primary mt-0.5">{task.weight} pts</p>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-1 border-l border-border/30 pl-3">
                            <button onClick={() => handleStartEdit(task)} className="h-8 w-8 rounded-lg hover:bg-[#F4EFE6] text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer">
                              <span className="material-symbols-rounded text-lg">edit</span>
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center cursor-pointer">
                              <span className="material-symbols-rounded text-lg">delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal / Bottom Sheet: Crear Tarea */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
          <div 
            className="fixed inset-0" 
            onClick={() => !loading && setIsCreateOpen(false)} 
          />
          <div className="relative bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-border/20 z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6" />

            <div className="text-left mb-6">
              <h2 className="font-sans font-black text-xl text-foreground">Añadir Tarea</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Elige una tarea del catálogo o crea una personalizada.
              </p>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              {/* Botón Tarea Personalizada */}
              <button
                type="button"
                onClick={() => {
                  setSelectedTaskType("custom");
                  setSelectedCatalogItem(null);
                  setTitle("");
                  setWeight(2);
                }}
                className={cn(
                  "w-full py-3 px-4 rounded-xl border font-bold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
                  selectedTaskType === "custom"
                    ? "bg-amber-primary/10 border-amber-primary/40 text-amber-primary shadow-xs"
                    : "bg-white border-border/40 text-foreground hover:bg-[#FAF9F6]"
                )}
              >
                <span className="material-symbols-rounded text-sm">edit_note</span>
                Crear Tarea Personalizada
              </button>

              {/* Buscador de Catálogo */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  O buscar en catálogo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-rounded text-muted-foreground text-lg select-none">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar tarea predefinida..."
                    value={catalogSearch}
                    onChange={(e) => {
                      setCatalogSearch(e.target.value);
                      if (selectedTaskType !== "catalog") {
                        setSelectedTaskType("catalog");
                      }
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F6] border border-border/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                  />
                </div>
              </div>

              {/* Lista del Catálogo */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto border border-border/40 rounded-xl p-2 bg-[#FAF9F6]">
                {filteredCatalog.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedTaskType("catalog");
                      setSelectedCatalogItem(item);
                      setTitle(item.title);
                      setWeight(item.weight);
                    }}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-left",
                      selectedCatalogItem?.title === item.title
                        ? "bg-amber-primary/10 border border-amber-primary/30 text-amber-primary font-bold"
                        : "hover:bg-[#F4EFE6] text-foreground border border-transparent"
                    )}
                  >
                    <span className="text-xs font-bold">{item.title}</span>
                    <span className="text-[10px] font-extrabold bg-white border border-border/30 px-2 py-0.5 rounded-md text-amber-primary">
                      {item.weight} pts
                    </span>
                  </div>
                ))}
                {filteredCatalog.length === 0 && (
                  <div className="text-center py-4 text-xs font-medium text-muted-foreground">
                    No hay coincidencias en el catálogo.
                  </div>
                )}
              </div>

              {/* Formulario Dinámico */}
              <form onSubmit={handleCreateTask} className="space-y-4 text-left pt-2 border-t border-border/30">
                {/* Visualización / Inputs de Tarea elegida */}
                {selectedTaskType === "custom" ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                        Nombre de la Tarea <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        required
                        placeholder="Ej: Limpiar el comedor..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        className="w-full bg-[#FAF9F6] border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="weight" className="text-xs font-bold text-foreground uppercase tracking-wider">Dificultad (1-5)</label>
                        <span className="text-xs font-extrabold text-amber-primary bg-amber-primary/10 px-2 py-0.5 rounded-lg">{weight} pts</span>
                      </div>
                      <input
                        id="weight"
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        disabled={loading}
                        className="w-full h-1.5 bg-amber-primary/10 rounded-lg appearance-none cursor-pointer accent-amber-primary"
                      />
                      <div className="flex justify-between text-[9px] font-bold text-muted-foreground px-1 mt-1">
                        <span>Fácil (1)</span>
                        <span>Pesado (5)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedCatalogItem && (
                    <div className="p-3 bg-amber-primary/5 border border-amber-primary/20 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
                      <div>
                        <p className="text-xs font-bold text-foreground">Seleccionado: {selectedCatalogItem.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Dificultad fija de catálogo (no editable)</p>
                      </div>
                      <span className="text-xs font-black text-amber-primary bg-amber-primary/10 px-2.5 py-1 rounded-lg">
                        {selectedCatalogItem.weight} pts
                      </span>
                    </div>
                  )
                )}

                {/* Recurrencia (siempre visible y editable) */}
                {(selectedTaskType === "custom" || selectedCatalogItem) && (
                  <div className="animate-in fade-in duration-200">
                    <label htmlFor="recurrence" className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                      Frecuencia / Recurrencia
                    </label>
                    <select
                      id="recurrence"
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      disabled={loading}
                      className="w-full text-sm rounded-xl border border-border/40 bg-[#FAF9F6] px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-primary/20 font-medium"
                    >
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">Quincenal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    disabled={loading}
                    className="flex-1 border border-border/60 hover:bg-muted text-foreground font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="flex-1 bg-amber-primary hover:bg-amber-primary/95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Añadiendo...
                      </>
                    ) : (
                      "Añadir Tarea"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
