/**
 * ============================================================================
 * AUTOPOIESIS — Membrana Celular y Nodos Internos (SystemMembrane.js)
 * Modelo físico-visual de Autoproducción (nodos) y Autodelimitación (membrana).
 * Curva cerrada suavizada (Spline) con dinámica elástica de resortes amortiguados.
 * Absorbe perturbaciones sin romperse y genera nuevos enlaces moleculares.
 * Metamorfosis viva: Célula Primordial -> Hoja/Planta -> Pez -> Escarabajo.
 * ============================================================================
 */

export class SystemMembrane {
  constructor() {
    this.cx = 0;
    this.cy = 0;
    this.baseRadius = 140;

    // Nodos internos (32 componentes anatómicos y autoproducidos)
    this.nodeCount = 32;
    this.nodes = [];

    // Puntos de control de la membrana (Perímetro elástico cerrado de 32 vértices)
    this.pointCount = 32;
    this.points = [];

    // Estado del sistema
    this.opacity = 0; // Se teje en Acto II
    this.coherence = 0; // Armonía en Acto IV
    this.systemEnergy = 0; // Reactividad Web Audio

    // Chispas y enlaces bioluminiscentes generados por reorganización
    this.transientLinks = [];

    // Autogestación y Voluntad (Acto I: "... una red que se fabrica a sí misma")
    this.selfAssemblyTriggered = false;
    this.assemblyWave = { active: false, radius: 10, maxRadius: 200, alpha: 0 };
    this.onSelfAssembly = null;

    // Autoproducción Continua y Crecimiento Morfogénico
    this.maxNodes = 36;
    this.lastSpawnTime = 15.0;
    this.lastElapsedTime = 0;

    this._initNodes();
    this._initMembranePoints();
  }

  /**
   * Factor de crecimiento progresivo del organismo a lo largo de los 60 segundos.
   * Representa la autopoiesis: la red crece y se diferencia manteniendo su identidad.
   */
  getGrowthFactor(t) {
    if (t < 7.0) return 0.55;
    if (t < 15.0) {
      // Acto I (7s - 15s): De la autogénesis al cierre del caos (0.55 -> 0.75)
      return 0.55 + ((t - 7.0) / 8.0) * 0.20;
    }
    if (t < 30.0) {
      // Acto II (15s - 30s): Autoproducción y Frontera (0.75 -> 0.98)
      return 0.75 + ((t - 15.0) / 15.0) * 0.23;
    }
    if (t < 48.0) {
      // Acto III (30s - 48s): Acoplamiento Estructural (crece absorbiendo perturbaciones: 0.98 -> 1.22)
      return 0.98 + ((t - 30.0) / 18.0) * 0.24;
    }
    // Acto IV (48s - 60s): Plenitud viva y madura (1.22 -> 1.28)
    return Math.min(1.28, 1.22 + ((t - 48.0) / 12.0) * 0.06);
  }

  /**
   * Autoproducción de componentes moleculares:
   * Sintetiza un nuevo nodo interno que emerge del sistema y se enlaza a la red.
   */
  spawnNewComponent(originX = 0, originY = 0) {
    if (this.nodes.length >= this.maxNodes) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 1.2;
    const maxRadius = 3.2 + Math.random() * 2.8;

    const newNode = {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetX: 0,
      targetY: 0,
      radius: 0.6,
      maxRadius,
      birthProgress: 0,
      energy: 1.8,
      pulseOffset: Math.random() * Math.PI * 2,
      willFactor: 1.0,
      isNew: true
    };
    this.nodes.push(newNode);

    // Enlace instantáneo de síntesis autopoiética con el nodo más cercano
    if (this.nodes.length > 1) {
      let closestIdx = 0;
      let closestDist = Infinity;
      for (let i = 0; i < this.nodes.length - 1; i++) {
        const d = Math.hypot(this.nodes[i].x - originX, this.nodes[i].y - originY);
        if (d < closestDist) {
          closestDist = d;
          closestIdx = i;
        }
      }
      this.transientLinks.push({
        a: this.nodes.length - 1,
        b: closestIdx,
        life: 1.5,
        intensity: 1.0
      });
    }
  }

  /**
   * Estado y mezcla continua de las metamorfosis morfológicas:
   * Demuestra visualmente que la autopoiesis aplica a todos los tipos de organismos:
   * Célula Primordial -> Hoja/Planta -> Pez acuático -> Escarabajo/Artrópodo
   */
  getMorphState(t) {
    if (t < 25.0) {
      return { from: 'CELL', to: 'CELL', blend: 0 };
    } else if (t < 27.5) {
      // Metamorfosis Célula -> Planta (25.0s a 27.5s)
      const blend = (t - 25.0) / 2.5;
      return { from: 'CELL', to: 'PLANT', blend };
    } else if (t < 36.0) {
      return { from: 'PLANT', to: 'PLANT', blend: 0 };
    } else if (t < 38.5) {
      // Metamorfosis Planta -> Pez (36.0s a 38.5s)
      const blend = (t - 36.0) / 2.5;
      return { from: 'PLANT', to: 'FISH', blend };
    } else if (t < 46.5) {
      return { from: 'FISH', to: 'FISH', blend: 0 };
    } else if (t < 49.0) {
      // Metamorfosis Pez -> Escarabajo (46.5s a 49.0s)
      const blend = (t - 46.5) / 2.5;
      return { from: 'FISH', to: 'BEETLE', blend };
    } else {
      return { from: 'BEETLE', to: 'BEETLE', blend: 0 };
    }
  }

