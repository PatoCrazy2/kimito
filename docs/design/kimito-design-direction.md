# Kimito — Dirección de Diseño y Sistema Visual

> Auditoría del producto actual y propuesta de identidad visual.
> Documento de diseño. No contiene implementación.

---

## 1. Diagnóstico de la UI actual

### 1.1 Qué está bien y hay que proteger

Antes de criticar: hay decisiones buenas que deben sobrevivir al rediseño.

- **La base cálida (`#FAF9F6`)**. Es la mejor decisión visual del producto. Casi ningún SaaS usa papel cálido; la mayoría usa gris azulado. Esto ya es identidad. No la pierdas.
- **La escala de radios generosa** (`rounded-3xl` en superficies). La intención es correcta, la ejecución es inconsistente.
- **El bottom sheet en móvil** con grabber. Patrón correcto para el contexto real de uso (teléfono, cocina, de pie).
- **La frase del día** (`getDailyFact()`). Es el único gesto con personalidad en toda la app. Está huérfano de concepto, pero la intuición es buena.
- **La transición de login**. Ya establece un ritmo y una calma que el resto de la app no cumple.

### 1.2 Estado por dimensión

| Dimensión | Estado | Observación |
|---|---|---|
| Jerarquía visual | 🔴 Rota | Todo es `font-black`/`font-extrabold`. Sin contraste de peso no hay jerarquía. |
| Espaciados | 🟡 Inconsistente | Mezcla de `gap-3.5`, `py-2.5`, `p-5`, `mb-1.5`. Sin sistema. |
| Tipografía | 🔴 Crítico | Una sola familia, un solo peso percibido, cuerpo a 12px, labels a 9-10px. |
| Paleta | 🔴 Conflicto | Dos identidades corriendo a la vez: logo verde vs. UI ámbar. |
| Consistencia | 🔴 Baja | Mismo componente dibujado 3 veces distintas en 3 pantallas. |
| Componentes | 🔴 Sistema fantasma | Existe `ui/button`, `ui/input`, `ui/card` y casi nadie los usa. |
| Navegación | 🟡 Incompleta | Sin sidebar real. `navItems` duplicado. Un ítem apunta a nada. |
| Layout | 🔴 Sin desktop | `max-w-2xl` centrado en todos los breakpoints. Escritorio desaprovechado. |
| Flujo de usuario | 🟡 Con fricción | Onboarding duplicado, el core del producto escondido tras un toggle. |
| Microinteracciones | 🟡 Ad hoc | `active:scale-95` pegado a mano, sin tokens de duración. |
| Estados vacíos | 🟡 Genéricos | Misma plantilla 4 veces: círculo + negrita + gris. |
| Estados de carga | 🔴 Ausentes | Cero skeletons. Cero `loading.tsx`. Spinners hechos a mano. |
| Feedback visual | 🔴 Peligroso | Errores tragados por `console.error`. Sin sistema de toasts. |
| Accesibilidad | 🔴 Crítico | Contraste bajo AA, modales sin focus trap, `confirm()` nativo. |
| Sombras | 🔴 Inútiles | `rgba(133,83,0,0.02)` es invisible. No hay escalera de elevación. |
| Bordes | 🟡 Caos ordenado | Nueve opacidades distintas del mismo borde. |
| Radios | 🔴 Sin regla | `lg`, `xl`, `2xl`, `3xl`, `full`, `t-3xl` conviviendo sin lógica. |
| Iconografía | 🟡 Dos sistemas | Material Symbols + Lucide. Tamaños arbitrarios de 9px a 4xl. |
| Densidad | 🟡 Comprimida | Texto pequeño y bold apretado. Se lee como panel de admin. |

---

## 2. Problemas encontrados

### 🔴 P1 — La app tiene dos identidades peleando

Este es el problema número uno y contamina todo lo demás.

- El logo nuevo es **verde botánico** (`#1E7A5A`, `#3BA6A0`).
- Toda la UI es **ámbar** (`#855300`) con acentos teal (`#006B5F`).
- El login se cambió a fondo `#F7FAF8` mientras el dashboard sigue en `#FAF9F6`.

Resultado: el usuario cruza el login y la marca cambia de color. No hay ninguna lectura de esto como intencional; se lee como error. **Hay que elegir una y matar la otra.**

### 🔴 P2 — El design system existe y está siendo ignorado

`globals.css` define un set de tokens razonable (`--primary`, `--muted`, `--accent`, `--border`, `--radius` con escala `sm→3xl`). Después, en las pantallas:

- `bg-[#FAF9F6]` aparece hardcodeado en ~15 archivos, cuando ya existe `bg-background` y `bg-muted`.
- `#1D1B16`, `#006B5F`, `#F4EFE6`, `#F7FAF8` también van a pelo.
- `ui/button.tsx` tiene un sistema `cva` completo con variantes y tamaños (`h-8`, `rounded-lg`, `xs/sm/lg/icon`)... y las pantallas escriben `<button className="bg-amber-primary ... rounded-xl py-3">` a mano.
- Donde sí se usa `<Button>` (login), se le sobreescribe todo: `h-12 rounded-xl bg-amber-primary`.
- `ui/card.tsx` define `rounded-xl ring-1 ring-foreground/10`, y **todas** las llamadas lo anulan con `rounded-3xl bg-white border-border/40 shadow-[...]`.

Un sistema de diseño que se sobreescribe en cada uso no es un sistema, es decoración. Esto es también la razón técnica de por qué la app "se ve como cualquier proyecto Tailwind": no hay una capa de decisión, hay 40 decisiones locales.

### 🔴 P3 — Todo está en negrita, entonces nada destaca

Inventario real de pesos: `font-black` en h1/h2/h3 y en valores numéricos, `font-extrabold` en labels y nombres, `font-bold` en cuerpo de tarjeta y botones, `font-semibold` en labels de formulario, `font-medium` en descripciones.

El peso regular prácticamente no existe en la aplicación. Cuando el 90% del texto pesa 700-900, el peso deja de ser una herramienta de jerarquía. Es el equivalente tipográfico de hablar gritando todo el tiempo.

Agravante: el **cuerpo de texto está a `text-xs` (12px)** en tarjetas, descripciones y estados vacíos, mientras los labels bajan a `text-[10px]` y `text-[9px]` con `uppercase tracking-wider`. Eso es micro-tipografía usada como recurso principal, no como excepción.

### 🔴 P4 — La píldora ámbar significa nueve cosas distintas

`bg-amber-primary/10 text-amber-primary rounded-full` se usa hoy para:

