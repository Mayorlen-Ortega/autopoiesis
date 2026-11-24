# AUTOPOIESIS — Obra Audiovisual Generativa (60.0s)

> **Concurso:** *Chile Re-Descubre: La tecnocreatividad revive nuestra ciencia* (Edición 2026)  
> **Organizan:** ACHIPEC (Asociación Chilena de Periodistas y Profesionales de la Comunicación de la Ciencia), CRTIC (Centro de Revolución Tecnológica para las Industrias Creativas) y Congreso Futuro (apoya *Innovación El Mercurio*).  
> **Caso Seleccionado:** *Definición de vida, autopoiesis* — Humberto Maturana & Francisco Varela (1972).

---

## 1. Resumen Ejecutivo y Memoria Conceptual

**AUTOPOIESIS** es una experiencia audiovisual inmersiva generativa en tiempo real que traduce a código ejecutable y arte computacional la teoría con la que **Humberto Maturana y Francisco Varela** redefinieron la biología universal: **un ser vivo es una red que se produce y mantiene continuamente a sí misma dentro de su propia frontera**.

La obra demuestra visual, física y sonoramente que la autopoiesis rige todas las escalas de la vida, evolucionando en **4 actos deterministas** de **exactamente 60.0 segundos**:
1. **Acto I (00:00 – 00:15) — Caos y Autogénesis:** Dispersión entrópica inicial de moléculas que, guiadas por voluntad sistémica, se autoensamblan en un vórtice armónico concentrado.
2. **Acto II (00:15 – 00:36) — Autoproducción y Frontera:** La red sintetiza su propia membrana elástica semipermeable (*autodelimitación*). A los 0:26 florece en el **Reino Vegetal (Planta/Hoja)**, canalizando la luz y definiendo nervaduras y contornos fotosintéticos.
3. **Acto III (00:36 – 00:46) — Acoplamiento Estructural y Reino Animal (Pez):** Las perturbaciones del entorno impactan la membrana, la cual se deforma y absorbe energía sin romperse, reorganizando el interior. Emerge un **Pez nadador** con locomoción ondulatoria en tiempo real, espina vertebral y ojo bioluminiscente, operando en estricta *clausura operacional*.
4. **Acto IV (00:46 – 01:00) — Identidad Viva y Reino Artrópodo (Escarabajo):** Máxima especialización morfológica. Un **Escarabajo sagrado** con antenas táctiles, escudo torácico, élitros articulados y 6 patas protegidas en su exoesqueleto. A los 0:56.5 inicia el oscurecimiento maestro determinista hacia el reposo y detención absoluta al minuto exacto.

---

## 2. Alineación con las Bases y Criterios del Concurso

| Criterio de Evaluación | Ponderación | Implementación en la Obra |
| :--- | :---: | :--- |
| **Calidad Artística y Conceptual** | **40%** | Estética *dark bioluminiscente* (`#05030a`, cian `#22d3ee`, violeta `#8b5cf6`, esmeralda `#10b981`, magenta `#d946ef`). La frontera celular funciona como un envolvente vivo detrás de las estructuras anatómicas. Cada sonido y línea responde con rigor a las definiciones de Maturana y Varela. |
| **Innovación Tecnocreativa** | **30%** | Cero librerías pesadas o pregrabados: síntesis procedural en tiempo real mediante **HTML5 Canvas 2D** y **Web Audio API**. Espacialización binaural **8D con algoritmos HRTF en 360°**, donde las perturbaciones visuales orbitan y colisionan en correspondencia trigonométrica exacta 1:1 con las fuentes sonoras. |
| **Pertinencia Temática** | **30%** | La dinámica visual de la membrana y los nodos no es una animación estática, sino una **simulación física de resortes acoplados**. El impacto de las perturbaciones externas gatilla síntesis de nuevos componentes moleculares y reorganizaciones armónicas internas (*acoplamiento estructural*). |

---

## 3. Especificaciones Técnicas

* **Plataforma:** Aplicación web nativa autosuficiente (navegadores modernos: Chrome, Edge, Firefox, Safari).
* **Stack Tecnológico:**
  * JavaScript Moderno (ES6+ Modular).
  * HTML5 Canvas con escalado automático para pantallas Retina / High-DPI.
  * Web Audio API nativa (Osciladores polifónicos, filtros resonantes biquad, busses de ganancia con envolventes exponenciales y PannerNodes HRTF).
* **Duración:** **60.0 segundos exactos**, sincronizados y gobernados estrictamente por el reloj de hardware `AudioContext.currentTime` (sin `setTimeout`/`setInterval`).
* **Higiene Acústica:** 100% libre de clics digitales. Todas las transiciones de frecuencia y volumen emplean rampas lineales y exponenciales seguras.
* **Modo Grabación (OBS / Pantalla Limpia):** Al presionar la tecla **`H`** (o el botón en la cabecera), la interfaz HUD desaparece completamente para permitir captura de video en 1080p/4K a 60 FPS sin marcas ni controles superpuestos.

---

## 4. Estructura del Proyecto

```
autopoiesis/
├── index.html                   # Entry point, Canvas y HUD responsivo
├── css/
│   └── styles.css               # Paleta dark bioluminiscente y glassmorphism
├── js/
│   ├── main.js                  # Orquestador del ciclo de vida y render loop (60 FPS)
│   ├── audio/
│   │   ├── AudioEngine.js       # Master AudioContext, busses, analizadores FFT y fade maestro
│   │   ├── SystemSound.js       # Latido cardíaco, pads Fmaj7add9/Am9 y melodías de organización
│   │   └── EnvironmentSound.js  # Emisores 8D con audio espacial HRTF y ondas de barrido
│   ├── visuals/
│   │   ├── CanvasRenderer.js    # Motor gráfico 2D, estelas bioluminiscentes y fade a negro
│   │   ├── SystemMembrane.js    # Física elástica de membrana y metamorfosis viva (Hoja, Pez, Escarabajo)
│   │   └── PerturbationField.js # Partículas externas acopladas a coordenadas 8D y colisiones
│   └── timeline/
│       └── TimelineManager.js   # Gestión determinista de los 4 actos, reloj y subtítulos
└── README.md                    # Documentación oficial y memoria del proyecto
```

---

## 5. Instrucciones de Ejecución Local

Para levantar la obra en un entorno local y reproducirla en el navegador:

1. **Abrir un servidor estático local** (desde la raíz del proyecto):
   ```bash
   # Opción con Python:
   python -m http.server 8000
   
   # O con Node.js / npx:
   npx serve .
   ```
2. **Acceder en el navegador:**
   Ingresar a `http://localhost:8000`.
3. **Experiencia Sonora Inmersiva:**
   Conectar **audífonos estéreo** (imprescindible para percibir el algoritmo binaural HRTF en 360°).
4. **Comenzar:**
   Hacer clic en **"Iniciar Experiencia"**. Presionar **`H`** en cualquier momento si se desea ocultar la interfaz para capturar pantalla completa.

---

## 6. Créditos y Reconocimientos

* **Concepto Científico Original:** Humberto Maturana Romesín & Francisco Varela García (*"De Máquinas y Seres Vivos: Autopoiesis, la organización de lo vivo"*, 1972).
* **Desarrollo Tecnocreativo:** Obra postulante al concurso *Chile Re-Descubre* (2026).
* **Inspiración Institucional:** CRTIC, ACHIPEC y Congreso Futuro.
