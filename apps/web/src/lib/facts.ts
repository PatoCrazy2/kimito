export interface Fact {
  category: "Convivencia" | "Limpieza";
  content: string;
}

export const FACTS_LIST: Fact[] = [
  {
    category: "Convivencia",
    content: "Una distribución clara de responsabilidades previene discusiones. Definir horarios y roles concretos ayuda a mantener una convivencia armónica.",
  },
  {
    category: "Limpieza",
    content: "El orden visual reduce el estrés. Mantener las encimeras de la cocina despejadas genera una sensación inmediata de bienestar en el hogar compartida.",
  },
  {
    category: "Convivencia",
    content: "La comunicación asertiva es la clave. Hablar de los pequeños desacuerdos con empatía y a tiempo evita que se conviertan en tensiones mayores.",
  },
  {
    category: "Limpieza",
    content: "Lavar tus propios utensilios de cocina justo después de usarlos demuestra respeto por el tiempo y el espacio de tus roommates.",
  },
  {
    category: "Convivencia",
    content: "Establecer normas claras sobre visitas y ruido ayuda a que todos sientan el hogar como un espacio de descanso seguro.",
  },
  {
    category: "Limpieza",
    content: "Ventilar los espacios comunes al menos diez minutos al día mejora la calidad del aire y reduce la acumulación de alérgenos.",
  },
  {
    category: "Convivencia",
    content: "Respetar la privacidad y las pertenencias individuales de tus roommates es la base para construir una confianza duradera.",
  },
  {
    category: "Limpieza",
    content: "Utilizar productos de limpieza multiusos simplifica el mantenimiento diario y optimiza el presupuesto común de la casa.",
  },
  {
    category: "Convivencia",
    content: "Un pequeño mensaje de agradecimiento cuando alguien realiza su tarea a tiempo fomenta una cultura de aprecio y cooperación mutua.",
  },
  {
    category: "Limpieza",
    content: "Organizar limpiezas profundas conjuntas de forma mensual no solo mantiene la casa impecable, sino que sirve como actividad de integración.",
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