1. El tag "MVP" del navbar
2. Estado activo de navegación
3. El peso/dificultad de una tarea
4. El estado "Pendiente"
5. El porcentaje de progreso
6. La etiqueta "Catálogo"
7. El rol "Administrador"
8. El valor de dificultad en pts
9. Los iconos de sección

Si el mismo objeto visual marca estado, categoría, métrica, rol y navegación, el usuario no puede aprender el lenguaje. La jerarquía se aplana: nueve cosas igual de importantes es cero cosas importantes.

### 🔴 P5 — Los errores se pierden en silencio

Esto es un bug de UX, no un tema estético.

- `TaskCalendar` → `handleGenerate` y `handleOverride`: en `catch` solo hacen `console.error`. Si falla la reasignación, **el usuario no ve nada**. La UI queda mostrando el estado viejo sin explicación.
- `TasksClient` → `handleUpdateTask` y `handleDeleteTask`: igual, solo `console.error`.
- No existe sistema de toasts. El feedback de éxito tampoco existe: la tarea se completa y no hay confirmación, solo desaparece el modal.

### 🔴 P6 — Accesibilidad por debajo de mínimos

Problemas verificables en el código:

- **Contraste**: `--muted-foreground: #7E7665` sobre `#FAF9F6` queda alrededor de 4.3:1, por debajo del 4.5:1 exigido para texto pequeño. Peor: `DashboardClient` usa `text-muted-foreground/60` y `/80` para la frase del día y textos de apoyo, lo que hunde el ratio a rangos de ~2-3:1. Eso es texto que buena parte de usuarios simplemente no puede leer.
- **Modales sin semántica ni foco**: no hay `role="dialog"`, `aria-modal`, focus trap, cierre con Escape, ni retorno de foco. El overlay que cierra es un `<div>` sin rol. El botón de cerrar es el carácter `✕` sin etiqueta accesible.
- **`confirm()` nativo** para borrar tareas.
- **Iconos como texto**: Material Symbols renderiza ligaduras; sin `aria-hidden` un lector de pantalla puede leer literalmente "cleaning_services".
- **Nav duplicada sin etiquetar**: dos `<nav>` (desktop/mobile) sin `aria-label`, sin skip link.
- **El bottom nav se esconde al hacer scroll**. Ocultar la navegación primaria por movimiento penaliza a usuarios con dificultades motoras o cognitivas, y no hay forma de desactivarlo.
- **El `<select>` de reasignación** muestra como valor al asignado actual, pero todas las opciones se leen "Reasignar a: X". El estado actual queda mal etiquetado.

### 🟡 P7 — Sin desktop

`DashboardLayout` centra un `max-w-2xl` en todos los tamaños. En un monitor, la app es una columna estrecha flotando en vacío: se lee como captura de móvil estirada.

Además `Sidebar.tsx` **no renderiza ningún sidebar**: es `md:hidden` y solo dibuja la barra inferior móvil. El nombre miente y el escritorio nunca recibió diseño.

### 🟡 P8 — El corazón del producto está escondido

La propuesta de valor de Kimito es *el reparto justo*. Hoy el calendario de asignaciones vive detrás de un botón al final del home: "Ver Calendario de la Casa". La equidad —lo único que esta app hace y una lista de tareas no— está a dos interacciones y sin representación visual propia.

Y "Generar Reparto" reasigna todo el hogar de golpe: sin previsualización, sin confirmación, sin deshacer.

### 🟡 P9 — Duplicación estructural

- **Dos onboardings**: `dashboard/OnboardingClient.tsx` y `onboarding/OnboardingFullscreenClient.tsx`. Misma tarea, dos maquetaciones, dos veces la lógica de crear/unirse.
- **Crear casa existe 3 veces** con markup distinto (onboarding dashboard, onboarding fullscreen, HouseClient).
- **`navItems` duplicado** en `Navbar.tsx` y `Sidebar.tsx`.
- **Refresco inconsistente**: `HouseClient` hace `window.location.reload()` (recarga completa, mata la sensación de app) mientras `OnboardingClient` hace `router.refresh()` para la misma operación.

### 🟡 P10 — Vocabulario de panel administrativo

"Gestor de Tareas", "Peso: 3 ★", "Dificultad", "pts", "Efectividad 100%", "Reparto equitativo de labores del hogar".

Tres términos distintos (*peso*, *dificultad*, *pts*) para el mismo campo. Y el tono general es de sistema de RR.HH. gamificado, no de convivencia entre amigos. Kimito habla como software; debería hablar como el roomie organizado.

### 🟢 P11 — Deuda menor

- **Fuentes cargadas dos veces**: `@import url()` en `globals.css` *y* `<link>` en el `<head>` del layout, para Plus Jakarta Sans y Material Symbols. El `@import` en CSS es además la forma más lenta.
- **Dark mode a medio construir**: `.dark` define el set completo de tokens, pero no hay toggle ni un solo `dark:` en componentes de feature. Y con todos los `bg-white`/`#FAF9F6` hardcodeados, el día que se active se rompe.
- **Dos librerías de iconos** para usar una sola cosa de la segunda (`Loader2`).

---

## 3. Propuesta de identidad visual

### 3.1 Concepto: **Quiet Structure** (Estructura Serena)

> El diseño de una casa bien llevada: nada grita, todo está en su sitio.

Kimito no es una app de limpieza ni un tablero de productividad. Es **el acuerdo silencioso que hace que vivir juntos funcione**. La interfaz debe sentirse como entrar a un departamento ordenado: no te impresiona, te relaja. Sabes dónde está todo.

La tensión creativa del producto es *estructura* (turnos, pesos, calendarios, equidad) dentro de un espacio *doméstico* (cálido, informal, humano). La mayoría de apps del rubro resuelven eso volviéndose infantiles (colores primarios, mascotas, confeti) o volviéndose frías (tablas, grids, dashboards). Kimito debe hacer lo tercero: **rigor con calidez**.

### 3.2 Los dos dispositivos visuales propios

Una identidad no son colores, son **gestos repetibles**. Kimito tiene dos, y los dos salen del logo:

**a) La Repisa (`The Shelf`)**

El logo tiene una línea horizontal que divide la casa en dos secciones. Ese es el gesto rector: en vez de que todo el contenido flote en tarjetas redondeadas independientes (el patrón que hace que todo se vea igual), **el contenido se apoya en repisas**: una línea de cabecera fina, con una marca corta y gruesa a la izquierda, y el contenido descansando debajo con aire.

Esto es el movimiento anti-genérico más importante del documento. Un grid de cards con sombra es el default de Tailwind. Contenido organizado sobre repisas con hairlines es un lenguaje.

**b) La Cuadrícula de Ventanas (`The Window Grid`)**