  /**
   * Generador de coordenadas anatómicas nítidas e icónicas para cada organismo.
   * Totalmente determinista, gobernado por R y t.
   */
  getArchetypeCoord(archetype, i, count, R, t) {
    let x = 0;
    let y = 0;

    if (archetype === 'CELL') {
      // Célula Primordial: distribución concéntrica áurea
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const r = Math.sqrt((i + 0.5) / count) * (R * 0.72);
      const theta = i * goldenAngle;
      x = Math.cos(theta) * r;
      y = Math.sin(theta) * r;
    } else if (archetype === 'PLANT') {
      // HOJA BOTÁNICA: Tallo central, 6 pares de nervaduras a 45° y contorno foliar
      if (i <= 6) {
        // Tallo central / Nervadura principal (ápice -0.88R hasta peciolo +0.82R)
        x = 0;
        y = -R * 0.88 + (i / 6) * (R * 1.70);
      } else if (i <= 18) {
        // 6 pares de nervaduras laterales oblicuas (nodos 7 a 18)
        const p = Math.floor((i - 7) / 2);
        const side = (i % 2 === 0 ? 1 : -1);
        const yStem = [-0.60, -0.35, -0.10, +0.15, +0.40, +0.62];
        const spanX = [0.26, 0.44, 0.54, 0.50, 0.38, 0.22];
        const spanY = [-0.14, -0.12, -0.09, -0.06, -0.04, -0.02];
        x = side * R * spanX[p];
        y = R * (yStem[p] + spanY[p]);
      } else if (i <= 30) {
        // Contorno foliar anatómico (12 nodos perimetrales alternados izq/der)
        const p = Math.floor((i - 19) / 2);
        const side = (i % 2 === 0 ? 1 : -1);
        const yMargin = [-0.68, -0.42, -0.15, +0.15, +0.44, +0.68];
        const xMargin = [0.26, 0.48, 0.58, 0.54, 0.40, 0.22];
        x = side * R * xMargin[p];
        y = R * yMargin[p];
      } else {
        // Nodo 31: Núcleo metabólico cloroplástico central
        x = 0;
        y = -R * 0.05;
      }
      // Respiración botánica suave
      const leafSway = Math.sin(t * 1.8 + y * 0.01) * (R * 0.02);
      x += leafSway;
    } else if (archetype === 'FISH') {
      // PEZ NADADOR: Hocico agudo (x>0), Ojo bioluminiscente, Espina dorsal, Aletas y Cola caudal en V
      if (i === 0) {
        // Hocico / Rostro anterior
        x = +R * 1.05;
        y = 0;
      } else if (i === 1) {
        // Ojo bioluminiscente icónico
        x = +R * 0.72;
        y = -R * 0.20;
      } else if (i <= 8) {
        // Espina vertebral horizontal continua (nodos 2 a 8, de +0.68R a -0.74R)
        const u = (i - 2) / 6;
        x = +R * 0.68 - u * (R * 1.42);
        y = 0;
      } else if (i <= 12) {
        // Aleta dorsal arqueada superior (nodos 9 a 12)
        const u = (i - 9) / 3;
        x = +R * 0.12 - u * (R * 0.56);
        y = -R * (0.42 + 0.14 * Math.sin(u * Math.PI));
      } else if (i <= 16) {
        // Aletas pectorales y anales inferiores (nodos 13 a 16)
        const u = (i - 13) / 3;
        x = +R * 0.32 - u * (R * 0.64);
        y = +R * (0.36 + 0.12 * Math.sin(u * Math.PI));
      } else if (i <= 23) {
        // Cola caudal bífida en V (nodos 17 a 23)
        const tailMap = [
          { x: -R * 0.94, y: -R * 0.28 }, // 17: rayo sup base
          { x: -R * 1.12, y: -R * 0.50 }, // 18: rayo sup medio
          { x: -R * 1.30, y: -R * 0.72 }, // 19: PUNTA LÓBULO SUPERIOR
          { x: -R * 0.94, y: +R * 0.28 }, // 20: rayo inf base
          { x: -R * 1.12, y: +R * 0.50 }, // 21: rayo inf medio
          { x: -R * 1.30, y: +R * 0.72 }, // 22: PUNTA LÓBULO INFERIOR
          { x: -R * 0.98, y: 0 }           // 23: Muesca bífida central
        ];
        const pt = tailMap[i - 17];
        x = pt.x;
        y = pt.y;
      } else if (i <= 27) {
        // Flanco dorsal / Lomo superior (nodos 24 a 27)
        const u = (i - 24) / 3;
        x = +R * 0.62 - u * (R * 1.16);
        y = -R * (0.34 * Math.sin((u * 0.8 + 0.15) * Math.PI));
      } else {
        // Flanco ventral / Vientre inferior (nodos 28 a 31)
        const u = (i - 28) / 3;
        x = +R * 0.62 - u * (R * 1.16);
        y = +R * (0.36 * Math.sin((u * 0.8 + 0.15) * Math.PI));
      }

      // Ondulación biológica de natación en tiempo real:
      // La cabeza (x > 0) se mantiene orientada; la cola (x < 0) ondea con fuerza armónica
      const waveAmp = Math.max(0, -x / R);
      const swimAngle = t * 4.8 - (x / R) * 2.8;
      y += Math.sin(swimAngle) * (R * 0.12 * (0.15 + waveAmp * 0.95));
    } else if (archetype === 'BEETLE') {
      // ESCARABAJO SAGRADO: Antenas curvadas, Cabeza, Pronoto, Sutura élitros y 6 Patas articuladas
      // Proporciones orgánicas compactas para que el exoesqueleto y las extremidades
      // queden 100% contenidas armónicamente dentro de la membrana.
      if (i === 0) {
        // Antena izquierda: punta sensorial
        x = -R * 0.34; y = -R * 0.84;
      } else if (i === 1) {
        // Antena izquierda: articulación base
        x = -R * 0.18; y = -R * 0.68;
      } else if (i === 2) {
        // Antena derecha: punta sensorial
        x = +R * 0.34; y = -R * 0.84;
      } else if (i === 3) {
        // Antena derecha: articulación base
        x = +R * 0.18; y = -R * 0.68;
      } else if (i === 4) {
        // Cabeza central
        x = 0; y = -R * 0.62;
      } else if (i === 5) {
        // Pronoto / Escudo torácico hombro izquierdo
        x = -R * 0.48; y = -R * 0.42;
      } else if (i === 6) {
        // Pronoto izquierdo centro
        x = -R * 0.20; y = -R * 0.42;
      } else if (i === 7) {
        // Pronoto derecho centro
        x = +R * 0.20; y = -R * 0.42;
      } else if (i === 8) {
        // Pronoto / Escudo torácico hombro derecho
        x = +R * 0.48; y = -R * 0.42;
      } else if (i <= 12) {
        // Sutura longitudinal dorsal (la línea icónica central que separa los élitros)
        const u = (i - 9) / 3;
        x = 0;
        y = -R * 0.24 + u * (R * 0.88);
      } else if (i <= 15) {
        // Caparazón / Élitro izquierdo curvo (nodos 13, 14, 15)
        const u = (i - 13) / 2;
        x = -R * (0.58 + 0.04 * Math.sin(u * Math.PI));
        y = -R * 0.16 + u * (R * 0.62);
      } else if (i <= 18) {
        // Caparazón / Élitro derecho curvo (nodos 16, 17, 18)
        const u = (i - 16) / 2;
        x = +R * (0.58 + 0.04 * Math.sin(u * Math.PI));
        y = -R * 0.16 + u * (R * 0.62);
      }
      // LAS 6 PATAS ARTICULADAS (articuladas naturalmente hacia afuera dentro del margen):
      else if (i === 19) { x = -R * 0.72; y = -R * 0.40; } // Pata delantera izq: tarso
      else if (i === 20) { x = -R * 0.50; y = -R * 0.42; } // Pata delantera izq: fémur
      else if (i === 21) { x = +R * 0.50; y = -R * 0.42; } // Pata delantera der: fémur
      else if (i === 22) { x = +R * 0.72; y = -R * 0.40; } // Pata delantera der: tarso
      else if (i === 23) { x = -R * 0.78; y = +R * 0.06; } // Pata media izq: tarso
      else if (i === 24) { x = -R * 0.56; y = +R * 0.06; } // Pata media izq: fémur
      else if (i === 25) { x = +R * 0.56; y = +R * 0.06; } // Pata media der: fémur
      else if (i === 26) { x = +R * 0.78; y = +R * 0.06; } // Pata media der: tarso
      else if (i === 27) { x = -R * 0.68; y = +R * 0.52; } // Pata trasera izq: tarso
      else if (i === 28) { x = -R * 0.52; y = +R * 0.50; } // Pata trasera izq: fémur
      else if (i === 29) { x = +R * 0.52; y = +R * 0.50; } // Pata trasera der: fémur
      else if (i === 30) { x = +R * 0.68; y = +R * 0.52; } // Pata trasera der: tarso
      else {
        // Nodo 31: Ápice posterior del abdomen
        x = 0; y = +R * 0.72;
      }

      // Micro-movimiento vivo de insecto (antenas que tantean el aire, patas con micromovimiento)
      if (i === 0 || i === 2) {
        x += Math.sin(t * 7.5 + i) * (R * 0.025);
        y += Math.cos(t * 7.5 + i) * (R * 0.015);
      }
      if (i === 19 || i === 22 || i === 23 || i === 26 || i === 27 || i === 30) {
        x += Math.sin(t * 5.0 + i) * (R * 0.015);
      }
    }

    return { x, y };
  }

