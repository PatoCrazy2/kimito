export interface Fact {
  category: "Convivencia" | "Limpieza";
  content: string;
}

export const FACTS_LIST: Fact[] = [
  {
    category: "Convivencia",
    content: "Un hogar limpio es un hogar en paz.",
  },
  {
    category: "Limpieza",
    content: "El orden en los espacios comunes refleja el respeto mutuo.",
  },
  {
    category: "Convivencia",
    content: "Hablar a tiempo evita malentendidos.",
  },
  {
    category: "Limpieza",
    content: "Lavar lo que usas al momento hace toda la diferencia.",
  },
  {
    category: "Convivencia",
    content: "El respeto al espacio ajeno es la clave de la convivencia.",
  },
  {
    category: "Limpieza",
    content: "Una ventilación diaria renueva el aire y la energía del hogar.",
  },
  {
    category: "Convivencia",
    content: "Pequeños hábitos diarios construyen grandes convivencias.",
  },
  {
    category: "Limpieza",
    content: "Mantener limpia la cocina beneficia a todos los roommates.",
  },
  {
    category: "Convivencia",
    content: "Agradecer las tareas hechas a tiempo fortalece el equipo.",
  },
  {
    category: "Convivencia",
    content: "La empatía transforma una casa en un verdadero hogar.",
  },
];

export function getDailyFact(): Fact {
  const today = new Date();
  // Calculate day of the year
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  
  return FACTS_LIST[day % FACTS_LIST.length];
}