Las 4 ventanas 2×2 del logo se convierten en el motivo para representar datos: distribución de carga, progreso, reparto entre personas. Es el gráfico nativo de Kimito. Donde otra app pondría un donut chart genérico, Kimito pone cuadrantes.

### 3.3 Mood y emoción

**Mood board verbal:** domingo por la mañana. Luz lateral sobre madera clara. Papel de buen gramaje. Una planta que alguien recuerda regar. Café hecho. La cocina ya limpia sin que nadie lo mencione.

**Emoción objetivo:** alivio. Control compartido. La certeza tranquila de que nadie está llevando la cuenta en secreto.

**Emociones a evitar activamente:**
- Competencia (rankings, puntajes, "el mejor roomie del mes")
- Vigilancia (la app no es una supervisora)
- Culpa (nunca rojo por una tarea atrasada de una persona concreta)
- Urgencia (nada parpadea, nada cuenta hacia atrás)

### 3.4 Personalidad de marca

Kimito es **el roomie más organizado de la casa, que además tiene tacto.** Lleva la cuenta, pero nunca te la echa en cara. Habla claro, corto y con humor seco. Nunca regaña, nunca celebra de más.

| Es | No es |
|---|---|
| Preciso | Rígido |
| Cálido | Blandito |
| Discreto | Aburrido |
| Con humor seco | Chistoso |
| Justo | Juez |

**Voz aplicada:**
- ❌ "¡Felicidades! 🎉 Completaste tu tarea. +3 pts" → ✅ "Listo. Te toca el jueves."
- ❌ "Tienes 2 tareas atrasadas" → ✅ "Quedaron dos pendientes de la semana."
- ❌ "Efectividad: 100%" → ✅ "Cumpliste las 8 de 8."
- ❌ "Gestor de Tareas" → ✅ "Tareas"

### 3.5 Principios de diseño

Seis reglas para resolver discusiones sin volver a este documento.

1. **La calma es la función.** Si un elemento aumenta la carga visual sin bajar la carga mental, se va.
2. **Una voz por pantalla.** Cada vista tiene *una* acción primaria. Todo lo demás es secundario o silencioso.
3. **El peso comunica.** Máximo dos pesos tipográficos por pantalla. Si todo es bold, nada es bold.
4. **Papel, no plástico.** La profundidad se logra con tono, línea y hueco. La sombra se reserva para lo que de verdad flota.
5. **Aire antes que línea.** Antes de separar con un borde, intenta separar con espacio.
6. **Nada compite.** Un solo acento cromático activo por vista. El color es información, no decoración.

---

## 4. Dirección artística

### 4.1 Resolución del conflicto de paleta

**Decisión: gana el verde. El ámbar se retira.**

Justificación: el logo es el activo de marca menos negociable y ya es verde. El verde botánico también sirve mejor al concepto (doméstico, vivo, sereno) que el ámbar, que empuja hacia "acogedor rústico" y hacia el terreno de las apps de recetas. Y el verde permite algo que el ámbar no: usar el mismo color para *marca* y para *éxito/completado*, lo que reduce el ruido cromático del sistema en una entrada entera.

**Lo que se conserva:** la base de papel cálido. Verde botánico sobre papel cálido (no sobre blanco frío) es la combinación que le da carácter y evita el look "startup de fintech".

### 4.2 Referencias y qué se toma de cada una

| Referencia | Qué se toma | Qué NO se toma |
|---|---|---|
| Linear | Densidad tranquila, teclado primero, transiciones cortas | La oscuridad, el look sci-fi, los gradientes morados |
| Notion | Respeto por el contenido, tipografía como estructura | El vacío gris, la sensación de documento |
| Arc | Alegría contenida, curvas generosas | El maximalismo de color, los degradados |
| Stripe | Precisión en datos y números tabulares | La formalidad corporativa |
| Apple HIG | Claridad, jerarquía por peso, materiales | El neutro frío, el cristal |
| Material 3 | Tonos de superficie, contenedores de color | Los rellenos saturados, la elevación exagerada |

**La mezcla propia:** *la densidad y la calma de Linear, aplicadas con el material cálido y editorial de una revista de interiores.* Ni oscuro ni corporativo: papel, tinta y una planta.

### 4.3 Tratamiento tipográfico como firma

Aquí es donde la app deja de verse genérica de un solo golpe.

**Propuesta: serif de display + sans de interfaz.**

- **Display / Títulos: Fraunces.** Serif suave, con ejes ópticos y de "wonk" (irregularidad controlada). Es cálida, editorial y memorable; nadie la usa en SaaS de tareas. Aporta lo doméstico sin caer en lo naïf.
- **Interfaz / Cuerpo: Plus Jakarta Sans.** Ya está instalada, es neutra y legible. Se queda, pero se usa bien: pesos regular y medium como norma.
- **Números y códigos: una mono tabular** (Geist Mono o IBM Plex Mono) exclusivamente para códigos de invitación y cifras alineadas.

La regla que crea la firma: **los títulos son serif, la interfaz es sans, y jamás se mezclan en la misma línea.** Un h1 en Fraunces sobre una tabla de datos en Jakarta es instantáneamente reconocible.

---

## 5. Nuevo Design System

### 5.1 Color — capa cruda

| Token | Valor | Uso |
|---|---|---|
| `paper-50` | `#FBFAF7` | Canvas alterno |
| `paper-100` | `#FAF9F6` | **Canvas principal** |
| `paper-200` | `#F4F2EC` | Superficie hundida (inputs, insets) |
| `paper-300` | `#E9E5DB` | Línea fuerte, divisores marcados |
| `paper-400` | `#DAD5C8` | Bordes de énfasis |
| `ink-900` | `#1B1A17` | **Tinta principal** |
| `ink-700` | `#3D3A33` | Tinta secundaria |
| `ink-500` | `#6B6355` | Tinta apagada (corregida para AA) |
| `ink-400` | `#8C8474` | Tinta sutil — solo texto ≥16px |
| `green-700` | `#175C45` | Presionado / hover profundo |
| `green-600` | `#1E7A5A` | **Marca / primario / éxito** |
| `green-300` | `#A8D5C2` | Ilustración, relleno suave |
| `green-100` | `#E8F2EC` | Fondo de acento |
| `teal-600` | `#2A7D78` | Acento secundario seguro para texto |
| `teal-400` | `#3BA6A0` | Acento decorativo / logo |
| `clay-600` | `#A34A2E` | Atención / atrasado |
| `clay-100` | `#F7EAE4` | Fondo de atención |
| `berry-600` | `#B3261E` | Destructivo |
| `berry-100` | `#F9E7E5` | Fondo destructivo |

### 5.2 Color — capa semántica

Las pantallas **solo** consumen esta capa. Nunca un hex, nunca un token crudo.