  /**
   * Enlaces esqueléticos anatómicos organizados por jerarquía:
   * primary: eje o soporte central (tallo, espina, sutura, patas principales)
   * secondary: nervaduras laterales, radios de aletas, costillas
   * perimeter: silueta contorno externa
   */
  getStructuralLinks(archetype) {
    if (archetype === 'PLANT') {
      return {
        primary: [
          // Tallo central continuo (ápice a peciolo)
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
        ],
        secondary: [
          // 6 pares de nervaduras laterales oblicuas que brotan del tallo
          [1, 7], [1, 8],
          [2, 9], [2, 10],
          [3, 11], [3, 12],
          [4, 13], [4, 14],
          [5, 15], [5, 16],
          [6, 17], [6, 18],
          // Conexión del núcleo fotosintético
          [3, 31], [4, 31]
        ],
        perimeter: [
          // Silueta foliar exterior izquierda
          [0, 19], [19, 7], [7, 21], [21, 9], [9, 23], [23, 11], [11, 25], [25, 13], [13, 27], [27, 15], [15, 29], [29, 6],
          // Silueta foliar exterior derecha
          [0, 20], [20, 8], [8, 22], [22, 10], [10, 24], [24, 12], [12, 26], [26, 14], [14, 28], [28, 16], [16, 30], [30, 6]
        ]
      };
    } else if (archetype === 'FISH') {
      return {
        primary: [
          // Espina vertebral horizontal continua
          [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
          // Mandíbula y arco cefálico
          [0, 25], [2, 24], [24, 25],
          // Cola caudal bífida en V
          [8, 17], [17, 18], [18, 19], // Lóbulo superior hacia la punta
          [8, 20], [20, 21], [21, 22], // Lóbulo inferior hacia la punta
          [8, 23],                      // Eje central de la cola
          [19, 23], [22, 23]           // Borde posterior de la muesca en V
        ],
        secondary: [
          // Aleta dorsal arqueada
          [4, 9], [9, 10], [10, 11], [11, 12], [12, 6], [5, 10], [6, 11],
          // Aletas pectorales y anales inferiores
          [3, 13], [13, 14], [14, 4], [5, 15], [15, 16], [16, 7],
          // Costillas biológicas limpias (espinas que nacen de las vértebras hacia los flancos)
          [3, 26], [3, 28],
          [4, 26], [4, 28],
          [5, 27], [5, 29],
          [6, 27], [6, 29],
          // Radios intermedios del abanico caudal
          [18, 23], [21, 23]
        ],
        perimeter: [
          // Contorno dorsal superior
          [24, 26], [26, 27], [27, 8],
          // Contorno ventral inferior
          [25, 28], [28, 29], [29, 8]
        ]
      };
    } else if (archetype === 'BEETLE') {
      return {
        primary: [
          // Sutura longitudinal central (separa los dos élitros)
          [6, 9], [7, 9], [9, 10], [10, 11], [11, 12], [12, 31],
          // Cabeza y hombros del escudo torácico
          [4, 6], [4, 7], [5, 6], [6, 7], [7, 8],
          // Antenas
          [4, 1], [1, 0], [4, 3], [3, 2],
          // Las 6 Patas articuladas (fémur y tarso)
          [5, 20], [20, 19], // Delantera izq
          [8, 21], [21, 22], // Delantera der
          [13, 24], [24, 23], // Media izq
          [16, 25], [25, 26], // Media der
          [15, 28], [28, 27], // Trasera izq
          [18, 29], [29, 30]  // Trasera der
        ],
        secondary: [
          // Costillas transversales del caparazón (nervaduras de quitina)
          [9, 13], [10, 13], [10, 14], [11, 14], [11, 15], [12, 15],
          [9, 16], [10, 16], [10, 17], [11, 17], [11, 18], [12, 18],
          [5, 13], [8, 16]
        ],
        perimeter: [
          // Borde exterior curvo de los élitros
          [13, 14], [14, 15], [15, 31],
          [16, 17], [17, 18], [18, 31]
        ]
      };
    }
    return { primary: [], secondary: [], perimeter: [] };
  }

  /**
   * Contorno polar característico de la membrana para cada arquetipo.
   * Diseñado matemáticamente para envolver a cada organismo con un margen uniforme y armónico
   * garantizando que los nodos queden 100% contenidos dentro de su frontera celular.
   */
  getArchetypeMembraneRadius(archetype, angle, R) {
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    let r = R;

    if (archetype === 'CELL') {
      // Célula Primordial: Esfera elástica con ondulación molecular
      r = R * (0.85 + 0.05 * Math.sin(3 * angle) + 0.03 * Math.cos(5 * angle));
    } else if (archetype === 'PLANT') {
      // HOJA BOTÁNICA: Óvalo lanceolado vertical que envuelve exactamente
      // el ápice superior (-0.88R), peciolo base (+0.82R) y márgenes (±0.58R).
      const Rv = 0.99; // Semieje vertical
      const Rh = 0.72; // Semieje horizontal
      const ellipseR = (Rv * Rh) / Math.hypot(Rh * sinA, Rv * cosA);
      // Sutil ahusamiento botánico (ápice superior ligeramente más agudo)
      r = R * ellipseR * (1.0 - 0.04 * sinA);
    } else if (archetype === 'FISH') {
      // PEZ HIDRODINÁMICO: Envuelve el hocico (+1.05R), aletas dorsal/ventral
      // y la COLA BÍFIDA EN V (-1.30R) en su totalidad.
      if (cosA >= 0) {
        // Región anterior (Hocico y tercio delantero)
        r = R * (0.65 + 0.53 * cosA - 0.06 * sinA);
      } else {
        // Región posterior (Pedúnculo caudal y aleta bífida en V)
        const u = -cosA; // 0 en el centro, 1 en el extremo posterior
        const sin2A = Math.sin(2 * angle);
        // Los dos lóbulos caudales se expanden armónicamente y la muesca central queda en 1.12R
        r = R * (0.66 + 0.46 * u + 0.92 * u * sin2A * sin2A);
      }
    } else if (archetype === 'BEETLE') {
      // ESCARABAJO: Escudo acorazado que envuelve cabeza, antenas, élitros y las 6 patas
      const Rv = 1.02; // Semieje vertical
      const Rh = 0.92; // Semieje horizontal
      const baseR = (Rv * Rh) / Math.hypot(Rh * sinA, Rv * cosA);
      // Refuerzo en hombros torácicos (cos2A) y cabeza/antenas (-sinA)
      const shoulderBoost = 0.05 * Math.cos(2 * angle) - 0.05 * sinA;
      r = R * (baseR + shoulderBoost);
    }

    return Math.max(R * 0.40, r);
  }

  resize(width, height) {
    this.cx = width / 2;
    this.cy = height / 2;
    // Escala proporcional garantizando visibilidad en cualquier resolución
    this.baseRadius = Math.min(width, height) * 0.17;

    // Actualizar coordenadas de destino de la red según nueva escala
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.nodes.length; i++) {
      const targetRadius = Math.sqrt((i + 1) / this.nodeCount) * (this.baseRadius * 0.72);
      const targetAngle = i * goldenAngle;
      this.nodes[i].targetX = Math.cos(targetAngle) * targetRadius;
      this.nodes[i].targetY = Math.sin(targetAngle) * targetRadius;
    }
  }

