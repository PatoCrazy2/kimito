"use client";

import { useState } from "react";
import type { TaskResponse, HouseResponse } from "@kimito/shared-types";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/app/actions/task-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  { title: "Sacar basura", weight: 1, recurrence: "weekly" },
  { title: "Limpiar cocina", weight: 3, recurrence: "weekly" },
  { title: "Barrer y trapear", weight: 2, recurrence: "weekly" },
];

export default function TasksClient({ initialTasks, house, isAdmin }: TasksClientProps) {
  const [tasks, setTasks] = useState<TaskResponse[]>(initialTasks);

  // Form states
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
        <Link href="/dashboard/house" className={cn(buttonVariants({ variant: "default" }), "mt-6 rounded-xl font-bold bg-amber-primary text-white h-10 px-4 flex items-center justify-center")}>
          Ir a Mi Casa
        </Link>
      </div>
    );
  }

  const handleSelectFromCatalog = (catalogItem: typeof CATALOG_TASKS[number]) => {
    setTitle(catalogItem.title);
    setWeight(catalogItem.weight);
    setRecurrence(catalogItem.recurrence);
  };

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
        isCustom: true,
      });
      setTasks([...tasks, newTask]);
      setTitle("");
      setWeight(2);
      setRecurrence("weekly");
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            🧹 Gestor de Tareas
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Define las tareas de la casa, sus pesos de dificultad (1 al 5) y su frecuencia de realización.
          </p>
        </div>
        <div className="bg-secondary/10 border border-secondary/20 px-4 py-2.5 rounded-2xl flex items-center gap-2.5">
          <span className="material-symbols-rounded text-teal-secondary">shield_person</span>
          <div className="text-left select-none">
            <p className="text-xs font-bold text-teal-secondary uppercase tracking-wider leading-none">Rol en Casa</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{isAdmin ? "Administrador (Editar)" : "Roommate (Lectura)"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Formulario de Creación (Solo Admin) */}
        {isAdmin && (
          <div className="space-y-6">
            <Card className="border-border/50 shadow-md rounded-3xl bg-white/70 backdrop-blur-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-primary to-amber-primary/50" />
              <CardHeader className="pt-6">
                <CardTitle className="text-lg font-black text-foreground">Añadir Tarea</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground mt-1">
                  Agrega una tarea nueva escribiendo los datos o eligiendo del catálogo base.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Catálogo Rápido */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Catálogo Rápido (Preestablecido)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATALOG_TASKS.map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => handleSelectFromCatalog(item)}
                        className="text-xs font-bold bg-amber-primary/5 hover:bg-amber-primary/10 text-amber-primary border border-amber-primary/10 px-2.5 py-1.5 rounded-xl transition-colors duration-150"
                      >
                        {item.title} ({item.weight} pts)
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-border/30" />

                {/* Formulario */}
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nombre de Tarea *</label>
                    <Input
                      required
                      placeholder="Ej: Limpiar comedor..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Frecuencia / Recurrencia</label>
                    <select
                      value={recurrence}
                      onChange={(e) => setRecurrence(e.target.value)}
                      className="w-full text-sm rounded-xl border border-border/60 bg-background px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">Quincenal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peso / Dificultad (1-5)</label>
                      <span className="text-xs font-bold text-amber-primary bg-amber-primary/10 px-2 py-0.5 rounded-lg">{weight} ⭐</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-amber-primary/10 rounded-lg appearance-none cursor-pointer accent-amber-primary"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground px-1">
                      <span>Fácil (1)</span>
                      <span>Pesado (5)</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs font-bold text-destructive flex items-center gap-1.5">
                      <span className="material-symbols-rounded text-sm">warning</span>
                      {error}
                    </p>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-amber-primary hover:bg-amber-primary/95 text-white font-bold rounded-xl py-5 shadow-sm mt-2">
                    {loading ? "Creando..." : "Crear Tarea"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Columna Derecha: Listado de Tareas (Ocupa 3 cols si no es admin, 2 cols si es admin) */}
        <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card className="border-border/50 shadow-sm rounded-3xl bg-white/70 backdrop-blur-md p-6">
            <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 mb-4 select-none">
              <span className="material-symbols-rounded text-amber-primary">format_list_bulleted</span>
              Tareas Activas del Hogar ({tasks.length})
            </h3>

            {tasks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl select-none">
                <span className="material-symbols-rounded text-muted-foreground text-4xl mb-2">cleaning_services</span>
                <p className="text-sm font-bold text-muted-foreground">No hay tareas creadas todavía.</p>
                {isAdmin && <p className="text-xs text-muted-foreground/80 mt-1 font-semibold">Usa el panel de la izquierda para crear la primera.</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tasks.map((task) => {
                  const isEditing = editingId === task.id;
                  return (
                    <div key={task.id} className="bg-[#FAF9F6] border border-border/30 rounded-2xl p-4 transition-all duration-200 hover:shadow-sm">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input
                            placeholder="Nombre..."
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="rounded-xl border-border/60"
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
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="rounded-xl px-3 text-xs">
                              Cancelar
                            </Button>
                            <Button size="sm" onClick={() => handleUpdateTask(task.id)} className="rounded-xl px-4 text-xs bg-amber-primary text-white">
                              Guardar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-foreground">{task.title}</h4>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                task.isCustom 
                                  ? "bg-purple-100 text-purple-700" 
                                  : "bg-teal-100 text-teal-700"
                              }`}>
                                {task.isCustom ? "Personalizada" : "Catálogo"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-semibold">
                              <span className="material-symbols-rounded text-sm">repeat</span>
                              <span>Frecuencia: {task.recurrence === "daily" ? "Diaria" : task.recurrence === "weekly" ? "Semanal" : task.recurrence === "biweekly" ? "Quincenal" : "Mensual"}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right select-none">
                              <p className="text-[9px] font-bold text-muted-foreground uppercase">Peso / Esfuerzo</p>
                              <p className="text-sm font-black text-amber-primary mt-0.5">{task.weight} ⭐</p>
                            </div>
                            {isAdmin && (
                              <div className="flex items-center gap-1 border-l border-border/30 pl-3">
                                <Button size="icon" variant="ghost" onClick={() => handleStartEdit(task)} className="h-8 w-8 rounded-lg hover:bg-secondary/15 text-muted-foreground hover:text-foreground">
                                  <span className="material-symbols-rounded text-lg">edit</span>
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDeleteTask(task.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                                  <span className="material-symbols-rounded text-lg">delete</span>
                                </Button>
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
        </div>
      </div>
    </div>
  );
}