| Token semántico | Referencia |
|---|---|
| `canvas` | `paper-100` |
| `surface` | `#FFFFFF` |
| `surface-sunken` | `paper-200` |
| `line` | `paper-300` |
| `line-strong` | `paper-400` |
| `text-primary` | `ink-900` |
| `text-secondary` | `ink-700` |
| `text-muted` | `ink-500` |
| `accent` | `green-600` |
| `accent-hover` | `green-700` |
| `accent-weak` | `green-100` |
| `accent-on` | `#FFFFFF` |
| `attention` / `attention-weak` | `clay-600` / `clay-100` |
| `danger` / `danger-weak` | `berry-600` / `berry-100` |
| `focus-ring` | `green-600` al 25% |

**Reglas de color:**
- Un solo acento activo por vista.
- El verde nunca se usa decorativamente. Si algo es verde, es marca, es acción o está hecho.
- Nada de degradados, salvo la ilustración de marca.
- Estado "atrasado" usa `attention` (barro), nunca `danger`. Una tarea pendiente no es un error.

### 5.3 Tipografía

| Rol | Familia | Tamaño / Interlínea | Peso | Regla |
|---|---|---|---|---|
| Display | Fraunces | 40 / 1.05, tracking -2% | 600 | Máx. 1 por pantalla |
| Title | Fraunces | 28 / 1.15, tracking -1% | 600 | Cabecera de pantalla |
| Heading | Jakarta | 20 / 1.30 | 600 | Cabecera de sección |
| Subhead | Jakarta | 16 / 1.40 | 500 | Título de fila / tarjeta |
| **Body** | Jakarta | **15 / 1.60** | **400** | Texto por defecto |
| Body strong | Jakarta | 15 / 1.60 | 500 | Énfasis dentro de cuerpo |
| Label | Jakarta | 13 / 1.40 | 500 | Etiquetas de formulario, **caja normal** |
| Micro | Jakarta | 12 / 1.30 | 500 | Metadatos. Uso excepcional. |
| Numeric | Mono | tabular | 500 | Cifras, códigos |

**Reglas tipográficas:**
- **Prohibido `font-black`** salvo Display.
- **Máximo dos pesos por pantalla.**
- **Nada por debajo de 12px.** Los `text-[9px]` y `text-[10px]` desaparecen.
- **`uppercase` + `tracking-wider` deja de ser el patrón de label por defecto.** Se permite solo en overlines de una o dos palabras, nunca en frases.
- El cuerpo es **regular a 15px**, no bold a 12px. Este único cambio transforma la percepción de calidad de la app.

### 5.4 Espaciado y grid

**Base 4px.** Set permitido: `2, 4, 8, 12, 16, 24, 32, 48, 64, 96`. Quedan prohibidos los intermedios arbitrarios (`3.5`, `2.5`, `1.5`) que hoy están repartidos por el código.

| Contexto | Valor |
|---|---|
| Padding de panel | 24 |
| Padding de panel compacto | 16 |
| Gap entre secciones | 32 |
| Gap entre elementos de lista | 8 |
| Gutter de pantalla (móvil) | 20 |
| Gutter de pantalla (desktop) | 32 |
| Label → campo | 8 |
| Campo → siguiente campo | 20 |

**Grid:**
- Móvil: 1 columna, ancho completo menos gutters.
- Desktop: rail de navegación de 240px + contenido fluido con **máximo de 1200px**, en 12 columnas y gutter de 24. Ancho de lectura de texto largo limitado a 68 caracteres.
- Se abandona el `max-w-2xl` centrado universal.

### 5.5 Radios

Se colapsan nueve valores a cinco, con una regla que resuelve el resto.

| Token | Valor | Uso |
|---|---|---|
| `radius-xs` | 6 | Chips de categoría, badges cuadrados |
| `radius-sm` | 10 | Inputs pequeños, botones compactos |
| `radius-md` | 14 | **Botones, inputs, controles** |
| `radius-lg` | 20 | **Paneles, superficies** |
| `radius-xl` | 28 | Modales, bottom sheets |
| `radius-full` | — | Solo avatares y chips de estado |

**La regla:** *los controles nunca pasan de 14; los contenedores nunca bajan de 20.* Ese contraste entre control nítido y superficie generosa es lo que hoy falta y por lo que todo se ve blando.

### 5.6 Elevación

Hoy hay dos estados: invisible (2% alpha) y modal (`shadow-2xl`). Se propone una escalera real y suave.

| Nivel | Uso | Especificación |
|---|---|---|
| `e0` | Paneles estáticos, filas | Sin sombra. `1px line` + tono de superficie. |
| `e1` | Tarjeta interactiva en hover | `0 1px 2px rgba(27,26,23,.04)`, `0 2px 8px rgba(27,26,23,.04)` |
| `e2` | Dropdown, popover, toast | `0 4px 12px rgba(27,26,23,.06)`, `0 12px 32px rgba(27,26,23,.08)` |
| `e3` | Modal, sheet | `0 24px 64px rgba(27,26,23,.14)` |

**Regla:** la elevación solo se aplica a lo que realmente flota. Un panel estático se define por línea y tono, no por sombra. Esto es "papel, no plástico".

### 5.7 Bordes

Se eliminan las nueve opacidades. Tres opciones:

- `line` — divisor y contorno por defecto (1px)
- `line-strong` — separación de sección, borde en hover
- `dashed line-strong` — exclusivamente zonas vacías y drop targets

### 5.8 Iconografía

**Decisión: un solo set. Lucide, 1.5px de trazo.** Material Symbols se retira.

Razones: ya es dependencia del proyecto; elimina dos peticiones de fuente bloqueantes; el trazo geométrico lineal conversa con la construcción del logo; y evita que los lectores de pantalla lean ligaduras.

| Tamaño | Uso |
|---|---|
| 16 | Inline con texto |
| 20 | **Por defecto** — botones, filas, nav |
| 24 | Cabeceras de sección |
| 32 | Estados vacíos |

Reglas: siempre `aria-hidden` cuando es decorativo; el color lo hereda del texto salvo intención semántica explícita; se prohíben los tamaños arbitrarios actuales (`text-xs` … `text-4xl`).

Sobre el motivo de marca: la cuadrícula 2×2 del logo se reserva como elemento gráfico propietario (progreso, distribución, splash, vacíos). No es un icono de UI.

### 5.9 Componentes

**Botones** — tres variantes, no seis.

| Variante | Aspecto | Uso |
|---|---|---|
| `solid` | `accent` de fondo, texto blanco | Una por pantalla |
| `soft` | `accent-weak` de fondo, texto `accent` | Acciones secundarias |
| `quiet` | Transparente, texto `text-secondary` | Cancelar, terciarias |
| `danger` | `danger-weak` / texto `danger` | Destructivas |