  _initNodes() {
    this.nodes = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Espiral áurea de empaquetamiento biológico

    for (let i = 0; i < this.nodeCount; i++) {
      // Dispersión caótica amplia por todo el espacio (Acto I inicial)
      const initAngle = Math.random() * Math.PI * 2;
      const initDist = 90 + Math.random() * 280;

      // Coordenada objetivo para la red que se fabrica a sí misma
      const targetRadius = Math.sqrt((i + 1) / this.nodeCount) * (this.baseRadius * 0.72);
      const targetAngle = i * goldenAngle;
      const targetX = Math.cos(targetAngle) * targetRadius;
      const targetY = Math.sin(targetAngle) * targetRadius;

      this.nodes.push({
        x: Math.cos(initAngle) * initDist,
        y: Math.sin(initAngle) * initDist,
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.5) * 2.4,
        targetX,
        targetY,
        radius: 3.5 + Math.random() * 2.5,
        energy: 0.5 + Math.random() * 0.5,
        pulseOffset: Math.random() * Math.PI * 2,
        willFactor: 0
      });
    }
  }

  _initMembranePoints() {
    this.points = [];
    const step = (Math.PI * 2) / this.pointCount;
    for (let i = 0; i < this.pointCount; i++) {
      const angle = i * step;
      this.points.push({
        angle,
        radius: this.baseRadius,
        restRadius: this.baseRadius,
        velocity: 0,
        displacement: 0
      });
    }
  }

  /**
   * Actualiza la física de los nodos internos y los puntos de la membrana.
   */
  update(elapsedTime, systemEnergy, dt = 0.016) {
    this.systemEnergy = systemEnergy;

    // 1. Transición de Formación según los Actos
    if (elapsedTime < 15.0) {
      this.opacity = 0;
      this.coherence = 0.1;
    } else if (elapsedTime < 30.0) {
      // Tejer membrana progresivamente entre 15s y 24s
      this.opacity = Math.min(1.0, (elapsedTime - 15.0) / 9.0);
      this.coherence = 0.2 + ((elapsedTime - 15.0) / 15.0) * 0.5;
    } else if (elapsedTime < 48.0) {
      this.opacity = 1.0;
      this.coherence = 0.7;
    } else {
      this.opacity = 1.0;
      this.coherence = 1.0;
    }

    // 2. Dinámica de los Nodos Internos (Autoproducción molecular y fuerza de voluntad)
    this.lastElapsedTime = elapsedTime;
    const growth = this.getGrowthFactor(elapsedTime);
    const currentRadius = this.baseRadius * growth;

    // Autoproducción periódica de nuevos componentes moleculares a partir de los 15s
    if (elapsedTime >= 15.0 && this.nodes.length < this.maxNodes) {
      const spawnInterval = elapsedTime < 30.0 ? 3.5 : 2.8;
      if (elapsedTime - this.lastSpawnTime > spawnInterval) {
        this.lastSpawnTime = elapsedTime;
        const birthDist = Math.random() * currentRadius * 0.35;
        const birthAngle = Math.random() * Math.PI * 2;
        this.spawnNewComponent(Math.cos(birthAngle) * birthDist, Math.sin(birthAngle) * birthDist);
      }
    }

    // Control de la fase de Autoconvocatoria y Voluntad (Acto I: "... una red que se fabrica a sí misma")
    let willFactor = 0;
    if (elapsedTime >= 5.0 && elapsedTime < 8.0) {
      willFactor = (elapsedTime - 5.0) / 3.0; // Rampa de fuerza/voluntad 0.0 -> 1.0
    } else if (elapsedTime >= 8.0 && elapsedTime < 15.0) {
      willFactor = 1.0;
    }

    // Metamorfosis morfogénica (Célula -> Planta -> Pez -> Escarabajo)
    const morph = this.getMorphState(elapsedTime);
    const isArchetypeMode = morph.from !== 'CELL' || morph.to !== 'CELL';
    const easedBlend = morph.blend * morph.blend * (3 - 2 * morph.blend);

    // Disparo del instante de autogénesis (~7.2s): Onda expansiva de impacto y resonancia
    if (elapsedTime >= 7.2 && !this.selfAssemblyTriggered) {
      this.selfAssemblyTriggered = true;
      this.assemblyWave = {
        active: true,
        radius: 12,
        maxRadius: currentRadius * 1.6,
        alpha: 1.0
      };
      if (this.onSelfAssembly) {
        this.onSelfAssembly();
      }
    }

    // Actualización de la onda expansiva de autogénesis
    if (this.assemblyWave.active) {
      this.assemblyWave.radius += dt * (currentRadius * 2.4);
      this.assemblyWave.alpha -= dt * 0.95;
      if (this.assemblyWave.alpha <= 0 || this.assemblyWave.radius >= this.assemblyWave.maxRadius) {
        this.assemblyWave.active = false;
      }
    }

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.willFactor = willFactor;

      if (elapsedTime < 5.0) {
        // Fase 1: Caos previo, movimiento libre con rebote perimetral
        n.x += n.vx;
        n.y += n.vy;
        n.pulse = 1.0 + Math.sin(elapsedTime * 4.5 + n.pulseOffset) * 0.25 * (systemEnergy + 0.2);
        if (Math.abs(n.x) > this.cx * 0.85) n.vx *= -1;
        if (Math.abs(n.y) > this.cy * 0.85) n.vy *= -1;
      } else if (elapsedTime < 15.0) {
        // Fase 2: Voluntad activa y autogénesis (... "una red que se fabrica a sí misma")
        const dx = n.targetX - n.x;
        const dy = n.targetY - n.y;

        const force = 0.04 + willFactor * 0.16;
        n.vx = n.vx * (1.0 - willFactor * 0.09) + dx * force;
        n.vy = n.vy * (1.0 - willFactor * 0.09) + dy * force;

        const currentSpeed = Math.hypot(n.vx, n.vy);
        const maxSpeed = 8.5;
        if (currentSpeed > maxSpeed) {
          n.vx = (n.vx / currentSpeed) * maxSpeed;
          n.vy = (n.vy / currentSpeed) * maxSpeed;
        }

        n.x += n.vx;
        n.y += n.vy;
        n.pulse = 1.0 + Math.sin(elapsedTime * 8.0 + n.pulseOffset) * 0.45 * (1 + willFactor);
      } else {
        // Fase 3 (Actos II-IV): Metamorfosis viva hacia arquetipos nítidos
        const pFrom = this.getArchetypeCoord(morph.from, i, this.nodes.length, currentRadius, elapsedTime);
        const pTo = this.getArchetypeCoord(morph.to, i, this.nodes.length, currentRadius, elapsedTime);

        n.targetX = pFrom.x * (1 - easedBlend) + pTo.x * easedBlend;
        n.targetY = pFrom.y * (1 - easedBlend) + pTo.y * easedBlend;

        const dx = n.targetX - n.x;
        const dy = n.targetY - n.y;

        // Tensión morfológica firme para que la silueta sea inmediatamente reconocible y estable
        const morphTension = isArchetypeMode ? (morph.blend > 0 ? 0.14 : 0.11) : 0.05;
        const damping = isArchetypeMode ? 0.80 : 0.88;

        n.vx = n.vx * damping + dx * morphTension;
        n.vy = n.vy * damping + dy * morphTension;

        // Crecimiento de nodos recién sintetizados
        if (n.birthProgress !== undefined && n.birthProgress < 1.0) {
          n.birthProgress += dt * 0.75;
          n.radius = n.maxRadius * Math.min(1.0, n.birthProgress);
        }

        n.pulse = 1.0 + Math.sin(elapsedTime * 4.5 + n.pulseOffset) * 0.22 * (systemEnergy + 0.2);
        n.x += n.vx;
        n.y += n.vy;

        // Repulsión sutil sólo cuando no estamos en un arquetipo estricto
        if (!isArchetypeMode) {
          for (let j = i + 1; j < this.nodes.length; j++) {
            const nb = this.nodes[j];
            const sepX = n.x - nb.x;
            const sepY = n.y - nb.y;
            const sepDist = Math.hypot(sepX, sepY);

            if (sepDist < 20 && sepDist > 0.01) {
              const repulse = (20 - sepDist) * 0.025;
              const rx = (sepX / sepDist) * repulse;
              const ry = (sepY / sepDist) * repulse;
              n.vx += rx;
              n.vy += ry;
              nb.vx -= rx;
              nb.vy -= ry;
            }
          }
        }
      }
    }

    // 3. Física de la Membrana Elástica (Adaptación morfogénica continua)
    if (this.opacity > 0) {
      const k = 46.0;      // Rigidez elástica
      const damping = 4.5; // Amortiguamiento
      // Acoplamiento suave para preservar fielmente la silueta (cola de pez en V, hombros escarabajo, etc.)
      const coupling = isArchetypeMode ? 3.6 : 7.2;

      for (let i = 0; i < this.pointCount; i++) {
        const pt = this.points[i];

        // Contorno polar del arquetipo en metamorfosis
        const rFrom = this.getArchetypeMembraneRadius(morph.from, pt.angle, currentRadius);
        const rTo = this.getArchetypeMembraneRadius(morph.to, pt.angle, currentRadius);
        let baseMorphR = rFrom * (1 - easedBlend) + rTo * easedBlend;

        // Respiración orgánica básica
        const breathing = Math.sin(elapsedTime * 2.8) * (3.5 * growth) + systemEnergy * (14 * growth);

        // CINEMÁTICA DE NATACIÓN EN LA MEMBRANA DEL PEZ:
        // Si estamos en modo PEZ, la cola de la membrana ondea en sincronía exacta con los nodos de la aleta caudal
        if (morph.to === 'FISH' || (morph.from === 'FISH' && morph.blend < 0.6)) {
          const cosA = Math.cos(pt.angle);
          if (cosA < -0.15) {
            const waveAmp = -cosA;
            const swimOffset = Math.sin(elapsedTime * 4.8 - (cosA * 2.8)) * (currentRadius * 0.10 * waveAmp) * Math.sin(pt.angle);
            baseMorphR += swimOffset;
          }
        }

        pt.restRadius = baseMorphR + breathing;

        const prev = this.points[(i - 1 + this.pointCount) % this.pointCount];
        const next = this.points[(i + 1) % this.pointCount];

        const springForce = -k * pt.displacement;
        const neighborForce = coupling * ((prev.displacement - pt.displacement) + (next.displacement - pt.displacement));
        const dampingForce = -damping * pt.velocity;

        const totalForce = springForce + neighborForce + dampingForce;
        pt.velocity += totalForce * dt;
        pt.displacement += pt.velocity * dt;
        pt.radius = pt.restRadius + pt.displacement;
      }
    }

    // 4. Limpieza de enlaces temporales de reorganización
    for (let i = this.transientLinks.length - 1; i >= 0; i--) {
      this.transientLinks[i].life -= dt * 1.5;
      if (this.transientLinks[i].life <= 0) {
        this.transientLinks.splice(i, 1);
      }
    }
  }

  /**
   * Deformación elástica de la membrana ante un impacto de perturbación externa.
   */
  deformAtAngle(angle, impactForce = 1.0) {
    if (this.opacity <= 0.05) return;

    let normAngle = angle % (Math.PI * 2);
    if (normAngle < 0) normAngle += Math.PI * 2;

    const step = (Math.PI * 2) / this.pointCount;
    const centerIndex = Math.round(normAngle / step) % this.pointCount;

    const impulse = -impactForce * 20;
    this.points[centerIndex].velocity += impulse;

    const left1 = (centerIndex - 1 + this.pointCount) % this.pointCount;
    const right1 = (centerIndex + 1) % this.pointCount;
    this.points[left1].velocity += impulse * 0.65;
    this.points[right1].velocity += impulse * 0.65;

    // Generar nuevos enlaces internos de acoplamiento estructural
    if (this.nodes.length >= 2) {
      const idxA = Math.floor(Math.random() * this.nodes.length);
      const idxB = (idxA + 1 + Math.floor(Math.random() * (this.nodes.length - 1))) % this.nodes.length;
      this.transientLinks.push({
        a: idxA,
        b: idxB,
        life: 1.2,
        intensity: Math.min(1.0, impactForce)
      });
    }

    if (this.nodes.length < this.maxNodes) {
      const growth = this.getGrowthFactor(this.lastElapsedTime || 30.0);
      const currentRadius = this.baseRadius * growth;
      const spawnX = Math.cos(angle) * (currentRadius * 0.45);
      const spawnY = Math.sin(angle) * (currentRadius * 0.45);
      this.spawnNewComponent(spawnX, spawnY);
    }
  }

  /**
   * Retorna el radio de la membrana en un ángulo específico.
   */
  getRadiusAtAngle(angle) {
    if (this.opacity <= 0.05) {
      const growth = this.getGrowthFactor(this.lastElapsedTime || 0);
      return this.baseRadius * growth;
    }
    let normAngle = angle % (Math.PI * 2);
    if (normAngle < 0) normAngle += Math.PI * 2;

    const step = (Math.PI * 2) / this.pointCount;
    const index = Math.floor(normAngle / step);
    const frac = (normAngle - index * step) / step;

    const r1 = this.points[index % this.pointCount].radius;
    const r2 = this.points[(index + 1) % this.pointCount].radius;
    return r1 + (r2 - r1) * frac;
  }

  /**
   * Renderizado en Canvas 2D con estética dark bioluminiscente.
   * ORDEN DE CAPAS (atrás → adelante):
   *   1. Membrana envolvente (fondo translúcido + borde luminoso)
   *   2. Onda expansiva de autogénesis
   *   3. Enlaces esqueléticos anatómicos
   *   4. Nodos bioluminiscentes
   *   5. Rasgos icónicos (ojo del pez, antenas del escarabajo, ápice de la hoja)
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.cx, this.cy);

    const t = this.lastElapsedTime || 0;
    const growth = this.getGrowthFactor(t);
    const currentBaseRadius = this.baseRadius * growth;
    const willActive = this.nodes[0] ? (this.nodes[0].willFactor || 0) : 0;
    const morph = this.getMorphState(t);
    const isArchetypeMode = morph.from !== 'CELL' || morph.to !== 'CELL';

    // ==========================================
    // 1. MEMBRANA CELULAR AUTODELIMITADA — SE DIBUJA PRIMERO (DETRÁS DE TODO)
    //    La frontera envuelve al organismo como fondo; los nodos y enlaces se pintan encima.
    // ==========================================
    if (this.opacity > 0.01) {
      ctx.beginPath();

      const pts = this.points;
      const len = pts.length;

      const p0 = pts[len - 1];
      const p1 = pts[0];
      const x0 = Math.cos(p0.angle) * p0.radius;
      const y0 = Math.sin(p0.angle) * p0.radius;
      const x1 = Math.cos(p1.angle) * p1.radius;
      const y1 = Math.sin(p1.angle) * p1.radius;

      let midX = (x0 + x1) / 2;
      let midY = (y0 + y1) / 2;
      ctx.moveTo(midX, midY);

      for (let i = 0; i < len; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % len];

        const cx = Math.cos(curr.angle) * curr.radius;
        const cy = Math.sin(curr.angle) * curr.radius;
        const nx = Math.cos(next.angle) * next.radius;
        const ny = Math.sin(next.angle) * next.radius;

        const nextMidX = (cx + nx) / 2;
        const nextMidY = (cy + ny) / 2;

        ctx.quadraticCurveTo(cx, cy, nextMidX, nextMidY);
      }
      ctx.closePath();

      // Relleno interior translúcido según el organismo
      let innerCol = `rgba(139, 92, 246, ${0.07 * this.opacity + this.systemEnergy * 0.05})`;
      let strokeColPrimary = `rgba(139, 92, 246, ${0.82 * this.opacity})`;
      let strokeColSecondary = `rgba(217, 70, 239, ${0.40 * this.opacity})`;
      let shadowMemb = '#8b5cf6';

      if (morph.to === 'PLANT') {
        innerCol = `rgba(52, 211, 153, ${0.06 * this.opacity + this.systemEnergy * 0.04})`;
        strokeColPrimary = `rgba(52, 211, 153, ${0.80 * this.opacity})`;
        strokeColSecondary = `rgba(34, 211, 238, ${0.40 * this.opacity})`;
        shadowMemb = '#10b981';
      } else if (morph.to === 'FISH') {
        innerCol = `rgba(56, 189, 248, ${0.06 * this.opacity + this.systemEnergy * 0.04})`;
        strokeColPrimary = `rgba(56, 189, 248, ${0.80 * this.opacity})`;
        strokeColSecondary = `rgba(139, 92, 246, ${0.40 * this.opacity})`;
        shadowMemb = '#38bdf8';
      } else if (morph.to === 'BEETLE') {
        innerCol = `rgba(217, 70, 239, ${0.06 * this.opacity + this.systemEnergy * 0.04})`;
        strokeColPrimary = `rgba(217, 70, 239, ${0.80 * this.opacity})`;
        strokeColSecondary = `rgba(192, 132, 252, ${0.40 * this.opacity})`;
        shadowMemb = '#d946ef';
      }

      ctx.fillStyle = innerCol;
      ctx.fill();

      // Trazo perimetral con halo bioluminiscente
      ctx.strokeStyle = strokeColPrimary;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = shadowMemb;
      ctx.shadowBlur = 16 * this.opacity;
      ctx.stroke();

      // Segundo anillo sutil de contraste
      ctx.strokeStyle = strokeColSecondary;
      ctx.lineWidth = 1.0;
      ctx.shadowColor = strokeColSecondary;
      ctx.shadowBlur = 8 * this.opacity;
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    // 2. Onda expansiva de Autogénesis ("... una red que se fabrica a sí misma")
    if (this.assemblyWave && this.assemblyWave.active && this.assemblyWave.alpha > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.assemblyWave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(217, 70, 239, ${this.assemblyWave.alpha * 0.95})`;
      ctx.lineWidth = 3.5 * this.assemblyWave.alpha;
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 25 * this.assemblyWave.alpha;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // ========================================================
    // 3. ENLACES ESTRUCTURALES Y ESQUELÉTICOS SEGÚN EL ORGANISMO
    // ========================================================
    if (!isArchetypeMode) {
      // MODO CÉLULA PRIMORDIAL (Acto I y principio de Acto II): Red libre autoensamblada
      const maxLinkDist = currentBaseRadius * (0.55 + willActive * 0.18);
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const na = this.nodes[i];
          const nb = this.nodes[j];
          const dist = Math.hypot(na.x - nb.x, na.y - nb.y);

          if (dist < maxLinkDist) {
            const alpha = (1 - dist / maxLinkDist) * (0.35 + this.systemEnergy * 0.45 + willActive * 0.45);
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);

            if (willActive > 0.15) {
              ctx.strokeStyle = `rgba(217, 70, 239, ${Math.min(1.0, alpha * 1.3)})`;
              ctx.lineWidth = 1.4 + willActive * 1.6;
              ctx.shadowColor = '#d946ef';
              ctx.shadowBlur = 12 * willActive;
            } else {
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
              ctx.lineWidth = 1.2;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }
    } else {
      // MODO METAMORFOSIS VIVA (Planta -> Pez -> Escarabajo):
      // Dibuja los enlaces esqueléticos anatómicos con alta nitidez y contraste bioluminiscente.

      const drawLinkSet = (archetype, weightFactor = 1.0) => {
        const links = this.getStructuralLinks(archetype);

        let colPrimary = 'rgba(217, 70, 239, ';     // Magenta
        let colSecondary = 'rgba(139, 92, 246, ';   // Violeta
        let colPerimeter = 'rgba(34, 211, 238, ';   // Cian
        let shadowCol = '#d946ef';

        if (archetype === 'PLANT') {
          colPrimary = 'rgba(52, 211, 153, ';     // Esmeralda botánico
          colSecondary = 'rgba(34, 211, 238, ';   // Cian nervaduras
          colPerimeter = 'rgba(168, 85, 247, ';   // Violeta contorno
          shadowCol = '#10b981';
        } else if (archetype === 'FISH') {
          colPrimary = 'rgba(56, 189, 248, ';     // Celeste océano
          colSecondary = 'rgba(192, 132, 252, ';  // Violeta lila
          colPerimeter = 'rgba(34, 211, 238, ';   // Cian brillante
          shadowCol = '#38bdf8';
        } else if (archetype === 'BEETLE') {
          colPrimary = 'rgba(232, 121, 249, ';    // Magenta radiante
          colSecondary = 'rgba(244, 63, 94, ';    // Rosa carmesí quitina
          colPerimeter = 'rgba(192, 132, 252, ';  // Púrpura élitros
          shadowCol = '#e879f9';
        }

        // A. Enlaces primarios (Eje vertebral, Tallo, Sutura, Patas)
        ctx.shadowColor = shadowCol;
        ctx.shadowBlur = 12 * weightFactor;
        for (const [idxA, idxB] of links.primary) {
          const na = this.nodes[idxA];
          const nb = this.nodes[idxB];
          if (na && nb) {
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `${colPrimary}${(0.95 * weightFactor).toFixed(3)})`;
            ctx.lineWidth = 2.8;
            ctx.stroke();
          }
        }

        // B. Enlaces secundarios (Nervaduras, Radios aletas, Costillas)
        ctx.shadowBlur = 6 * weightFactor;
        for (const [idxA, idxB] of links.secondary) {
          const na = this.nodes[idxA];
          const nb = this.nodes[idxB];
          if (na && nb) {
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `${colSecondary}${(0.70 * weightFactor).toFixed(3)})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
        }

        // C. Enlaces perimétricos (Contorno del cuerpo / margen foliar)
        ctx.shadowBlur = 8 * weightFactor;
        for (const [idxA, idxB] of links.perimeter) {
          const na = this.nodes[idxA];
          const nb = this.nodes[idxB];
          if (na && nb) {
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `${colPerimeter}${(0.80 * weightFactor).toFixed(3)})`;
            ctx.lineWidth = 2.0;
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      };

      if (morph.from === morph.to) {
        drawLinkSet(morph.to, 1.0);
      } else {
        const b = morph.blend;
        if (morph.from !== 'CELL') drawLinkSet(morph.from, 1.0 - b);
        drawLinkSet(morph.to, b);
      }

      // Enlaces internos citoplasmáticos muy cortos para textura biológica sutil (sin saturar)
      const maxFineDist = currentBaseRadius * 0.22;
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const na = this.nodes[i];
          const nb = this.nodes[j];
          const dist = Math.hypot(na.x - nb.x, na.y - nb.y);
          if (dist < maxFineDist) {
            const alpha = (1 - dist / maxFineDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }
    }

    // Enlaces de reorganización por impacto (magenta brillante reactivo)
    for (let i = 0; i < this.transientLinks.length; i++) {
      const link = this.transientLinks[i];
      const na = this.nodes[link.a];
      const nb = this.nodes[link.b];
      if (na && nb) {
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(217, 70, 239, ${link.life * 0.9})`;
        ctx.lineWidth = 2.2 * link.life;
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 14 * link.life;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // ==========================================
    // 4. NODOS INTERNOS BIOLUMINISCENTES
    // ==========================================
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const currentRadius = n.radius * (n.pulse || 1.0);

      ctx.beginPath();
      ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);

      let nodeColor = '#8b5cf6'; // Violeta base
      if (willActive > 0.3) {
        nodeColor = '#c084fc';
      } else if (morph.to === 'PLANT') {
        nodeColor = (i === 0) ? '#34d399' : (i <= 6 ? '#22d3ee' : '#a855f7');
      } else if (morph.to === 'FISH') {
        nodeColor = (i === 1) ? '#ffffff' : (i === 19 || i === 22 ? '#38bdf8' : '#818cf8');
      } else if (morph.to === 'BEETLE') {
        nodeColor = (i === 0 || i === 2) ? '#22d3ee' : (i >= 19 ? '#e879f9' : '#c084fc');
      }

      ctx.fillStyle = nodeColor;
      ctx.shadowColor = nodeColor;
      ctx.shadowBlur = 12 + willActive * 14;
      ctx.fill();

      // Centro luminoso incandescente
      ctx.beginPath();
      ctx.arc(n.x, n.y, currentRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // ===================================================
    // 5. RASGOS ANATÓMICOS ICÓNICOS (Signos distintivos clave)
    // ===================================================
    if (morph.to === 'FISH' || (morph.from === 'FISH' && morph.blend < 0.6)) {
      // OJO BIOLUMINISCENTE DEL PEZ (Nodo 1): Iris cian, pupila oscura, destello blanco
      const nEye = this.nodes[1];
      if (nEye) {
        ctx.save();
        // Anillo exterior cian
        ctx.beginPath();
        ctx.arc(nEye.x, nEye.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 16;
        ctx.fill();

        // Pupila oscura
        ctx.beginPath();
        ctx.arc(nEye.x, nEye.y, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#05030a';
        ctx.fill();

        // Destello especular blanco
        ctx.beginPath();
        ctx.arc(nEye.x + 1.2, nEye.y - 1.2, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }
    } else if (morph.to === 'BEETLE' || (morph.from === 'BEETLE' && morph.blend < 0.6)) {
      // ANTENAS Y GARRAS DEL ESCARABAJO: Puntas incandescentes
      ctx.save();
      const tips = [this.nodes[0], this.nodes[2], this.nodes[19], this.nodes[22], this.nodes[23], this.nodes[26], this.nodes[27], this.nodes[30]];
      for (const pt of tips) {
        if (pt) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4.0, 0, Math.PI * 2);
          ctx.fillStyle = '#22d3ee';
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 14;
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (morph.to === 'PLANT' || (morph.from === 'PLANT' && morph.blend < 0.6)) {
      // ÁPICE FOLIAR DE LA PLANTA: Gema esmeralda
      const nApex = this.nodes[0];
      if (nApex) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(nApex.x, nApex.y, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }
}
