---
name: audiovisual-engine
description: "Implementa motores de audio espacial binaural (8D) con Web Audio API, PannerNode HRTF y visualización reactiva sincronizada por AudioContext.currentTime."
---
Actúa como un arquitecto de software creativo experto en Web Audio API (audio espacial binaural HRTF), síntesis generativa y visualización reactiva en HTML5 Canvas / WebGL.

Construye una aplicación web autocontenida (HTML5, CSS3 y JavaScript moderno ES6+ modular, sin frameworks pesados ni dependencias externas que puedan fallar) que ejecute una obra audiovisual generativa de **exactamente 60 segundos** sobre la **Autopoiesis** (Humberto Maturana y Francisco Varela, 1972).

### 1. Arquitectura de Audio Espacial (Web Audio API + HRTF)
Implementa un motor de audio puramente sintetizado en tiempo real utilizando `AudioContext` y `PannerNode` configurado con `panningModel: 'HRTF'` y `distanceModel: 'inverse'` para lograr un efecto 8D binaural auténtico en audífonos.
Divide la mezcla en dos planos espaciales que representen la **clausura operacional**:
- **Plano Interior (El Sistema / Identidad):** Anclado en el centro `(x: 0, y: 0, z: -0.5)`, sin rotación espacial. Compuesto por un pulso sub-grave cálido (onda sinusoidal modulada como un latido orgánico) y un pad armónico etéreo (acordes suspendidos tipo Fmaj7(add9) / Am9 con filtro paso bajo resonante).
- **Plano Exterior (El Entorno / Perturbaciones):** Fuentes sonoras independientes posicionadas mediante `PannerNode (HRTF)` que orbitan en 360° alrededor de la cabeza del oyente (`x = r * cos(θ)`, `y = elevación`, `z = r * sin(θ)`). Compuesto por texturas granulares de alta frecuencia, impulsos cristalinos y barridos filtrados.
- **Retroalimentación (Acoplamiento Estructural):** Conecta un `AnalyserNode` (FFT) tanto al bus del Entorno como al bus del Sistema para extraer en tiempo real los niveles de energía (`getByteFrequencyData`) que gobernarán los visuales.

### 2. Arquitectura Visual (Estética Dark Bioluminiscente + Canvas 2D/WebGL)
- **Paleta cromática:** Fondo negro profundo (`#05030a`), partículas y nodos del sistema en violeta eléctrico (`#8b5cf6`), magenta (`#d946ef`) y cian luminoso (`#22d3ee`) para las perturbaciones externas.
- **Geometría autopoiética:**
  - Un conjunto de nodos internos que se mueven y establecen enlaces dinámicos entre sí (autoproducción de componentes).
  - Una **membrana celular dinámica** (polígono cerrado suavizado con curvas Bézier o spline) que envuelve a los nodos internos, separando el adentro del afuera (autodelimitación).
  - Partículas externas cuyas coordenadas `(x, y)` en pantalla están matemáticamente sincronizadas con las coordenadas `(x, z)` de los `PannerNode` 8D del audio. Cuando una partícula externa choca con la membrana, la membrana se deforma físicamente en el punto de impacto, absorbe la energía y genera nuevos enlaces internos sin romperse.

### 3. Línea de Tiempo Determinista (Exactamente 60.0 segundos)
Implementa un reloj maestro preciso (`AudioContext.currentTime`) con una barra de progreso minimalista en la parte inferior y un temporizador `00:00 / 01:00` que se detenga limpiamente al llegar a `60.0s` (con un fade-out maestro entre el segundo `57.0` y `60.0`). Estructura la evolución en 4 actos:
- **Acto I (0:00 – 0:15) — Caos y Origen:** Partículas dispersas sin membrana. Audio espacial 8D errático girando alrededor de la cabeza; el pulso central apenas comienza a emerger. Texto sutil en pantalla (fade in/out): *"Todo ser vivo es una red que se fabrica a sí misma."*
- **Acto II (0:15 – 0:30) — Autoproducción y Frontera:** Los nodos internos se conectan y tejen la membrana translúcida. El pulso grave se estabiliza en el centro mientras las texturas 8D quedan confinadas por fuera de la frontera acústica. Texto: *"Traza su propia frontera para distinguir el adentro del afuera."*
- **Acto III (0:30 – 0:48) — Acoplamiento Estructural:** Intensificación de impactos externos desde distintos ángulos 3D (arriba, atrás, lados). Cada impacto 8D deforma la membrana visual y gatilla una respuesta armónica nueva en el interior (el sistema transforma la perturbación en reorganización). Texto: *"El entorno perturba, pero no determina: el sistema se reorganiza sin perder su identidad."*
- **Acto IV (0:48 – 0:60) — Identidad Viva:** Equilibrio luminoso y armónico. La membrana pulsa en coherencia perfecta. Fade out audiovisual progresivo hacia negro entre 0:57 y 1:00. Texto final centrado: *"AUTOPOIESIS — Humberto Maturana & Francisco Varela (1972)"*.

### 4. Interfaz y Controles para Grabación de Video
- Pantalla inicial oscura con un único botón elegante: **"Iniciar Experiencia (Usar Audífonos)"** (necesario para desbloquear `AudioContext` en el navegador).
- Un botón discreto en la esquina superior derecha para **"Ocultar UI (Modo Grabación)"** que esconda botones y temporizador al presionar `H`, facilitando la captura limpia de pantalla en 1080p/60fps con OBS Studio.
- Código limpio, bien comentado en español, sin errores de consola y listo para abrir directamente en el navegador mediante Live Server.