Alturas: 32 (sm) / 40 (md, por defecto) / 48 (lg, primaria móvil). Radio 14. Área táctil mínima real de 44px en móvil. Estado presionado: `translateY(1px)` y oscurecimiento de fondo — se retira el `active:scale-95`, que a este tamaño se lee como rebote de juguete.

**Inputs**

Altura 44. Radio 14. Fondo `surface-sunken`, borde `line`. Foco: anillo de 3px `focus-ring` y borde a `accent`. Label arriba a 13/500 en **caja normal**. Texto de ayuda debajo a 13 en `text-muted`. Error: borde `danger`, mensaje con icono a 13. Se elimina el patrón actual de label en 10px mayúscula con tracking.

**Paneles y Repisas** (reemplazan a "Card")

- **Panel**: `surface`, borde `line`, radio 20, padding 24, sin sombra.
- **Repisa**: cabecera de sección — título Heading, marca vertical de 3px en `accent` a la izquierda, hairline debajo, contenido en el hueco inferior. Es el contenedor por defecto para listas dentro de una pantalla.

La consecuencia importante: **la mayoría de las secciones que hoy son tarjetas blancas flotantes pasan a ser repisas sobre el canvas.** Menos cajas, más ritmo, identidad propia.

**Chips — diferenciados por forma, no todos píldora ámbar**

| Tipo | Forma | Ejemplo |
|---|---|---|
| Estado | Punto de color + texto, sin relleno | · Pendiente |
| Categoría | Rectángulo tenue, radio 6 | Catálogo |
| Métrica | Número tabular + unidad, sin contenedor | 3 de esfuerzo |
| Rol | Texto en `text-muted`, sin contenedor | Administrador |

Esto resuelve P4: cada tipo de información tiene una forma distinta y se vuelve aprendible.

**Modales y Sheets**

- Desktop: diálogo centrado, 480–560 de ancho, radio 28, `e3`, backdrop `ink-900` al 40% con blur ligero.
- Móvil: bottom sheet, radio 28 superior, grabber, alto máximo 90vh.
- Obligatorio: `role="dialog"`, `aria-modal`, título asociado, focus trap, cierre con Escape, retorno de foco al disparador, botón de cerrar con etiqueta accesible.
- Acciones en footer fijo; primaria a la derecha en desktop, ancho completo apilada en móvil.

**Dropdowns**

`surface`, radio 14, `e2`, padding 4, filas de 40 con radio 10. Navegación por teclado completa. Separadores con `line`. Ítems destructivos en `danger`, siempre al final tras un separador.

**Toasts** *(sistema nuevo — hoy no existe)*

Posición: abajo al centro en móvil, abajo a la derecha en desktop. `surface` + `e2`, radio 14, icono de 20 + mensaje a 15/400 + acción opcional. Duración 4s (6s si trae "Deshacer"). Máximo 3 apilados. Entrada: desplazamiento de 8px + fade en 180ms.

Variantes: neutro, éxito (`accent`), atención (`attention`), error (`danger`).

**Rail de navegación (desktop)** *(nuevo)*

240px fijo. Arriba: logo + selector de hogar. Después los ítems: icono 20 + label 15/500, alto de fila 40, radio 10. Activo: fondo `accent-weak`, texto `accent`, barra de 2px en `accent` a la izquierda. Abajo, anclado: usuario y ajustes.

**Barra inferior (móvil)**

Siempre visible — **se retira el ocultamiento por scroll**. `surface` con blur, hairline superior, 5 ítems máximo, objetivos de 48px. Activo: icono relleno + label en `accent`. Etiquetas en 12/500, caja normal, no mayúsculas.

**Topbar**

En desktop se reduce a una tira de contexto: breadcrumb / nombre de pantalla a la izquierda, búsqueda y acciones a la derecha. Deja de repetir el logo (ya está en el rail). Se elimina el tag "MVP" del área de marca.

**Listas en vez de tablas**

Kimito no necesita tablas. Filas de 56 sobre repisas, separadas por hairline: contenido principal a la izquierda (Subhead + Micro), metadatos y acciones alineados a la derecha, números en mono tabular. En desktop, columnas alineadas mediante grid, sin cromo de tabla.

**Calendario / Reparto** — el componente insignia

Este componente debe cargar la identidad del producto. Propuesta:

1. **Tira de semana** en la parte superior: siete columnas, día actual marcado con la marca de repisa, puntos por persona bajo cada día.
2. **Barra de carga justa**: una sola barra horizontal segmentada por persona, cada segmento proporcional al esfuerzo asignado. Es la representación literal de la equidad y el activo visual más importante de Kimito. Debe ser lo primero que se ve.
3. **Cuadrícula de ventanas** para el detalle por persona, usando el motivo de marca.
4. Las asignaciones se listan debajo como filas, no como grid de tarjetas.

**Formularios**

Una columna, 480 de ancho máximo, label arriba. Secciones agrupadas con cabecera de repisa. En sheets, footer de acciones fijo. Validación en `blur`, no en cada tecla. Nunca deshabilitar el botón de envío sin explicar por qué falta.

---

## 6. Mejoras pantalla por pantalla

### 6.1 Login y Registro

**Hoy:** tarjeta centrada, logo, título, descripción, formulario, divisor "O continuar con", Google, enlace a registro. Correcto pero anónimo — es el login por defecto de cualquier plantilla.

**Propuesta:**
- **Split en desktop:** izquierda, el formulario en una columna tranquila; derecha, un panel de marca con la cuadrícula de ventanas y una frase de posicionamiento sobre `canvas`. Móvil se mantiene en una columna.
- Título en **Fraunces Display**: "Tu hogar, en orden." — es lo primero que instala la nueva identidad.
- El campo de correo recibe foco automático.
- El divisor "O continuar con" pasa a hairline con la etiqueta en `text-muted` a 13, sin mayúsculas.
- Google como `soft`, credenciales como `solid`. Hoy compiten visualmente.
- **Continuidad con la transición:** el logo del login queda en la posición y tamaño exactos que ocupa en la animación de éxito. Ese es el truco que hace que la transición se sienta diseñada junto a la pantalla.
- Fondo unificado a `canvas`. Se elimina el `#F7FAF8` divergente.

### 6.2 Onboarding (crear o unirse a un hogar)

**Hoy:** dos implementaciones distintas, la misma decisión mostrada como dos botones lado a lado, y luego un sheet para cada camino.

**Propuesta:**
- **Una sola implementación**, fullscreen, sin cromo de navegación. Se elimina la variante embebida en el dashboard.
- Reformular como **dos caminos con jerarquía explícita**, no dos botones simétricos: "Crear un hogar" como panel primario con descripción; "Ya tengo un código" como enlace discreto debajo. La mayoría de usuarios nuevos crean, no se unen.
- El código de invitación en un input de mono tabular con separación por caracteres.
- Al terminar, la pantalla de éxito muestra la cuadrícula de ventanas completándose: cierra el círculo con la animación de login.
- Nada de tarjetas dobles compitiendo: una decisión, una vista.

### 6.3 Home / Inicio

**Hoy:** cabecera con fecha y nombre del hogar, saludo, frase del día, banner de notificaciones, barra de progreso, lista de mis tareas, botón para desplegar el calendario, modal de completar.

Demasiadas voces y el elemento más valioso escondido al final.

**Propuesta de estructura:**
1. **Encabezado**: Display con el saludo. Debajo, en `text-muted`, la fecha y el hogar en una línea. La frase del día se conserva —es personalidad— pero en `Body` a contraste válido, no en gris al 60%.
2. **Estado del hogar (lo nuevo y lo importante)**: la barra de carga justa del hogar, arriba, siempre visible. Responde de un vistazo la única pregunta que importa: *¿esto está parejo?*
3. **Lo mío**: mis pendientes como filas sobre repisa. La acción de completar es directa en la fila, con **actualización optimista y "Deshacer"** en toast. El modal deja de ser el camino por defecto.
4. **Esta semana**: la tira de semana en línea, sin toggle. Se elimina el botón "Ver Calendario de la Casa" — el calendario deja de estar escondido.
5. El banner de notificaciones baja a un aviso discreto de una línea, descartable, en `attention-weak`. Hoy tiene degradado y peso de tarjeta primaria, y es lo menos importante de la pantalla.

Desktop: dos columnas. Izquierda, mis pendientes. Derecha, estado del hogar y semana como panel persistente.

### 6.4 Tareas

**Hoy:** cabecera que muestra el rol del usuario, botón añadir, tarjeta con lista, sheet de creación con selector catálogo/personalizada, y edición inline con `range`.

**Propuesta:**
- Título en Fraunces: "Tareas". El rol deja de ser un dato de cabecera y pasa a ser un estado implícito: si eres roomie simplemente no ves acciones de edición. Hoy la UI te informa de tus permisos como si fuera un panel de administración.
- Lista como filas sobre repisa: nombre en Subhead, frecuencia y esfuerzo como metadatos a la derecha, acciones reveladas en hover (desktop) o por deslizamiento (móvil).
- **Unificar vocabulario a "esfuerzo" (1–5)**. Desaparecen *peso*, *dificultad* y *pts*.
- El `range` se reemplaza por un **selector segmentado de 5 pasos** con etiquetas en los extremos ("ligero" / "pesado"). Es más preciso, más accesible y más táctil.
- Catálogo vs. personalizada: se resuelve con un campo de búsqueda único con sugerencias. Si lo que escribes no existe, se ofrece crearlo. Se elimina la doble decisión previa que hoy exige elegir modo antes de escribir.
- **Eliminar `confirm()`**: diálogo destructivo propio, con el nombre de la tarea en el mensaje.

### 6.5 Reparto / Calendario — pantalla nueva y propia

Hoy es un componente escondido. Debe ser una pantalla de primer nivel, la segunda del rail.

- **Barra de carga justa** arriba, a ancho completo. Segmentos por persona.
- **Tira de semana** navegable.
- **"Generar reparto" con previsualización**: muestra el diff (quién pierde qué, quién gana qué) *antes* de confirmar, y deja una ventana de "Deshacer". Hoy es una acción masiva sin red de seguridad, y es la de mayor impacto en la app.
- Reasignar deja de ser un `<select>` mal etiquetado y pasa a ser un selector de persona con avatares y un título claro ("Reasignar a").
- Vacío: no un icono gris. La cuadrícula de ventanas vacía, con un único llamado: "Reparte las tareas de la semana."

### 6.6 Mi Casa

**Hoy:** cabecera, tarjeta de miembros, dos botones que despliegan secciones acordeón (Invitar / Info), formularios de edición inline. La información importante —el código de invitación— está a dos clics dentro de un acordeón.

**Propuesta:**
- **Invitar sube a primer plano.** Es la acción más valiosa de esta pantalla en las primeras semanas de vida de un hogar. Panel propio arriba: código en mono grande, botón de copiar, compartir nativo en móvil.
- Miembros como filas con avatar, nombre, rol en `text-muted`. Se retira la píldora ámbar de rol.
- La info del hogar (descripción, dirección) en repisa con edición en sitio, sin acordeón.
- Se eliminan los acordeones: en una pantalla con tres bloques, esconder dos es fricción sin beneficio.
- **Se reemplaza `window.location.reload()`** por refresco de datos: la app nunca debe parpadear en blanco por una acción del usuario.

### 6.7 Perfil y Reputación

**Hoy:** tarjeta de perfil centrada + `ReputationCard` con estrellas, porcentaje de "Efectividad" en verde esmeralda y dos métricas en cajas.

Problemas de concepto: las estrellas evocan calificación de servicio —Uber, Airbnb— y eso mete un marco de evaluación entre amigos que el producto no debería querer. El verde esmeralda es además un tercer verde ajeno a la paleta.

**Propuesta:**
- Reencuadrar de **"reputación" a "constancia"**. No es una nota, es un hábito.
- Se retiran las estrellas. En su lugar, la **cuadrícula de ventanas por semanas**: cada celda una semana, tono según cumplimiento. Se lee como un patrón de constancia y usa el motivo propietario.
- Copy: "Cumpliste 8 de 8 esta semana" en lugar de "Efectividad: 100%".
- Sin rankings entre roomies. Nunca. La comparación destruye el tono de la marca.
- Todos los verdes se unifican a `accent`.

### 6.8 Buscar / Listings

**Hoy:** un "próximamente" ocupando el 25% de la navegación primaria.

**Propuesta:** sacarlo del rail hasta que exista. Si se quiere mantener visible como señal de roadmap, va como entrada discreta en el pie del rail, con etiqueta "Pronto". Un ítem de navegación primaria que no lleva a ninguna parte enseña al usuario a ignorar la navegación.

### 6.9 Join (por link de invitación)

Pantalla que hoy pasa desapercibida y es el **primer contacto de todo usuario invitado** — probablemente la pantalla más importante para el crecimiento del producto.

**Propuesta:** tratamiento de bienvenida real. Nombre del hogar y quién invita, prominentes. Una sola acción: "Unirme". Si no hay sesión, autenticación y unión encadenadas sin perder el código. Es la pantalla que merece más cariño visual después del login.

### 6.10 Estados vacíos — sistema, no plantilla

Hoy hay cuatro vacíos con la misma forma. Cada uno debería tener su propia voz y una acción concreta.

| Pantalla | Motivo | Mensaje | Acción |
|---|---|---|---|
| Sin tareas | Cuadrícula vacía | "Aún no hay tareas en la casa." | Añadir la primera |
| Sin asignaciones | Tira de semana vacía | "La semana está sin repartir." | Generar reparto |
| Sin pendientes | Cuadrícula completa | "Estás al día." | *(ninguna — celebrar con silencio)* |
| Sin miembros | Silueta de casa | "Todavía vives solo aquí." | Compartir invitación |

---

## 7. Componentes a rediseñar

Ordenados por retorno sobre esfuerzo.

| # | Componente | Acción | Por qué |
|---|---|---|---|
| 1 | Botón | Reconstruir sobre `ui/button` con 4 variantes reales | Hoy hay ~20 botones ad hoc; unificarlos cambia toda la app de golpe |
| 2 | Input / Campo | Reconstruir con label, ayuda y error como una pieza | Hoy hay tres implementaciones distintas de input |
| 3 | Card → Panel + Repisa | Reemplazar | Es el cambio que crea la identidad |
| 4 | Chip / Badge | Dividir en cuatro tipos distintos | Resuelve el colapso de jerarquía (P4) |
| 5 | Modal / Sheet | Reconstruir con accesibilidad completa | Bloqueante de accesibilidad |
| 6 | Toast | **Crear** | Hoy no existe feedback (P5) |
| 7 | Diálogo de confirmación | **Crear** | Elimina `confirm()` nativo |
| 8 | Rail de navegación | **Crear** | No existe desktop (P7) |
| 9 | Barra inferior | Rediseñar y dejar de ocultar | Accesibilidad y previsibilidad |
| 10 | Barra de carga justa | **Crear** | Es la identidad del producto |
| 11 | Tira de semana | **Crear** | Reemplaza el calendario escondido |
| 12 | Cuadrícula de ventanas | **Crear** | Motivo gráfico propietario |
| 13 | Fila de lista | **Crear** | Reemplaza los grids de tarjetas repetidos |
| 14 | Skeletons | **Crear** | Cero cobertura hoy |
| 15 | Selector de esfuerzo | Reemplaza `range` | Precisión y accesibilidad |
| 16 | Selector de persona | Reemplaza `<select>` de reasignación | Corrige etiquetado y semántica |
| 17 | Avatar / grupo | Unificar | Cuatro variantes hoy |
| 18 | Estado vacío | Sistematizar en cuatro variantes | Personalidad |

---

## 8. Microinteracciones

### 8.1 Tokens de movimiento

| Token | Duración | Curva | Uso |
|---|---|---|---|
| `motion-fast` | 120ms | `ease-out` | Hover, cambios de color |
| `motion-base` | 180ms | `(0.2, 0.8, 0.2, 1)` | Aparición, despliegue |
| `motion-slow` | 260ms | `(0.2, 0.8, 0.2, 1)` | Sheets, modales |
| `motion-page` | 220ms | `ease-out` | Cambio de pantalla |

Nada por encima de 320ms. Nada con rebote. Nada con `spring` de baja amortiguación.

### 8.2 Por estado

**Hover** — 120ms, solo fondo y línea. Los paneles estáticos **no se levantan**: hoy `.premium-card` aplica `-translate-y-1` a superficies no clicables, lo que promete interacción inexistente. Solo se levantan (2px máximo) las tarjetas realmente clicables.

**Focus** — instantáneo, nunca animado. Anillo de 3px `focus-ring` + borde `accent`. Debe ser visible en todos los controles, incluidos los personalizados (hoy los inputs a mano usan `focus:outline-none` con anillo muy tenue).

**Press** — 100ms, `translateY(1px)` y oscurecimiento. Se retira `active:scale-95`: a 40px de alto, escalar al 95% se lee como juguete y contradice la calma de la marca.

**Aparición de elementos** — fade + 8px de subida, 180ms, escalonado de 30ms con un máximo de 4 elementos; a partir del quinto, entrada conjunta. Escalonar listas largas se siente lento, no elegante.

**Loading** — se retira todo texto tipo "Creando…" y todo spinner hecho a mano.
- Navegación: skeletons con la forma real del contenido, brillo de 1.2s en tono, nunca gris azulado.
- Acción en curso: el botón conserva su ancho, el label baja a 60% de opacidad y aparece un indicador de 16px. El ancho nunca cambia.
- Umbral: por debajo de 300ms no se muestra nada. Mostrar y quitar un loader en 100ms produce parpadeo.

**Éxito** — la fila pasa a estado completado en 180ms: check dibujado en 200ms, texto a `text-muted`. Toast con "Deshacer". **Nada de confeti.** La marca celebra en silencio.

**Error** — el borde del campo pasa a `danger` en 120ms y el mensaje entra con fade. **Sin sacudida.** El temblor comunica alarma; un formulario incompleto no es una alarma. Para errores de acción, toast con opción de reintentar.

**Confirmación destructiva** — el diálogo entra con fade + escala desde 98% en 180ms. El botón destructivo nunca es el foco inicial.

**Cambio de página** — el cromo (rail, topbar) **no se vuelve a montar ni se anima**. Solo el contenido hace crossfade en 220ms. Es lo que separa una app de un sitio web con páginas.

**Transición de login** — se conserva la existente. Ya cumple el ritmo del sistema.

### 8.3 Accesibilidad del movimiento

Con `prefers-reduced-motion`: todo desplazamiento y escala se elimina; solo quedan cambios de opacidad de 120ms. La transición de login ya lo respeta; el resto del sistema debe hacerlo también.

---

## 9. Recomendaciones de UX

### 9.1 Correcciones de comportamiento

1. **Nunca tragar un error.** Todo `catch` que hoy solo hace `console.error` debe producir un toast y revertir el estado optimista. Es el problema de UX más grave del producto: la app miente por omisión.
2. **Completar tarea con actualización optimista + Deshacer.** El caso común (marcar hecho) no debería costar un modal. La foto de evidencia pasa a ser un paso secundario opcional, no un peaje.
3. **Sustituir `confirm()`** por diálogo propio.
4. **Sustituir `window.location.reload()`** por refresco de datos.
5. **Añadir estados de carga por ruta.** Hoy la navegación entre pantallas no comunica nada mientras el servidor responde.
6. **"Generar reparto" necesita previsualización y deshacer.** Es la acción de mayor consecuencia y hoy la de menor protección.
7. **La navegación no se esconde.** Retirar el ocultamiento por scroll del bottom bar.
8. **Una sola fuente de verdad para la navegación.** Hoy `navItems` vive duplicado en dos archivos.

### 9.2 Correcciones de accesibilidad

1. Subir `text-muted` a un valor que pase 4.5:1 y **eliminar los modificadores de opacidad sobre texto** (`/60`, `/80`). Si un texto necesita menos énfasis, se usa un token, no transparencia.
2. Suelo tipográfico de 12px. Eliminar `text-[9px]` y `text-[10px]`.
3. Accesibilidad completa en modales: rol, etiqueta, focus trap, Escape, retorno de foco.
4. Etiquetas accesibles en todos los botones de solo icono, empezando por el `✕` de cierre.
5. Iconos decorativos ocultos a lectores de pantalla.
6. Skip link y `aria-label` en cada landmark de navegación.
7. Corregir el selector de reasignación: el valor actual debe leerse como estado, no como acción.
8. Objetivos táctiles de 44px mínimo. Varios botones de acción en filas quedan hoy por debajo.

> Nota: una validación completa de WCAG requiere pruebas manuales con tecnologías asistivas y revisión de un especialista en accesibilidad. Lo anterior son hallazgos verificables por inspección, no un certificado de conformidad.

### 9.3 Correcciones de contenido

1. **Un solo término para el esfuerzo.** Hoy: peso / dificultad / pts / estrella.
2. **Bajar la gamificación.** "Efectividad", "pts" y las estrellas de reputación introducen evaluación entre amigos.
3. **Sin mayúsculas en labels.** Es la marca más visible de "interfaz genérica" en toda la app.
4. **Títulos de pantalla concretos.** "Gestor de Tareas" → "Tareas". "Buscar Roomie" → "Buscar".
5. Los mensajes de error dicen qué hacer, no solo qué falló.

### 9.4 Deuda a resolver antes de escalar

1. **Tokenizar todos los hex.** Es requisito previo a cualquier rediseño y al modo oscuro.
2. **Decidir el modo oscuro:** completarlo con toggle o retirar los tokens `.dark`. Un tema definido pero inalcanzable es deuda silenciosa.
3. **Unificar la carga de fuentes.** Hoy se cargan dos veces, y con `@import` en CSS, que es la vía más lenta.
4. **Un solo set de iconos.**
5. **Consolidar los dos onboardings.**

---

## 10. Prioridad de implementación

### 🔴 Alto impacto

Cambian la percepción del producto o corrigen fallos reales.

| | Mejora | Por qué |
|---|---|---|
| 1 | Unificar paleta al verde y retirar el ámbar | La app tiene dos marcas a la vez |
| 2 | Tokenizar todo el color hardcodeado | Habilita todo lo demás |
| 3 | Nueva escala tipográfica: cuerpo 15/400, prohibir `font-black` | Mayor salto de calidad percibida por unidad de esfuerzo |
| 4 | Corregir contraste y retirar opacidades sobre texto | Accesibilidad, texto ilegible hoy |
| 5 | Consolidar radios con la regla control/contenedor | Elimina el aspecto blando y genérico |
| 6 | Sistema de toasts y no tragar errores | La app oculta fallos al usuario |
| 7 | Accesibilidad de modales | Bloqueante |
| 8 | Usar de verdad los primitivos: botón e input únicos | Mata las 20 variantes ad hoc |
| 9 | Layout desktop: rail + ancho real | El escritorio hoy no está diseñado |
| 10 | Promover el reparto justo a pantalla propia con barra de carga | Es la propuesta de valor, hoy escondida |
| 11 | Skeletons y estados de carga por ruta | Cero cobertura |
| 12 | Retirar `confirm()` y `window.location.reload()` | Rompen la ilusión de producto |
| 13 | Introducir Fraunces para display | Es la firma de la identidad |

### 🟡 Impacto medio

Consolidan el sistema.

| | Mejora |
|---|---|
| 14 | Escalera de elevación y retirar sombras invisibles |
| 15 | Reducir bordes a tres opciones |
| 16 | Unificar iconografía en Lucide y retirar Material Symbols |
| 17 | Diferenciar los cuatro tipos de chip |
| 18 | Panel y Repisa reemplazando el grid de tarjetas |
| 19 | Sistematizar los cuatro estados vacíos |
| 20 | Consolidar los dos onboardings en uno |
| 21 | Fuente única de verdad para la navegación |
| 22 | Completar tarea optimista con Deshacer |
| 23 | Previsualización y deshacer en "Generar reparto" |
| 24 | Unificar vocabulario a "esfuerzo" y bajar gamificación |
| 25 | Tira de semana y rediseño de calendario |
| 26 | Limpiar la carga de fuentes |
| 27 | Rediseñar Join como pantalla de bienvenida |
| 28 | Selector de esfuerzo y selector de persona |
| 29 | Bottom bar siempre visible |

### 🟢 Bajo impacto

Refinamiento, después de lo anterior.

| | Mejora |
|---|---|
| 30 | Completar o retirar el modo oscuro |
| 31 | Set de ilustraciones de marca sobre la cuadrícula de ventanas |
| 32 | Pulido fino de microinteracciones |
| 33 | Iconos de app, favicon y splash PWA con el logo nuevo |
| 34 | Reencuadrar reputación como constancia |
| 35 | Pasada completa de microcopy y voz |
| 36 | Diseño del marketplace cuando entre en roadmap |
| 37 | Atajos de teclado en desktop |
| 38 | Retirar el tag "MVP" del área de marca |

---

## Resumen ejecutivo

La UI de Kimito se ve genérica por tres razones concretas, no por falta de gusto:

1. **Hay un sistema de diseño que nadie usa.** Los tokens y primitivos existen; las pantallas los sobreescriben uno por uno. Sin capa de decisión, el resultado por defecto es el look de Tailwind.
2. **La tipografía no jerarquiza.** Todo pesa 700–900 y el cuerpo está a 12px. Sin contraste de peso ni escala legible, ninguna pantalla tiene foco.
3. **No hay ningún gesto propietario.** Cards redondeadas + píldoras tintadas + iconos Material es exactamente el promedio de la industria.

La propuesta responde a las tres: **una sola paleta** (verde botánico sobre papel cálido), **una jerarquía tipográfica real** con serif de display como firma, y **dos dispositivos propios** —la Repisa y la Cuadrícula de Ventanas— derivados del propio logo.

El mayor cambio conceptual no es visual sino de producto: **el reparto justo debe ser la pantalla principal, no un acordeón al final del home.** Es lo único que Kimito hace y una lista de tareas no. La identidad visual debe existir para servir a esa idea.
